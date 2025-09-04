import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from './types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for current user
    const currentUser = localStorage.getItem('current_user');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get stored users
      const storedUsers = JSON.parse(localStorage.getItem('pawcare_users') || '[]');
      
      // Check if user exists and password matches
      const user = storedUsers.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        const loggedInUser: User = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: 'user',
          verified: true,
          createdAt: user.createdAt
        };
        setUser(loggedInUser);
        localStorage.setItem('current_user', JSON.stringify(loggedInUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Get existing users
      const storedUsers = JSON.parse(localStorage.getItem('pawcare_users') || '[]');
      
      // Check if user already exists
      if (storedUsers.find((u: any) => u.email === email)) {
        return false; // User already exists
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        createdAt: new Date().toISOString()
      };
      
      // Add to stored users
      storedUsers.push(newUser);
      localStorage.setItem('pawcare_users', JSON.stringify(storedUsers));
      
      // Auto login after signup
      const loggedInUser: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: 'user',
        verified: true,
        createdAt: newUser.createdAt
      };
      setUser(loggedInUser);
      localStorage.setItem('current_user', JSON.stringify(loggedInUser));
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = async () => {
    localStorage.removeItem('current_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};