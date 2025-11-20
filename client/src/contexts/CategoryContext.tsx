import { createContext, useContext, useState, ReactNode } from "react";

export interface Category {
  id: string;
  name: string;
  color: string;
}

interface CategoryContextType {
  categories: Category[];
  addCategory: (category: Omit<Category, "id">) => void;
  deleteCategory: (id: string) => boolean;
  getCategoryColor: (categoryName: string) => string;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "Health", color: "chart-1" },
  { id: "2", name: "Productivity", color: "chart-2" },
  { id: "3", name: "Mindfulness", color: "chart-3" },
  { id: "4", name: "Learning", color: "chart-4" },
  { id: "5", name: "Social", color: "chart-5" },
];

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const deleteCategory = (id: string): boolean => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    return true;
  };

  const getCategoryColor = (categoryName: string): string => {
    const category = categories.find(
      (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    return category?.color || "chart-1";
  };

  return (
    <CategoryContext.Provider
      value={{ categories, addCategory, deleteCategory, getCategoryColor }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within CategoryProvider");
  }
  return context;
}
