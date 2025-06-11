import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';


// Define the Category interface
export interface Category {
  id: number;
  name: string;
  
}

interface CategoryContextType {
  categories: Category[];
  addCategory: (categoryName: string) => void;
  
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
    { id: 1, name: 'Technology'},
    { id: 2, name: 'Design' },
    { id: 3, name: 'Art' },
    { id: 4, name: 'Communication' },
    { id: 5, name: 'Music' },
    { id: 6, name: 'other' },
  ]);

const addCategory = (categoryName: string) => {
  const capitalizedName = categoryName
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  setCategories(prevCategories => {
    const exists = prevCategories.some(c => c.name === capitalizedName);
    if (exists) {
      console.log(`Category "${capitalizedName}" already exists.`);
      return prevCategories;
    }

    const maxId = Math.max(0, ...prevCategories.map(c => c.id));
    const newCategory: Category = {
      id: maxId + 1,
      name: capitalizedName,
    };

    console.log("Adding new category:", newCategory);
    return [...prevCategories, newCategory];
  });
};


  return (
    <CategoryContext.Provider value={{ categories, addCategory}}>
      {children}
    </CategoryContext.Provider>
  );
};
