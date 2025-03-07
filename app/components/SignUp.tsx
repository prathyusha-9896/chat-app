'use client';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

interface SignupProps {
  setIsSignup: (value: boolean) => void;
}

const Signup: React.FC<SignupProps> = ({ setIsSignup }) => {
  const { signup } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signup(email, password);
      router.push('/'); // ✅ Redirect to home instead of /auth/login
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSignup} className="flex flex-col space-y-4">
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
        <button 
          type="submit" 
          className={`px-4 py-2 w-80 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white'}`} 
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-4">
        Already have an account? 
        <button onClick={() => setIsSignup(false)} className="text-blue-500 ml-2">
          Login
        </button>
      </p>
    </div>
  );
};

export default Signup;
