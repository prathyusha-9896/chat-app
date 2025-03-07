import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { BsFilter } from "react-icons/bs";
import { IoCloseCircle } from "react-icons/io5";
import { HiFolderDownload } from "react-icons/hi";

const GroupHeader = () => {
  const [isFiltered, setIsFiltered] = useState(true);

  return (
    <div className="w-[28%] flex items-center justify-between bg-gray-100 px-2 py-2  shadow-sm space-x-3.5">
      
      {/* ✅ Left Side: Custom Filter & Save */}
      <div className="flex items-center space-x-2">
        {/* Custom Filter Button */}
        <button className="flex space-x-1 items-center text-green-600 font-medium py-1 rounded-md ">
          <HiFolderDownload size={25}  />
          <span className="text-sm font-bold">Custom filter</span>
        </button>

        {/* Save Button */}
        <button className="bg-white px-2 py-1 rounded-md text-gray-500 hover:bg-green-300 border-2 border-gray-200 font-bold text-sm">
          Save
        </button>
      </div>

      {/* ✅ Right Side: Search & Filtered */}
      <div className="flex items-center space-x-2">
        {/* Search Input (Compact) */}
        <div className="relative space-x-1 flex items-center bg-white px-2 py-1 rounded-md border-2 border-gray-200 font-bold">
          <FiSearch className="text-gray-500 text-sm" />
          <input
            type="text"
            placeholder="Search"
            className="text-sm font-bold bg-transparent focus:outline-none w-12"
          />
        </div>

        {/* Filtered Button */}
        {isFiltered && (
          <button
            className="flex items-center text-green-600 font-medium bg-green-100 px-3 py-1 rounded-md hover:bg-green-200"
            onClick={() => setIsFiltered(false)}
          >
            <BsFilter className="mr-1 text-sm" />
            <span className="text-sm">Filtered</span>
            <IoCloseCircle className="ml-1 text-green-500 text-xs" />
          </button>
        )}
      </div>
    </div>
  );
};

export default GroupHeader;
