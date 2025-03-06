'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Header from './Header';
import ChatPanel from './ChatPanel';

interface Group {
  id: number;
  group_name: string;
  project: string;
  labels: string[];
  members: number;
  last_active: string;
}

const GroupTable: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const senderId = "123456"; // ✅ Static sender ID since there's no authentication

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

  // ✅ Auto-select the first group when groups load
  useEffect(() => {
    if (groups.length > 0 && !selectedGroup) {
      setSelectedGroup(groups[0]);
      console.log("Auto-selected group:", groups[0]); // ✅ Debugging log
    }
  }, [groups]);

  const handleRowClick = (group: Group) => {
    setSelectedGroup(group);
  };

  return (
    <>
      <Header />
      <div className="flex h-screen">
        {/* ✅ Group List */}
        <div className="w-1/4 border-r overflow-y-auto">
          {groups.map((group) => (
            <div
              key={group.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${selectedGroup?.id === group.id ? 'bg-gray-200' : ''}`}
              onClick={() => handleRowClick(group)}
            >
              <div className="font-bold">{group.group_name}</div>
              <div className="text-sm text-gray-600">{group.project}</div>
            </div>
          ))}
        </div>

        {/* ✅ Chat Panel */}
        <div className="flex-1 flex flex-col">
          {selectedGroup ? (
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
