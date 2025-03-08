'use client';
import React, { useState } from 'react';
import { FaHome, FaImage, FaCog, FaUserFriends, FaBox } from 'react-icons/fa';
import Image from 'next/image';
import { BsChatDotsFill} from 'react-icons/bs';
import { IoTicketSharp } from 'react-icons/io5';
import { GoGraph } from 'react-icons/go';
import { TfiMenuAlt } from 'react-icons/tfi';
import { HiSpeakerphone } from 'react-icons/hi';
import { PiTreeStructure } from 'react-icons/pi';
import { RiContactsBookFill } from 'react-icons/ri';
import { MdChecklist } from 'react-icons/md';

const Sidebar: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('Chats');

  const menuItems = [
    { name: 'Home', icon: <FaHome size={18} /> },
    { name: 'Chats', icon: <BsChatDotsFill size={18} /> },
    { name: 'Ticket', icon: <IoTicketSharp size={18} /> },
    { name: 'Analytics', icon: <GoGraph size={18} /> },
    { name: 'Menu', icon: <TfiMenuAlt size={18} /> },
    { name: 'Speaker', icon: <HiSpeakerphone size={18} /> },
    { name: 'Database', icon: <PiTreeStructure size={18} /> },
    { name: 'Contact', icon: <RiContactsBookFill size={18} /> },
    { name: 'Gallery', icon: <FaImage size={18} /> },
    { name: 'Checklist', icon: <MdChecklist size={18} /> },
    { name: 'Settings', icon: <FaCog size={18} /> },
  ];

  return (
    <aside className="h-screen bg-white text-gray-600 flex flex-col items-center py-4 shadow-sm">
      {/* Logo */}
      <figure className="mb-3">
        <Image src="/image.png" alt="App Logo" width={30} height={30} />
      </figure>

      {/* Navigation */}
      <nav className="flex-1 w-full overflow-y-auto pb-4">
        <ul className="space-y-2 flex flex-col items-center mx-4">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`p-2 rounded-md cursor-pointer flex items-center justify-center w-full transition-colors ${
                activePage === item.name ? 'text-green-700 font-bold bg-gray-100' : 'hover:bg-gray-100'
              }`}
              onClick={() => setActivePage(item.name)}
            >
              {item.icon}
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="space-y-2 flex flex-col items-center pb-2 mt-auto">
        <FaUserFriends className="text-gray-600 p-3 cursor-pointer hover:bg-gray-100" />
        <FaBox className="text-gray-600 p-3 cursor-pointer hover:bg-gray-100" />
      </div>
    </aside>
  );
};

export default Sidebar;
