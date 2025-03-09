'use client';
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { IoSend, IoMic } from 'react-icons/io5';
import { GrAttachment } from 'react-icons/gr';
import { VscSmiley } from 'react-icons/vsc';
import EmojiPicker from 'emoji-picker-react';
import { v4 as uuidv4 } from 'uuid';
import { useGroupContext } from './GroupContext';

interface ChatPanelProps {
  id: number;
  senderId?: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ id, senderId }) => {
  const { messages, fetchMessages } = useGroupContext();
  const [newMessage, setNewMessage] = useState('');
  const [dummyUserId] = useState(senderId || `guest_${uuidv4().slice(0, 8)}`);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);
  const [oldestMessageTimestamp, setOldestMessageTimestamp] = useState<string | null>(null);
  const [atBottom, setAtBottom] = useState(true);

  useEffect(() => {
    fetchMessages(id);
  }, [id, fetchMessages]);

  useEffect(() => {
    if (messages.length > 0) {
      setOldestMessageTimestamp(messages[0].sent_at);
    }
  }, [messages]);

  // ✅ Detect if user is at bottom before new messages arrive
  const checkIfAtBottom = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setAtBottom(scrollHeight - scrollTop <= clientHeight + 50);
  };

  // ✅ Load older messages when scrolling up
  const handleScroll = async () => {
    if (!chatContainerRef.current || loadingOlderMessages || !oldestMessageTimestamp) return;

    if (chatContainerRef.current.scrollTop === 0) {
      setLoadingOlderMessages(true);
      const prevScrollHeight = chatContainerRef.current.scrollHeight;
      await fetchOlderMessages(id, oldestMessageTimestamp);
      setTimeout(() => {
        chatContainerRef.current!.scrollTop = chatContainerRef.current!.scrollHeight - prevScrollHeight;
      }, 100);
      setLoadingOlderMessages(false);
    }
  };

  const fetchOlderMessages = async (groupId: number, beforeTimestamp: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('group_id', groupId)
      .lt('sent_at', beforeTimestamp)
      .order('sent_at', { ascending: true })
      .limit(10);

    if (!error && data.length > 0) {
      setOldestMessageTimestamp(data[0].sent_at);
    }
  };

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const { error } = await supabase.from('messages').insert([
      {
        group_id: id,
        sender_id: dummyUserId,
        message_text: newMessage,
        sent_at: new Date().toISOString(),
      },
    ]);

    if (!error) {
      setNewMessage('');
      if (atBottom) {
        setTimeout(() => {
          chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
        }, 100);
      }
    }
  };

  return (
    <section className="flex-1 flex flex-col h-full bg-chat-background relative">
      {/* ✅ Chat Messages List (Newest at bottom) */}
      <article
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-6 space-y-2 hide-scrollbar flex flex-col-reverse"
        onScroll={() => {
          checkIfAtBottom();
          handleScroll();
        }}
      >
        {loadingOlderMessages && <p className="text-center text-gray-500">Loading older messages...</p>}

        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet.</p>
        ) : (
          [...messages].reverse().map((message) => (
            <div key={message.message_id} className={`flex ${message.sender_id === dummyUserId ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg p-3 max-w-xs shadow-md ${message.sender_id === dummyUserId ? 'bg-green-500 text-right' : 'bg-white text-black'}`}>
                {message.message_text.startsWith('http') ? (
                  <a href={message.message_text} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                    📎 View File
                  </a>
                ) : (
                  <p className="text-sm">{message.message_text}</p>
                )}
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
      </article>

      {/* ✅ Message Input Box */}
      <footer className="p-3 bg-white rounded-lg shadow-inner relative flex flex-col">
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-5 z-50 shadow-lg">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        {/* ✅ Message Input Form */}
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Message..."
            className="flex-1 p-2 border-none rounded-lg outline-none bg-white text-black"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600">
            <IoSend size={20} />
          </button>
        </form>

        {/* ✅ Icons Below Input */}
        <div className="flex items-center justify-start space-x-3 text-gray-500 mt-2">
          <button className="cursor-pointer hover:text-black text-lg">
            <GrAttachment />
          </button>
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="cursor-pointer hover:text-black text-lg">
            <VscSmiley />
          </button>
          <button className="cursor-pointer hover:text-black text-lg">
            <IoMic />
          </button>
        </div>
      </footer>
    </section>
  );
};

export default ChatPanel;
