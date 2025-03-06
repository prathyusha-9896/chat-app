'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ChatMessage {
  id: number;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  sent_at: string;
}

interface ChatPanelProps {
  groupId: number;
  senderId: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ groupId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [receiverId] = useState<string>('user2'); // ✅ Temporary receiver ID (Change based on UI)

  useEffect(() => {
    async function fetchMessages() {
      if (!groupId) return;

      console.log("Fetching messages for group:", groupId);

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('group_id', groupId)
        .order('sent_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error.message);
      } else {
        console.log("Fetched messages:", data);
        setMessages(data || []);
      }
    }

    fetchMessages();
  }, [groupId]); // ✅ Re-fetch messages when group changes

  // ✅ Real-time subscription to new messages (only for this group)
  useEffect(() => {
    const messageSubscription = supabase
      .channel(`messages:group_id=eq.${groupId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          console.log("New message received:", payload.new);
          setMessages((prevMessages) => [...prevMessages, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [groupId]);

  // ✅ Handle sending messages to another user
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const senderId = 'user1'; // ✅ Static sender ID (Change based on UI)
    
    const { error } = await supabase
      .from('messages')
      .insert([
        {
          group_id: groupId,
          sender_id: senderId, // ✅ Now includes sender
          receiver_id: receiverId, // ✅ Includes receiver
          message_text: newMessage,
          sent_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error('Error sending message:', error.message);
    } else {
      setNewMessage(''); // ✅ Clear input field after sending
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4">
      {/* ✅ Chat Messages List */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">No messages yet.</div>
        ) : (
          messages.map((message, index) => (
            <div key={message.id || index} className="mb-2"> {/* ✅ Fix: Unique key */}
              <div className={`text-sm ${message.sender_id === 'user1' ? 'text-blue-600' : 'text-gray-600'}`}>
                {message.sender_id === 'user1' ? 'You' : message.sender_id}
              </div>
              <div className="text-md">{message.message_text}</div>
              <div className="text-xs text-gray-400">{new Date(message.sent_at).toLocaleString()}</div>
            </div>
          ))
        )}
      </div>


      {/* ✅ Message Input Box */}
      <div className="mt-4">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            placeholder="Type a message"
            className="border rounded py-2 px-4 w-full"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
