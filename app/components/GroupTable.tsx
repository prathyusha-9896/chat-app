'use client';
import React from 'react';
import Header from './Header';
import ChatPanel from './ChatPanel';
import GroupHeader from './GroupHeader';
import ChatPanelHeader from './ChatPanelHeader';
import { FaUsers } from 'react-icons/fa';
import { useGroupContext } from './GroupContext';
import type { Group } from './GroupContext'; // Import Group type
import { useAuth } from '../hooks/useAuth'; // Import useAuth hook

const GroupTable: React.FC = () => {
  const { user } = useAuth(); // Get the authenticated user
  const { groups, selectedGroup, setSelectedGroup } = useGroupContext();

  const handleRowClick = (group: Group) => {
    console.log('✅ Selected Group:', group);
    setSelectedGroup(group);
  };

  return (
    <>
      <Header />
      <div className='flex'>
        <GroupHeader />
        <div className='w-[72%]'>
          {selectedGroup && <ChatPanelHeader group={selectedGroup} />}
        </div>
      </div>
      <div className="flex h-screen overflow-hidden">
        {/* ✅ Sidebar with Groups */}
        <div className="w-[28%] overflow-y-auto h-full hide-scrollbar">
          {groups.map((group) => (
            <div
              key={group.id}
              className={`p-4 flex items-center cursor-pointer hover:bg-gray-100 ${
                selectedGroup?.id === group.id ? 'bg-gray-50' : ''
              }`}
              onClick={() => handleRowClick(group)}
            >
              {/* ✅ Group Icons */}
              <FaUsers size={40} className="text-white bg-gray-200 p-2 rounded-full" />

              {/* ✅ Group Info */}
              <div className="ml-3">
                <div className="font-bold">{group.group_name}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Chat Panel */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {selectedGroup ? (
            <ChatPanel key={selectedGroup.id} id={selectedGroup.id} senderId={user?.id || ''} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-gray-500">Select a group to start chatting</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GroupTable;