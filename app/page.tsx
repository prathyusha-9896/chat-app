'use client';
import Sidebar from './components/Sidebar';
import GroupTable from './components/GroupTable';
import { GroupProvider } from './components/GroupContext';

const Home = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full">
        <GroupProvider>
          <GroupTable />
        </GroupProvider>
      </div>
    </div>
  );
};

export default Home;