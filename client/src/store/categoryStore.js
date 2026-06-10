import { create } from "zustand";

export const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,

  setCategories: (categories) => set({ categories }),
  setLoading: (loading) => set({ loading }),

  addCategory: (category) =>
    set((state) => ({ categories: [...state.categories, category] })),

  updateCategory: (updated) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c._id === updated._id ? updated : c
      ),
    })),

  removeCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c._id !== id),
    })),
}));
