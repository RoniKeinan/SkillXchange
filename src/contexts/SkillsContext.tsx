import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Skill {
  id: number;
  name: string;
  category: string;
}

interface SkillContextType {
  skills: Skill[];
  addSkill: (name: string, category: string) => void;
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
  const [skills, setSkills] = useState<Skill[]>([
    { id: 1, name: 'Web Development', category: 'Technology' },
    { id: 2, name: 'Graphic Design', category: 'Creative' },
    { id: 3, name: 'Photography', category: 'Creative' },
    { id: 4, name: 'Public Speaking', category: 'Soft Skills' },
    { id: 5, name: 'Piano', category: 'Music' },
    // Add more example skills here
  ]);

  const addSkill = (name: string, category: string) => {
    const newSkill = {
      id: skills.length + 1,
      name,
      category,
    };
    setSkills([...skills, newSkill]);
  };

  return (
    <SkillContext.Provider value={{ skills, addSkill }}>
      {children}
    </SkillContext.Provider>
  );
};
