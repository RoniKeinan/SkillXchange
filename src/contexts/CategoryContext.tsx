import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Skill } from './SkillsContext'; 

// Define the Category interface
export interface Category {
  id: number;
  name: string;
  skills: Skill[];
}

interface CategoryContextType {
  categories: Category[];
  addCategory: (categoryName: string) => void;
  addSkillToCategory: (categoryName: string, skill: Skill) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) throw new Error('useCategoryContext must be used within CategoryProvider');
  return context;
};

interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Technology', skills: [] },
    { id: 2, name: 'Design', skills: [] },
    { id: 3, name: 'Art', skills: [] },
    { id: 4, name: 'Communication', skills: [] },
    { id: 5, name: 'Music', skills: [] },
    { id: 6, name: 'other', skills: [] },
  ]);

const addCategory = (categoryName: string) => {
  const capitalizedName = categoryName
    .split(' ')
    .map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(' ');

  const newCategory: Category = {
    id: categories.length + 1,
    name: capitalizedName,
    skills: [],
  };

  setCategories([...categories, newCategory]);
};


  const addSkillToCategory = (categoryName: string, skill: Skill) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.name.toLowerCase() === categoryName.toLowerCase()
          ? { ...cat, skills: [...cat.skills, skill] }
          : cat
      )
    );
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory, addSkillToCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};
