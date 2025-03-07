'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { IoSend } from 'react-icons/io5';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library

interface ChatMessage {
  id: string; // Ensure ID is always a string
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
        // ✅ Ensure IDs are unique by using UUID if missing
        setMessages(
          data?.map((msg) => ({
            ...msg,
            id: msg.id?.toString() || uuidv4(),
          })) || []
        );
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
              id: payload.new.id?.toString() || uuidv4(), // ✅ Ensure unique key
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

    const uniqueId = uuidv4(); // ✅ Generate unique ID for new messages

    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          id: uniqueId, // ✅ Use UUID instead of relying on Supabase-generated ID
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
          id: data[0].id || uniqueId, // ✅ Use the generated or stored ID
          sender_id: senderId,
          receiver_id: '', // Receiver ID is not needed for groups
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
            <div key={message.id} className={`flex ${message.sender_id === senderId ? 'justify-end' : 'justify-start'}`}>
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
