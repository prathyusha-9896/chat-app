import { FaSearch, FaEllipsisV } from "react-icons/fa";
import Image from 'next/image';
import { FaUsers, FaUserCircle } from 'react-icons/fa';
interface Group {
  id?: number;
  group_name?: string;
  members?: string[];
  avatars?: string[];
}

const ChatPanelHeader = ({ group }: { group: Group }) => {
  return (
    <div className="flex items-center justify-between p-2 bg-white  shadow-sm">
<div className="flex items-center space-x-3">
  {/* ✅ Group Icons */}
  <div className="text-2xl">
    {group ? (
      group?.id !== undefined && group.id % 3 === 0 ? (
        <FaUsers size={40} className="text-green-600" />
      ) : (
        <FaUserCircle size={40} className="text-gray-200" />
      )
    ) : null}
  </div>

  {/* ✅ Group Name & Members */}
  <div className="flex flex-col">
    <span className="font-semibold text-lg">
      {group?.group_name || "Select a Chat"}
    </span>
    <span className="text-gray-500 text-sm">
      {group?.members?.join(", ") || "No group selected"}
    </span>
  </div>
</div>

      {/* ✅ Right: Avatars & Icons */}
      <div className="flex items-center space-x-3">
        {/* User Avatars */}
        <div className="flex -space-x-2">
          {group?.avatars?.slice(0, 4).map((avatar, index) => (
            <Image width={30} height={30}
              key={index}
              src={avatar}
              alt="User"
              className="w-8 h-8 rounded-full border border-white shadow-sm"
            />
          ))}
          {(group?.avatars?.length ?? 0) > 4 && (
            <span className="w-8 h-8 flex items-center justify-center bg-gray-300 text-sm rounded-full text-white">
              +{group?.avatars?.length ?? - 4}
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
