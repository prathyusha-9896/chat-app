'use client';
import React, { useState } from 'react';
import { FaHome, FaImage, FaCog, FaUserFriends, FaBox } from 'react-icons/fa';
import Image from 'next/image';
import { BsChatDotsFill, BsStars   } from 'react-icons/bs';
import { IoTicketSharp } from 'react-icons/io5';
import { GoGraph } from 'react-icons/go';
import { TfiMenuAlt } from 'react-icons/tfi';
import { HiSpeakerphone } from 'react-icons/hi';
import { PiTreeStructure } from 'react-icons/pi';
import { RiContactsBookFill } from 'react-icons/ri';
import { MdChecklist } from 'react-icons/md';
const Sidebar: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('Chats');

  const handlePageClick = (page: string) => {
    setActivePage(page);
  };

  const menuItems = [
    { name: 'Home', icon: <FaHome size={18} /> },
    { name: 'Chats', icon: <BsChatDotsFill size={18}/> },
    { name: 'Ticket', icon: <IoTicketSharp size={18} /> },
    { name: 'Analytics', icon: <GoGraph size={18} /> },
    { name: 'Menu', icon: <TfiMenuAlt size={18} /> },
    { name: 'speaker', icon: <HiSpeakerphone  size={18} /> },
    { name: 'Database', icon:     <div className="relative flex items-center hover:shadow-lg transition">
      <PiTreeStructure size={18}  className="text-gray-600 rotate-90" />
      <BsStars className="absolute -top-1 left-4 text-yellow-500 text-sm" />
    </div> },
    { name: 'Contact', icon: <RiContactsBookFill size={18}  /> },
    { name: 'Gallery', icon: <FaImage size={18} /> },
    { name: 'Checklist', icon: <MdChecklist size={18} /> },
    { name: 'Settings', icon: <FaCog size={18} /> },
  ];

  return (
    <div className=" h-screen shadow-gray-200 shadow-sm bg-white text-gray-600 flex flex-col items-center py-4 overflow-hidden">
      {/* Logo Section */}
      <div className="mb-3">
      <Image 
        src="/image.png" 
        alt="App Logo"
        width={30} 
        height={30}  
      />
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 w-full overflow-y-auto pb-4 ">
        <ul className="space-y-2  flex flex-col items-center mx-4">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`p-2 rounded-md cursor-pointer flex items-center justify-center w-full transition-colors ${
                activePage === item.name ? 'text-green-700 font-bold bg-gray-100 ' : 'hover:bg-gray-100'
              }`}
              onClick={() => handlePageClick(item.name)}
            >
              {item.icon}
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Bottom Section */}
      <div className="space-y-2 flex flex-col items-center pb-2 mt-auto">
        <div className="p-3 cursor-pointer flex items-center justify-center w-full hover:bg-gray-100">
          <FaUserFriends className="text-gray-600" />
        </div>
        <div className="p-3 cursor-pointer flex items-center justify-center w-full hover:bg-gray-100">
          <FaBox className="text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
