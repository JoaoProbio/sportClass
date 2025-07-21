'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SportContextType {
  activeSport: string;
  setActiveSport: (sport: string) => void;
}

const SportContext = createContext<SportContextType | undefined>(undefined);

export function SportProvider({ children }: { children: ReactNode }) {
  const [activeSport, setActiveSport] = useState('futsal');

  return (
    <SportContext.Provider value={{ activeSport, setActiveSport }}>
      {children}
    </SportContext.Provider>
  );
}

export function useSport() {
  const context = useContext(SportContext);
  if (context === undefined) {
    throw new Error('useSport must be used within a SportProvider');
  }
  return context;
} 