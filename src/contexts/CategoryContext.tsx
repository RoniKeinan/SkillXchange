import React, { createContext, useContext, useState, ReactNode } from 'react';

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
    { id: 1, name: 'Technology' },
    { id: 2, name: 'Design' },
    { id: 3, name: 'Art' },
    { id: 4, name: 'Communication' },
    { id: 5, name: 'Music' },
    {id:6 , name:'other'},
  ]);

  const addCategory = (categoryName: string) => {
    const newCategory = {
      id: categories.length + 1,
      name: categoryName,
    };
    setCategories([...categories, newCategory]);
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};
