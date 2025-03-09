'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export interface Group {
  id: number;
  group_name: string;
  member_phone_numbers: string[];
  avatars: string[];
  last_active: string;
  last_message: string;
  project: string;
}

export interface ChatMessage {
  message_id: number;
  sender_id: string;
  message_text: string;
  sent_at: string;
}

interface GroupContextType {
  groups: Group[];
  selectedGroup: Group | null;
  setSelectedGroup: (group: Group) => void;
  messages: ChatMessage[];  // ✅ Add messages back
  fetchMessages: (groupId: number) => Promise<void>;  // ✅ Add fetchMessages back
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const GroupProvider = ({ children }: { children: ReactNode }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);  // ✅ Restore messages state

  useEffect(() => {
    const fetchGroups = async () => {
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select('id, group_name, last_active, member_phone_numbers, project')
        .order('last_active', { ascending: false });

      if (groupsError || !groupsData) {
        console.error('Error fetching groups:', groupsError?.message);
        return;
      }

      const allPhoneNumbers = [...new Set(groupsData.flatMap(group => group.member_phone_numbers || []))]
        .map(phone => phone.trim());

      if (allPhoneNumbers.length === 0) {
        setGroups(groupsData.map(group => ({ ...group, avatars: [], last_message: "No messages yet" })));
        return;
      }

      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('phone_number, avatar_url')
        .in('phone_number', allPhoneNumbers);

      if (usersError || !usersData) {
        console.error("Error fetching users:", usersError?.message);
        return;
      }

      const userMap = new Map(usersData.map(user => [user.phone_number, user.avatar_url || "/profile.jpg"]));

      // **🔹 Fetch latest message for each group**
      const latestMessages: { [groupId: number]: string } = {};
      for (const group of groupsData) {
        const { data: messageData, error: messageError } = await supabase
          .from('messages')
          .select('message_text')
          .eq('group_id', group.id)
          .order('sent_at', { ascending: false })
          .limit(1);

        if (!messageError && messageData.length > 0) {
          latestMessages[group.id] = messageData[0].message_text;
        } else {
          latestMessages[group.id] = "No messages yet";
        }
      }

      const formattedGroups: Group[] = groupsData.map(group => ({
        ...group,
        avatars: (group.member_phone_numbers || []).map((phone: string) => userMap.get(phone) || "/profile.jpg"),
        last_message: latestMessages[group.id],
        project: group.project || "General"
      }));

      setGroups(formattedGroups);
    };

    fetchGroups();
  }, []);

  // ✅ **Fetch messages for selected group**
  const fetchMessages = async (groupId: number) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('group_id', groupId)
      .order('sent_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    } else {
      console.error('Error fetching messages:', error?.message);
    }
  };

  return (
    <GroupContext.Provider value={{ groups, selectedGroup, setSelectedGroup, messages, fetchMessages }}>
      {children}
    </GroupContext.Provider>
  );
};

export const useGroupContext = () => {
  const context = useContext(GroupContext);
  if (!context) throw new Error('useGroupContext must be used within a GroupProvider');
  return context;
};
