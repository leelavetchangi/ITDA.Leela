import { useEffect, useState } from 'react';
import authService from '../services/authService';
import { AuthContext } from './authContextValue';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.me();
        setUser(response.data.user);
      } catch {
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, [token]);

  async function login(credentials) {
    const response = await authService.login(credentials);
    const nextToken = response.data.token;
    localStorage.setItem('token', nextToken);
    setToken(nextToken);
    setUser(response.data.user);
  }

  async function register(details) {
    const response = await authService.register(details);
    const nextToken = response.data.token;
    localStorage.setItem('token', nextToken);
    setToken(nextToken);
    setUser(response.data.user);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}