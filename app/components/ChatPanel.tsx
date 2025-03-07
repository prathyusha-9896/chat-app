'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { IoSend, IoHappy, IoMic,} from 'react-icons/io5';
import { VscSmiley } from 'react-icons/vsc';
import { useGroupContext } from './GroupContext';
import { v4 as uuidv4 } from 'uuid';
import EmojiPicker from 'emoji-picker-react';
import { LuClock } from 'react-icons/lu';
import { GrAttachment } from 'react-icons/gr';
import { PiClockClockwiseBold } from 'react-icons/pi';
import { RiFileList2Fill } from 'react-icons/ri';

interface ChatPanelProps {
  id: number;
  senderId?: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ id, senderId }) => {
  const { messages, fetchMessages } = useGroupContext();
  const [newMessage, setNewMessage] = useState<string>('');
  const [dummyUserId] = useState(senderId || `guest_${uuidv4().slice(0, 8)}`);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [, setUploading] = useState(false);

  useEffect(() => {
    fetchMessages(id);

    const messageSubscription = supabase
      .channel(`messages:group_id=eq.${id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        () => {
          fetchMessages(id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [id, fetchMessages]);

  // ✅ Handle Emoji Click
  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  // ✅ Handle Sending Messages
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const { error } = await supabase
      .from('messages')
      .insert([
        {
          group_id: id,
          sender_id: dummyUserId,
          message_text: newMessage,
          sent_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Error sending message:', error.message);
    } else {
      setNewMessage('');
    }
  };

  // ✅ Handle File Selection & Upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];

    setUploading(true);
    const filePath = `uploads/${uuidv4()}-${file.name}`;

    // ✅ Upload file to Supabase Storage
    const { error } = await supabase.storage
      .from('chat-uploads') // Ensure this bucket exists
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading file:', error.message);
      setUploading(false);
      return;
    }

    // ✅ Get Public URL of the uploaded file
    const { data: { publicUrl } } = supabase.storage.from('chat-uploads').getPublicUrl(filePath);

    // ✅ Send the file URL as a message
    await supabase.from('messages').insert([
      {
        group_id: id,
        sender_id: dummyUserId,
        message_text: publicUrl, // Store file URL in messages
        sent_at: new Date().toISOString(),
      },
    ]);

    setUploading(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-chat-background relative">
      {/* ✅ Chat Messages List */}
      <div className="flex-1 overflow-y-auto px-6 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">No messages yet.</div>
        ) : (
          messages.map((message) => (
            <div
              key={message.message_id}
              className={`flex ${message.sender_id === dummyUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-lg p-3 max-w-xs shadow-md ${
                  message.sender_id === dummyUserId ? 'bg-green-500 text-right' : 'bg-white text-black'
                }`}
              >
                {/* ✅ Show File Preview if URL */}
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
      </div>

      {/* ✅ Message Input Box */}
      <div className="p-3 bg-white items-center rounded-lg shadow-inner relative">
        {/* ✅ Emoji Picker (Hidden by Default) */}
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-5 z-50 shadow-lg">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        {/* ✅ Hidden File Input */}
        <input
          type="file"
          accept="image/*,video/*,application/pdf"
          className="hidden"
          id="fileUpload"
          onChange={handleFileUpload}
        />

        {/* ✅ Message Input Form */}
        <form onSubmit={handleSendMessage} className="flex flex-1">
          <input
            type="text"
            placeholder="Message..."
            className="flex-1 p-2 border-none rounded-lg outline-none bg-white text-black"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="ml-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
            <IoSend size={20} />
          </button>
        </form>

        {/* ✅ Icons Section */}
        <div className="flex items-start">
          {/* Attachments */}
          <GrAttachment 
            className="text-gray-500 text-xl cursor-pointer hover:text-black mx-2"
            onClick={() => document.getElementById('fileUpload')?.click()} // ✅ Open File Picker
          />
          {/* Emoji Picker Toggle */}
          <IoHappy
            className="text-gray-500 text-xl cursor-pointer hover:text-black mx-2"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          />
          <VscSmiley  className="text-gray-500 text-xl cursor-pointer hover:text-black mx-2" />
          <LuClock  className="text-gray-500 text-xl cursor-pointer hover:text-black mx-2" />
          <PiClockClockwiseBold  className="text-gray-500 text-xl cursor-pointer hover:text-black mx-2" />
          <RiFileList2Fill  className="text-gray-500 text-xl cursor-pointer hover:text-black mx-2" />
          <IoMic className="text-gray-500 text-xl cursor-pointer hover:text-black mx-2" />
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
