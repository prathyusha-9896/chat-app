'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  signUp: (phoneNumber: string, password: string) => Promise<void>;
  login: (phoneNumber: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
    };
    getUser();
  }, []);

  // ✅ Sign Up Function
  const signUp = async (phoneNumber: string, password: string) => {
    // ✅ Save user to Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      phone: phoneNumber,
      password,
    });

    if (error) {
      console.error('Signup error:', error.message);
      return;
    }

    // ✅ Store user in `users` table
    await supabase.from('users').insert([{ phone_number: phoneNumber, password }]);
    
    setUser(data.user);
    router.push('/'); // Redirect to chat after signup
  };

  // ✅ Login Function
  const login = async (phoneNumber: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      phone: phoneNumber,
      password,
    });

    if (error) {
      console.error('Login error:', error.message);
      return;
    }

    setUser(data.user);
    router.push('/'); // Redirect to chat
  };

  // ✅ Logout Function
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login'); // Redirect to login
  };

  return (
    <AuthContext.Provider value={{ user, signUp, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use Auth
export const useAuth = () => {
  return useContext(AuthContext);
};
