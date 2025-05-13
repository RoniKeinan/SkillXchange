import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useCategoryContext } from './CategoryContext';
import { useUserContext } from './UserContext'; // ייבוא של יוזר

// ממשק סקיל כולל יוזר
export interface Skill {
  id: number;
  name: string;
  category: string;
  description: string;
  user: {
    name: string;
    email: string;
    image: string;
  };
}

// ממשק הקונטקסט
interface SkillContextType {
  skills: Skill[];
  addSkill: (name: string, category: string, description: string) => void;
}

// יצירת הקונטקסט
const SkillContext = createContext<SkillContextType | undefined>(undefined);

// הוק שימוש בקונטקסט
export const useSkillContext = () => {
  const context = useContext(SkillContext);
  if (!context) throw new Error('useSkillContext must be used within SkillProvider');
  return context;
};

// פרופס לטיפוס עבור SkillProvider
interface SkillProviderProps {
  children: ReactNode;
}

// קומפוננטת הספק
export const SkillProvider: React.FC<SkillProviderProps> = ({ children }) => {
  const { user } = useUserContext();
  const { addSkillToCategory, addCategory, categories } = useCategoryContext();

  // סקילים עם יוזרים פיקטיביים
  const [skills, setSkills] = useState<Skill[]>([
    {
      id: 1,
      name: 'Web Development',
      category: 'Technology',
      description: 'Build modern websites and applications using HTML, CSS, JS.',
      user: {
        name: 'Alice Cohen',
        email: 'alice@example.com',
        image: 'https://i.pravatar.cc/150?img=10',
      },
    },
    {
      id: 2,
      name: 'Graphic Design',
      category: 'Creative',
      description: 'Design eye-catching graphics for web and print.',
      user: {
        name: 'Ben Levi',
        email: 'ben@example.com',
        image: 'https://i.pravatar.cc/150?img=5',
      },
    },
    {
      id: 3,
      name: 'Photography',
      category: 'Creative',
      description: 'Capture stunning photos with professional techniques.',
      user: {
        name: 'Charlie Mizrahi',
        email: 'charlie@example.com',
        image: 'https://i.pravatar.cc/150?img=8',
      },
    },
    {
      id: 4,
      name: 'Public Speaking',
      category: 'Soft Skills',
      description: 'Learn to communicate effectively and confidently in public.',
      user: {
        name: 'Dana Shafir',
        email: 'dana@example.com',
        image: 'https://i.pravatar.cc/150?img=15',
      },
    },
    {
      id: 5,
      name: 'Piano',
      category: 'Music',
      description: 'Play piano from beginner to advanced level.',
      user: {
        name: 'Eli Kaplan',
        email: 'eli@example.com',
        image: 'https://i.pravatar.cc/150?img=25',
      },
    },
  ]);

  // פונקציה להוספת סקיל חדש
  const addSkill = (name: string, category: string, description: string) => {
    if (!user) return;

    const newSkill: Skill = {
      id: skills.length + 1,
      name,
      category,
      description,
      user: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        image: user.image,
      },
    };

    setSkills((prev) => [...prev, newSkill]);

    const categoryExists = categories.some(
      (cat) => cat.name.toLowerCase() === category.toLowerCase()
    );

    if (!categoryExists) {
      addCategory(category);
    }

    addSkillToCategory(category, newSkill);
  };

  return (
    <SkillContext.Provider value={{ skills, addSkill }}>
      {children}
    </SkillContext.Provider>
  );
};
