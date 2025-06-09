import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useCategoryContext } from './CategoryContext';
import { useUserContext } from './UserContext';

export interface Skill {
  id: string; // previously number, now string as per your JSON
  skillName: string;
  category: string;
  description: string;
  contactName: string;
  contactEmail: string;
  images?: string[]; 
 
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
  const { user } = useUserContext();
  const { addSkillToCategory, addCategory, categories } = useCategoryContext();

  const [skills, setSkills] = useState<Skill[]>([]);

  // Fetch skills from the API
  const getAllSkills = async () => {
    try {
      const response = await fetch('https://rrhrxoqc2j.execute-api.us-east-1.amazonaws.com/dev/Skill', {
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

      // Make sure data is in correct format
      if (Array.isArray(data.skills)) {
        setSkills(data.skills);

        // Optional: also populate categories if you want
        data.skills.forEach((skill: Skill) => {
          const exists = categories.some(c => c.name.toLowerCase() === skill.category.toLowerCase());
          if (!exists) {
            addCategory(skill.category);
          }
          addSkillToCategory(skill.category, skill);
        });
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  // Load skills once on mount
  useEffect(() => {
    getAllSkills();
  }, []);

 

  return (
    <SkillContext.Provider value={{ skills}}>
      {children}
    </SkillContext.Provider>
  );
};
