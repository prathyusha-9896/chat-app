'use client';
import React from 'react';
import { CiBellOn } from 'react-icons/ci';
import { FaBook,  FaUsers } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <div className="flex justify-between items-center bg-white shadow p-2 ">
      <div className="text-sm text-gray-500 font-semibold flex items-center justify-center space-x-2"><FaUsers /><span>groups</span></div>

      <div className="flex items-center space-x-4">
        <button className="flex items-center text-sm text-gray-00 hover:text-gray-900 border-2 border-gray-100 p-1 rounded-md">
          <FaBook className="mr-1" />
          Docs
        </button>

        <div className="flex items-center text-green-600 text-sm font-medium border-2 border-gray-100 p-1 rounded-md">
        <div
            className="mr-1 w-3 h-3 rounded-full bg-green-600"
            style={{
            boxShadow: "0 0 10px rgba(34, 197, 94, 0.6)",
            }}
        ></div>
        +91 90043 89372
        </div>
        <button className="text-gray-700 hover:text-gray-900 border-2 border-gray-100 p-1 rounded-md">
          <CiBellOn />
        </button>
      </div>
    </div>
  );
};

export default Header;
