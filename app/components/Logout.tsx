'use client';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

const Logout = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2">Logout</button>;
};

export default Logout;
