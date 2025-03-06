import Sidebar from '../app/components/Sidebar';
import GroupTable from '../app/components/GroupTable';
import { GroupProvider } from './components/Context';
const Home = () => (
  <div className="flex h-screen">
    <Sidebar />
    <div className="flex-1 flex flex-col h-full">
      <GroupProvider>
      <GroupTable />
      </GroupProvider>
    </div>
  </div>
);

export default Home;
