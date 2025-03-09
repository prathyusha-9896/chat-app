import { FaSearch, FaEllipsisV } from "react-icons/fa";
import Image from 'next/image';
import { FaUsers, FaUserCircle } from 'react-icons/fa';

interface Group {
  id?: number;
  group_name?: string;
  member_phone_numbers?: string[];  // Stores phone numbers
  avatars?: string[];  // Stores avatar URLs
}

const ChatPanelHeader = ({ group }: { group: Group }) => {
  // Set the number of members to display
  const maxVisibleMembers = 4; // Change to 4 if you want to show 4 instead

  const displayedMembers = group?.member_phone_numbers?.slice(0, maxVisibleMembers) || [];
  const displayedAvatars = group?.avatars?.slice(0, maxVisibleMembers) || [];
  const remainingCount = (group?.member_phone_numbers?.length || 0) - maxVisibleMembers;

  return (
    <div className="flex items-center justify-between p-2 bg-white shadow-sm">
      <div className="flex items-center space-x-3">
        {/* ✅ Group Icons */}
        <div className="text-2xl">
          {group ? (
            group?.id !== undefined && group.id % 3 === 0 ? (
              <FaUsers size={40} className="text-white bg-gray-200 p-2 rounded-full" />            ) : (
              <FaUserCircle size={40} className="text-gray-200" />
            )
          ) : null}
        </div>

        {/* ✅ Group Name & Members (Now Showing Limited Members) */}
        <div className="flex flex-col">
          <span className="font-semibold text-lg">
            {group?.group_name || "Select a Chat"}
          </span>
          <span className="text-gray-500 text-sm">
            {displayedMembers.join(", ")}
            {remainingCount > 0 && `, +${remainingCount} more`}
          </span>
        </div>
      </div>

      {/* ✅ Right: Avatars & Icons */}
      <div className="flex items-center space-x-3">
        {/* User Avatars */}
        <div className="flex -space-x-2">
          {displayedAvatars.map((avatar, index) => (
            <Image width={20} height={20}
              key={index} 
              src={avatar || "/profile.jpg"} 
              alt="User Avatar"
              className="w-8 h-8 rounded-full border border-white shadow-sm"
              onError={(e) => (e.currentTarget.src = "/profile.jpg")} // ✅ Fallback for broken images
            />
          ))}
          {remainingCount > 0 && (
            <span className="w-8 h-8 flex items-center justify-center bg-gray-300 text-sm rounded-full text-white">
              +{remainingCount}
            </span>
          )}
        </div>

        {/* Icons */}
        <FaSearch className="text-gray-500 cursor-pointer hover:text-gray-700" />
        <FaEllipsisV className="text-gray-500 cursor-pointer hover:text-gray-700" />
      </div>
    </div>
  );
};

export default ChatPanelHeader;
