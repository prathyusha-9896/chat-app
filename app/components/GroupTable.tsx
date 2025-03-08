'use client';
import React, { useEffect, useState } from 'react';
import useHasMounted from '../hooks/useHasMounted'; // ✅ Import mounting check
import Header from './Header';
import ChatPanel from './ChatPanel';
import GroupHeader from './GroupHeader';
import ChatPanelHeader from './ChatPanelHeader';
import { FaUsers } from 'react-icons/fa';
import { useGroupContext } from './GroupContext';
import { useAuth } from '../hooks/useAuth';

const GroupTable: React.FC = () => {
  const hasMounted = useHasMounted(); // ✅ Prevent hydration mismatch
  const { user } = useAuth();
  const { groups, selectedGroup, setSelectedGroup } = useGroupContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (groups.length > 0) setIsLoading(false);
  }, [groups]);

  // ✅ Prevents mismatched SSR/CSR content
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
        <aside className="w-[28%] overflow-y-auto h-full hide-scrollbar">
          {isLoading ? (
            <p className="text-center text-gray-500 mt-4">Loading groups...</p>
          ) : (
            groups.map((group) => (
              <article
                key={group.id}
                className={`p-4 flex items-center cursor-pointer hover:bg-gray-100 ${
                  selectedGroup?.id === group.id ? 'bg-gray-50' : ''
                }`}
                onClick={() => setSelectedGroup(group)}
              >
                <FaUsers size={40} className="text-white bg-gray-200 p-2 rounded-full" />
                <div className="ml-3">
                  <h3 className="font-bold">{group.group_name}</h3>
                </div>
              </article>
            ))
          )}
        </aside>

        <section className="flex-1 flex flex-col h-full overflow-hidden">
          {selectedGroup ? (
            <ChatPanel key={selectedGroup.id} id={selectedGroup.id} senderId={user?.id || ''} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Select a group to start chatting</p>
            </div>
          )}
        </section>
      </section>
    </>
  );
};

export default GroupTable;
