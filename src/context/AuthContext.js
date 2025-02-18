import React, { createContext, useState, useEffect, useCallback } from 'react';
import API_BASE_URL from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Ajout d'un état de chargement

  useEffect(() => {
    // Tentative de récupération des données d'authentification depuis le localStorage au chargement initial
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false); // Fin du chargement initial
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login_check`, {
        method: 'POST',
        // mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();

      // Stockage du token JWT et des informations de l'utilisateur
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ username: username }));

      setToken(data.token);
      setUser({ username: username });
      return true; // Indique que la connexion a réussi
    } catch (error) {
      console.error('Login failed:', error);
      return false; // Indique que la connexion a échoué
    }
  }, []);

  const logout = useCallback(() => {
    // Suppression du token et des informations de l'utilisateur
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Afficher un écran de chargement tant que l'état isLoading est vrai */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};
