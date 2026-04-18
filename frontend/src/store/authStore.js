import { create } from "zustand";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const useAuth = create((set) => ({
  currentUser: null,
  loading: true, // start true so ProtectedRoute waits before any redirect
  isAuthenticated: false,
  error: null,

  login: async (userCredWithRole) => {
    const { role, ...userCredObj } = userCredWithRole;
    try {
      set({ loading: true, error: null });

      const res = await axios.post(
        `${BASE_URL}/common-api/login`,
        userCredObj,
        { withCredentials: true }
      );

      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload,
      });
    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || "Login failed",
      });
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });

      await axios.get(`${BASE_URL}/common-api/logout`, {
        withCredentials: true,
      });

      set({ loading: false, isAuthenticated: false, currentUser: null });
    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || "Logout failed",
      });
    }
  },

  // Restores login on page refresh — returns full user object from DB
  checkAuth: async () => {
    try {
      set({ loading: true });

      const res = await axios.get(`${BASE_URL}/common-api/check-auth`, {
        withCredentials: true,
      });

      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },
}));
