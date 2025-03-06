'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { FaHome, FaComments, FaUsers, FaAddressBook, FaHistory, FaFile, FaCog, FaChevronDown } from 'react-icons/fa';
import { IoLogoWhatsapp } from "react-icons/io";
const Sidebar: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('Groups');

  const handlePageClick = (page: string) => {
    setActivePage(page);
  };

  const menuItems = [
    { name: 'Dashboard', icon: <FaHome /> },
    { name: 'Chats', icon: <FaComments /> },
    { name: 'Groups', icon: <FaUsers /> },
    { name: 'Contacts', icon: <FaAddressBook /> },
    { name: 'Logs', icon: <FaHistory /> },
    { name: 'Files', icon: <FaFile /> },
    { name: 'Settings', icon: <FaCog /> },
  ];

  return (
    <div className="w-64 h-screen border-r bg-white text-gray-600 flex flex-col">
      {/* User Section */}
      <div className="p-4 flex items-center">
        <Image src="/log.svg" alt="Periskope Logo" width={40} height={40} className="rounded-full" />
        <div className="ml-3 flex-1">
          <div className="font-bold text-lg">Periskope</div>
          <div className="text-sm text-gray-500">bharat@hashlabs.dev</div>
        </div>
        <FaChevronDown className="text-gray-400 cursor-pointer" />
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1">
        <ul className="">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`ml-3 p-2 mr-6 rounded-md cursor-pointer flex items-center gap-3 ${
                activePage === item.name
                  ? 'text-green-500 font-bold'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => handlePageClick(item.name)}
            >
              {item.icon} {item.name}
            </li>
          ))}
        </ul>
      </nav>

      {/* Help & Support Section */}
      <div
        className="p-4 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
        onClick={() => handlePageClick('Help & Support')}
      >
        <IoLogoWhatsapp fill='green'/> Help & Support
      </div>
    </div>
  );
};

export default Sidebar;
