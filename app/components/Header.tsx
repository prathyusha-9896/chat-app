'use client';
import React from 'react';
import { BsChatDotsFill, BsStars } from 'react-icons/bs';
import { FaBellSlash } from 'react-icons/fa';
import { LuChevronsUpDown } from 'react-icons/lu';
import { MdHelpOutline, MdInstallDesktop } from 'react-icons/md';
import { TbRefreshDot } from 'react-icons/tb';
import { TfiMenuAlt } from 'react-icons/tfi';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center bg-white shadow p-2">
      {/* Left - Title */}
      <h1 className="text-sm text-gray-500 font-semibold flex items-center space-x-2">
        <BsChatDotsFill />
        <span>Chats</span>
      </h1>

      {/* Right - Icons */}
      <nav className="flex items-center space-x-4">
        <button className="flex items-center text-sm border-2 border-gray-100 p-1 rounded-md hover:text-gray-900">
          <TbRefreshDot className="mr-1" />
          Refresh
        </button>
        <button className="flex items-center text-sm border-2 border-gray-100 p-1 rounded-md hover:text-gray-900">
          <MdHelpOutline className="mr-1" />
          Help
        </button>
        <div className="flex items-center space-x-1 text-sm font-medium border-2 border-gray-100 p-1 rounded-md">
          <span className="w-3 h-3 rounded-full bg-yellow-200 shadow-md"></span>
          5/6 phones
          <LuChevronsUpDown />
        </div>
        <button className="border-2 border-gray-100 p-1 rounded-md">
          <MdInstallDesktop />
        </button>
        <button className="border-2 border-gray-100 p-1 rounded-md">
          <FaBellSlash />
        </button>
        <button className="flex items-center space-x-1 border-2 border-gray-100 p-1 rounded-md">
          <BsStars className="text-yellow-500" />
          <TfiMenuAlt />
        </button>
      </nav>
    </header>
  );
};

export default Header;
