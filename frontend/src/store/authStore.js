import { create } from 'zustand';
import axios from 'axios';

axios.defaults.withCredentials = true;

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  login: async (email, password) => {
    const { data } = await axios.post(
      'http://localhost:5000/api/auth/login',
      { email, password },
      { withCredentials: true }
    );

    set({
      user: data.user,
      loading: false,
    });

    return data;
  },

  register: async (userData) => {
    const { data } = await axios.post(
      'http://localhost:5000/api/auth/register',
      userData,
      { withCredentials: true }
    );

    set({
      user: data.user,
      loading: false,
    });

    return data;
  },

  checkSession: async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:5000/api/auth/session',
        { withCredentials: true }
      );

      set({
        user: data.user,
        loading: false,
      });
    } catch {
      set({
        user: null,
        loading: false,
      });
    }
  },

  logout: async () => {
    await axios.post(
      'http://localhost:5000/api/auth/logout',
      {},
      { withCredentials: true }
    );

    set({
      user: null,
    });
  },
}));

export default useAuthStore;