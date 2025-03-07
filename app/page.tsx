'use client';
import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import Sidebar from './components/Sidebar';
import GroupTable from './components/GroupTable';
import { GroupProvider } from './components/Context';
import { useRouter } from 'next/navigation';
import Signup from './components/SignUp';
import Login from './components/Login';

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);

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