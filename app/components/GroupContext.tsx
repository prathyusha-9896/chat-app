'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export interface Group {
  id: number;
  group_name: string;
  members: string[];
  last_active: string;
}

interface ChatMessage {
  message_id: number;
  sender_id: string;
  message_text: string;
  sent_at: string;
}

interface GroupContextType {
  groups: Group[];
  selectedGroup: Group | null;
  messages: ChatMessage[];
  setSelectedGroup: (group: Group) => void;
  fetchMessages: (groupId: number) => Promise<void>;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const GroupProvider = ({ children }: { children: ReactNode }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('last_active', { ascending: false });

      if (!error && data) setGroups(data);
      else console.error('Error fetching groups:', error?.message);
    };

    fetchGroups();
  }, []);

  const fetchMessages = async (groupId: number): Promise<void> => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('group_id', groupId)
      .order('sent_at', { ascending: true });

    if (!error && data) setMessages(data);
    else console.error('Error fetching messages:', error?.message);
  };

  useEffect(() => {
    if (selectedGroup) fetchMessages(selectedGroup.id);
  }, [selectedGroup]);

  return (
    <GroupContext.Provider value={{ groups, selectedGroup, messages, setSelectedGroup, fetchMessages }}>
      {children}
    </GroupContext.Provider>
  );
};

export const useGroupContext = () => {
  const context = useContext(GroupContext);
  if (!context) throw new Error('useGroupContext must be used within a GroupProvider');
  return context;
};
