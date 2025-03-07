'use client';
import Sidebar from './components/Sidebar';
import GroupTable from './components/GroupTable';
import { GroupProvider } from './components/Context';


const Home = () => {


  // Commenting out the redirect logic
  /*
  // ✅ Redirect if login page is missing
  useEffect(() => {
    if (!user) {
      router.push('/auth/login'); // Ensure login page is available
    }
  }, [user]);

  // ✅ Show login or signup page if user is not authenticated
  if (!user) {
    return isSignup ? <Signup setIsSignup={setIsSignup} /> : <Login setIsSignup={setIsSignup} />;
  } 
  */

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