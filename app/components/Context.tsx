'use client'
import { createContext, useContext, useState, ReactNode } from 'react';



interface GroupContextType {
  selectedGroupId: number | null;
  setSelectedGroupId: (id: number) => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const GroupProvider = ({ children }: { children: ReactNode }) => {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  return (
    <GroupContext.Provider value={{ selectedGroupId, setSelectedGroupId }}>
      {children}
    </GroupContext.Provider>
  );
};

// Custom hook to use the group context
export const useGroup = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroup must be used within a GroupProvider');
  }
  return context;
};
