'use client';
import React, { useEffect, useState } from 'react';
import useHasMounted from '../hooks/useHasMounted'; 
import Header from './Header';
import ChatPanel from './ChatPanel';
import GroupHeader from './GroupHeader';
import ChatPanelHeader from './ChatPanelHeader';
import { FaUserCircle } from 'react-icons/fa';
import Image from 'next/image';
import { useGroupContext } from './GroupContext';
import { useAuth } from '../hooks/useAuth';
import { format, isToday, isYesterday } from 'date-fns';

const GroupTable: React.FC = () => {
  const hasMounted = useHasMounted();
  const { user } = useAuth();
  const { groups, selectedGroup, setSelectedGroup } = useGroupContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (groups.length > 0) setIsLoading(false);
  }, [groups]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, 'dd-MMM-yy');
  };

  if (!hasMounted) {
    return <p className="text-center text-gray-500 mt-4">Loading...</p>;
  }

  return (
    <>
      <Header />
      <section className="flex">
        <GroupHeader />
        <div className="w-[72%]">{selectedGroup && <ChatPanelHeader group={selectedGroup} />}</div>
      </section>

      <section className="flex h-screen overflow-hidden">
        {/* ✅ Sidebar (Chat List) */}
        <aside className="w-[28%] overflow-y-auto h-full hide-scrollbar bg-white shadow-md ">
          {isLoading ? (
            <p className="text-center text-gray-500 mt-4">Loading groups...</p>
          ) : (
            groups.map((group) => {
              const latestMessage = group.last_message || 'No messages yet';
              const projectType = group.project || 'General';
              const lastActiveDate = group.last_active ? formatDate(group.last_active) : 'Unknown';
              
              const displayedAvatars = group.avatars?.slice(0, 1) || [];
              const remainingMembers = group.member_phone_numbers.length - 2;
              const displayedPhone = group.member_phone_numbers?.[0] || 'Unknown';

              return (
                <article
                  key={group.id}
                  className={`p-4 flex items-center cursor-pointer hover:bg-gray-100 ${
                    selectedGroup?.id === group.id ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => setSelectedGroup(group)}
                >
                  {/* ✅ Profile Avatar */}
                  <div className="">
                  <FaUserCircle size={40} className="text-gray-400" />
                  </div>

                  {/* ✅ Chat Info */}
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-sm truncate">{group.group_name}</h3>
                      <div className="flex flex-col items-end">
                        {/* ✅ Avatar +N above timestamp */}
                        <div className="flex -space-x-2 mb-1">
                          {displayedAvatars.map((avatar, index) => (
                            <Image
                              key={index}
                              src={avatar}
                              width={20}
                              height={20}
                              className="rounded-full border border-white shadow-sm"
                              alt="User Avatar"
                              onError={(e) => (e.currentTarget.src = "/profile.jpg")}
                            />
                          ))}
                          {remainingMembers > 0 && (
                            <span className="w-6 h-6 flex items-center justify-center bg-gray-300 text-xs rounded-full text-white">
                              +{remainingMembers}
                            </span>
                          )}
                        </div>
                        {/* ✅ Timestamp Below Avatars */}
                        <span className="text-xs text-gray-500">{lastActiveDate}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 truncate">{latestMessage}</div>

                    {/* ✅ Phone Number & Project Type */}
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <span className="mr-2">{displayedPhone}</span>
                      <span className={`px-2 py-1 bg-gray-100 text-xs font-semibold rounded ${
                        projectType.toLowerCase() === "demo" ? "text-green-500" : "text-red-500"
                      }`}>
                        {projectType}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </aside>

        {/* ✅ Main Chat Section */}
        <section className="flex-1 flex flex-col h-full overflow-hidden">
          {selectedGroup ? (
            <>
              {/* ✅ Chat Panel */}
              <ChatPanel key={selectedGroup.id} id={selectedGroup.id} senderId={user?.id || ''} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-chat-background">
              <p className="text-gray-500">Select a group to start chatting</p>
            </div>
          )}
        </section>
      </section>
    </>
  );
};

export default GroupTable;
