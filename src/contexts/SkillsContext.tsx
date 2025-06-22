import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useCategoryContext } from './CategoryContext';


export interface Skill {
  id: string;
  skillName: string;
  category: string;
  description: string;
  contactName: string;
  contactEmail: string;
  images?: string[];
}

interface SkillContextType {
  skills: Skill[];
  getAllSkills: () => Promise<void>; // 🟢 הוספת הפונקציה ל-interface
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
 
  const { addCategory, categories } = useCategoryContext();

  const [skills, setSkills] = useState<Skill[]>([]);

const getAllSkills = async () => {
  try {
    const response = await fetch('https://nnuizx91vd.execute-api.us-east-1.amazonaws.com/dev/Skills', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Skills from API:", data);

    if (Array.isArray(data.skills)) {
      setSkills(data.skills);

      data.skills.forEach((skill: Skill) => {
        const normalizedSkillCategory = skill.category
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');

        const exists = categories.some(c => c.name === normalizedSkillCategory);
        if (!exists) {
          addCategory(skill.category); 
        }
      });
    }
  } catch (error) {
    console.error('Error fetching skills:', error);
  }
};


  useEffect(() => {
    getAllSkills();
  }, []);

  return (
    <SkillContext.Provider value={{ skills, getAllSkills }}>
      {children}
    </SkillContext.Provider>
  );
};
