'use client';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

interface LoginProps {
  setIsSignup: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsSignup }) => {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/'); // ✅ Redirect to home after login
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin} className="flex flex-col space-y-4">
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="border px-4 py-2 w-80"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="border px-4 py-2 w-80"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 w-80">Login</button>
      </form>

      <p className="mt-4">
        Don&apos;t have an account? 
        <button onClick={() => setIsSignup(true)} className="text-blue-500 ml-2">
          Sign up
        </button>
      </p>
    </div>
  );
};

export default Login;
