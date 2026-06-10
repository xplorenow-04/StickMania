import { create } from "zustand";

export const useProductStore = create((set, get) => ({
  products: [],
  product: null,
  loading: false,
  pagination: null,

  setProducts: (products) => set({ products }),
  setProduct: (product) => set({ product }),
  setLoading: (loading) => set({ loading }),
  setPagination: (pagination) => set({ pagination }),

  appendProducts: (newProducts) =>
    set((state) => ({ products: [...state.products, ...newProducts] })),

  clearProduct: () => set({ product: null }),
}));
