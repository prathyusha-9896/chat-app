'use client';
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { IoSend, IoMic } from 'react-icons/io5';
import { GrAttachment } from 'react-icons/gr';
import { VscSmiley } from 'react-icons/vsc';
import { LuClock } from 'react-icons/lu';
import { PiClockClockwiseBold } from 'react-icons/pi';
import { RiFileList2Fill } from 'react-icons/ri';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [, setUploading] = useState(false);

  useEffect(() => {
    fetchMessages(id);

    const messageSubscription = supabase
      .channel(`messages:group_id=eq.${id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        () => fetchMessages(id)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [id, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

    if (!error) setNewMessage('');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];

    setUploading(true);
    const filePath = `uploads/${uuidv4()}-${file.name}`;

    const { error } = await supabase.storage.from('chat-uploads').upload(filePath, file);
    if (error) {
      console.error('Error uploading file:', error.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('chat-uploads').getPublicUrl(filePath);
    await supabase.from('messages').insert([
      {
        group_id: id,
        sender_id: dummyUserId,
        message_text: publicUrl,
        sent_at: new Date().toISOString(),
      },
    ]);

    setUploading(false);
  };

  return (
    <section className="flex-1 flex flex-col h-full bg-chat-background relative">
      {/* ✅ Chat Messages List */}
      <article className="flex-1 overflow-y-auto px-6 space-y-2 hide-scrollbar">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet.</p>
        ) : (
          messages.map((message) => (
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
        {/* ✅ Auto-scroll anchor */}
        <div ref={messagesEndRef}></div>
      </article>

      {/* ✅ Message Input Box */}
      <footer className="p-3 bg-white rounded-lg shadow-inner relative flex flex-col">
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-5 z-50 shadow-lg">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        {/* ✅ Hidden File Input */}
        <input type="file" accept="image/*,video/*,application/pdf" className="hidden" id="fileUpload" onChange={handleFileUpload} />

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
          <button onClick={() => document.getElementById('fileUpload')?.click()} className="cursor-pointer hover:text-black text-lg">
            <GrAttachment />
          </button>
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="cursor-pointer hover:text-black text-lg">
            <VscSmiley />
          </button>
          <button className="cursor-pointer hover:text-black text-lg">
            <LuClock />
          </button>
          <button className="cursor-pointer hover:text-black text-lg">
            <PiClockClockwiseBold />
          </button>
          <button className="cursor-pointer hover:text-black text-lg">
            <RiFileList2Fill />
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
