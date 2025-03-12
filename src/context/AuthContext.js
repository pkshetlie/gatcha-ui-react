import React, { createContext, useState, useEffect } from 'react';
import config from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null); // Nouveau ! Refresh Token
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedRefreshToken && storedUser) {
      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/login_check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refresh_token); // Stockez le refreshToken
      localStorage.setItem('user', JSON.stringify({ username }));

      setToken(data.token);
      setRefreshToken(data.refresh_token);
      setUser({ username });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/token/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh access token');
      }

      const data = await response.json();

      localStorage.setItem('token', data.token);
      setToken(data.token);
      localStorage.setItem('refreshToken', data.refresh_token); // Stockez le refreshToken
      setRefreshToken(data.refresh_token);

      return data.token;
    } catch (err) {
      console.error('Error refreshing token:', err);
      logout(); // Se déconnecter si le refresh échoue
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    logout,
    refreshAccessToken,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{isLoading ? <div>Loading...</div> : children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};
