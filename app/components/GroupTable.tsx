'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Header from './Header';
import ChatPanel from './ChatPanel';
import { useAuth } from '../hooks/useAuth';
import GroupHeader from './GroupHeader';
import ChatPanelHeader from './ChatPanelHeader';
import { FaUsers, FaUserCircle } from 'react-icons/fa'; // Import icons

interface Group {
  id: number;
  group_name: string;
  project: string;
  labels: string[];
  members: string[];
  last_active: string;
}

const GroupTable: React.FC = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const senderId = user?.id || '';

  useEffect(() => {
    async function fetchGroups() {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('last_active', { ascending: false });

      if (error) {
        console.error('Error fetching groups:', error.message);
      } else {
        setGroups(data || []);
      }
    }

    fetchGroups();
  }, []);

  useEffect(() => {
    if (groups.length > 0 && !selectedGroup) {
      setSelectedGroup(groups[0]);
    }
  }, [groups, selectedGroup]);

  const handleRowClick = (group: Group) => {
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
        {/* ✅ Sidebar with Groups & Icons */}
        <div className="w-[28%] overflow-y-auto h-full hide-scrollbar">
          {groups.map((group, index) => (
            <div
              key={group.id}
              className={`p-4 shadow-sm shadow-gray-50 flex items-center cursor-pointer hover:bg-gray-100 ${
                selectedGroup?.id === group.id ? 'bg-gray-50' : ''
              }`}
              onClick={() => handleRowClick(group)}
            >
              {/* ✅ Group Icons */}
              <div className="mr-3 text-xl">
                {index % 3 === 0 ? (
                  <FaUsers size={40} className="text-white bg-gray-200 p-2 rounded-full" />
                ) : (
                  <FaUserCircle size={40} className="text-gray-200" />
                )}
              </div>
              
              {/* ✅ Group Info */}
              <div>
                <div className="font-bold">{group.group_name}</div>
                <div className="text-sm text-gray-600">{group.project}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Chat Panel */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {selectedGroup && user ? (
            <ChatPanel groupId={selectedGroup.id} senderId={senderId} />
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