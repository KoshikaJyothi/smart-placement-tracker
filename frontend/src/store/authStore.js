import { create } from 'zustand';
import axios from 'axios';

axios.defaults.withCredentials = true;

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  login: async (email, password) => {
    const { data } = await axios.post(
      'https://smart-placement-tracker-4yap.onrender.com/api/auth/login',
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
      'https://smart-placement-tracker-4yap.onrender.com/api/auth/register',
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
        'https://smart-placement-tracker-4yap.onrender.com/api/auth/session',
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
      'https://smart-placement-tracker-4yap.onrender.com/api/auth/logout',
      {},
      { withCredentials: true }
    );

    set({
      user: null,
    });
  },
}));

export default useAuthStore;