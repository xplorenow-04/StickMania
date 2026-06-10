import { create } from "zustand";

export const userAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  isAdmin: false,

  setUser: (userData) =>
    set({
      user: userData,
      isLoggedIn: !!userData,
      isAdmin: userData?.role === "admin",
    }),

  clearUser: () =>
    set({
      user: null,
      isLoggedIn: false,
      isAdmin: false,
    }),
}));
