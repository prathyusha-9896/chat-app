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
    <div className="flex justify-between items-center bg-white shadow p-2 ">
      <div className="text-sm text-gray-500 font-semibold flex items-center justify-center space-x-2"><BsChatDotsFill /><span>Chats</span></div>

      <div className="flex items-center space-x-4">
        <button className="flex items-center text-sm text-gray-00 hover:text-gray-900 border-2 border-gray-100 p-1 rounded-md">
          <TbRefreshDot className="mr-1" />
          Refresh
        </button>
        <button className="flex items-center text-sm text-gray-00 hover:text-gray-900 border-2 border-gray-100 p-1 rounded-md">
          <MdHelpOutline  className="mr-1" />
          Help
        </button>
        <div className="flex items-center space-x-1 text-gray-600 text-sm font-medium border-2 border-gray-100 p-1 rounded-md">
        <div
            className="mr-1 w-3 h-3 rounded-full bg-yellow-200"
            style={{
            boxShadow: "0 0 10px rgba(255, 255, 0, 0.6)",
            }}
        ></div>
        5/6 phones
        <LuChevronsUpDown />

        </div>
        <button className="flex items-center text-sm text-gray-00 hover:text-gray-900 border-2 border-gray-100 p-1 rounded-md">
          <MdInstallDesktop className="mr-1" />
        </button>

        <button className=" text-gray-700 hover:text-gray-900 border-2 border-gray-100 p-1 rounded-md">
          <FaBellSlash  />
        </button>
        <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 border-2 border-gray-100 p-1 rounded-md">
          <BsStars className='text-yellow-500'/>
          <TfiMenuAlt   />
        </button>
      </div>
    </div>
  );
};

export default Header;
