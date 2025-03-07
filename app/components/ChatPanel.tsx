'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { IoSend } from 'react-icons/io5';

interface ChatMessage {
  message_id: number; // ✅ Ensure it's a number (INTEGER)
  sender_id: string;
  receiver_id: string;
  message_text: string;
  sent_at: string;
}

interface ChatPanelProps {
  groupId: number;
  senderId: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ groupId, senderId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    async function fetchMessages() {
      if (!groupId) return;

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('group_id', groupId)
        .order('sent_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error.message);
      } else {
        // ✅ Ensure `message_id` is correctly handled
        setMessages(data || []);
      }
    }

    fetchMessages();

    const messageSubscription = supabase
      .channel(`messages:group_id=${groupId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              message_id: payload.new.message_id, // ✅ Use correct `message_id`
              sender_id: payload.new.sender_id,
              receiver_id: payload.new.receiver_id,
              message_text: payload.new.message_text,
              sent_at: payload.new.sent_at,
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [groupId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          group_id: groupId,
          sender_id: senderId,
          message_text: newMessage,
          sent_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Error sending message:', error.message);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message_id: data[0].message_id, // ✅ Use correct `message_id`
          sender_id: senderId,
          receiver_id: '',
          message_text: newMessage,
          sent_at: new Date().toISOString(),
        },
      ]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-chat-background">
      {/* ✅ Chat Messages List */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-6 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">No messages yet.</div>
        ) : (
          messages.map((message) => (
            <div key={message.message_id} className={`flex ${message.sender_id === senderId ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`rounded-lg p-3 max-w-xs shadow-md ${
                  message.sender_id === senderId ? 'bg-green-500 text-right' : 'bg-white text-black'
                }`}
              >
                <p className="text-sm">{message.message_text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(message.sent_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✅ Message Input Box */}
      <div className="mt-4 p-2 bg-white">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 p-2 border-none rounded-lg outline-none bg-white"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="ml-2 text-gray-800 px-4 py-2 rounded-lg">
            <IoSend size={20} fill="green" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
