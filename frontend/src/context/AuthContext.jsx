import { createContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const userInfo = localStorage.getItem('userInfo');

      if (!userInfo) {
        setLoading(false);
        return;
      }

      try {
        const storedUser = JSON.parse(userInfo);

        if (!storedUser.token) {
          setUser(storedUser);
          setLoading(false);
          return;
        }

        const { data } = await apiClient.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${storedUser.token}` }
        });

        setUser({ ...data, token: storedUser.token });
      } catch {
        localStorage.removeItem('userInfo');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await apiClient.post('/api/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const register = async (userData) => {
    const { data } = await apiClient.post('/api/auth/register', userData);
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};