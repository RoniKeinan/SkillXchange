import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Skill {
  id: number;
  name: string;
}

interface SkillContextType {
  skills: Skill[];
}

const SkillContext = createContext<SkillContextType | undefined>(undefined);

export const useSkillContext = () => {
  const context = useContext(SkillContext);
  if (!context) throw new Error('useSkillContext must be used within SkillProvider');
  return context;
};

interface SkillProviderProps {
  children: ReactNode;
}

export const SkillProvider: React.FC<SkillProviderProps> = ({ children }) => {
  const [skills] = useState<Skill[]>([
    { id: 1, name: 'Web Development' },
    { id: 2, name: 'Graphic Design' },
    { id: 3, name: 'Photography' },
    { id: 4, name: 'Public Speaking' },
    { id: 5, name: 'Piano' },
    // Add more example skills here
  ]);

  return (
    <SkillContext.Provider value={{ skills }}>
      {children}
    </SkillContext.Provider>
  );
};