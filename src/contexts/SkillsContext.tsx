import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useCategoryContext } from './CategoryContext';


export interface Skill {
  id: number;
  name: string;
  category: string;
  description: string;

}

interface SkillContextType {
  skills: Skill[];
  addSkill: (name: string, category: string, description: string) => void;
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
    { id: 1, name: 'Web Development', category: 'Technology', description: 'this' },
    { id: 2, name: 'Graphic Design', category: 'Creative', description: 'this' },
    { id: 3, name: 'Photography', category: 'Creative', description: 'this' },
    { id: 4, name: 'Public Speaking', category: 'Soft Skills', description: 'this' },
    { id: 5, name: 'Piano', category: 'Music', description: 'this' },
  ]);

  const { addSkillToCategory, addCategory, categories } = useCategoryContext(); // 👈

  const addSkill = (name: string, category: string, description: string) => {
    const newSkill: Skill = {
      id: skills.length + 1,
      name,
      category,
      description,
    };

    setSkills(prev => [...prev, newSkill]);

    const categoryExists = categories.some(
      (cat) => cat.name.toLowerCase() === category.toLowerCase()
    );

    if (!categoryExists) {
      addCategory(category); // adds empty category
    }

    addSkillToCategory(category, newSkill); // 👈 add skill to category
  };

  return (
    <SkillContext.Provider value={{ skills, addSkill }}>
      {children}
    </SkillContext.Provider>
  );
};
