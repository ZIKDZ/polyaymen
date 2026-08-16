import { create } from "zustand";
import { login as loginRequest } from "../api/client";

export const useAuthStore = create((set) => ({
  isAuthenticated: !!localStorage.getItem("access_token"),

  login: async (username, password) => {
    const { data } = await loginRequest(username, password);
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    set({ isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({ isAuthenticated: false });
  },
}));
