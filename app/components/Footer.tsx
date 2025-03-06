import React from 'react';
const Footer: React.FC = () => {
    return (
      <div className="ml-[254px] mr-[332px] fixed bottom-0 left-0 right-0 flex justify-between items-center bg-gray-100 border-t border-gray-200 px-4 py-2 text-sm">
        <div className="flex items-center space-x-2">
          <button className="bg-gray-200 text-gray-600 px-3 py-1 rounded hover:bg-gray-300">
            ← Previous
          </button>
          <span className="text-gray-600">1 of 6</span>
          <button className="bg-gray-200 text-gray-600 px-3 py-1 rounded hover:bg-gray-300">
            Next →
          </button>
          <div className="text-gray-600">256 rows</div>
        </div>
      </div>
    );
  };
  
  export default Footer;
  