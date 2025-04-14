
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'student' | 'department' | 'admin' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const defaultUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: null
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Simulated login function
  const login = async (email: string, password: string) => {
    // In a real application, this would make an API call
    // For demonstration purposes, we're setting mock data based on email
    let user = { ...defaultUser, email };
    
    if (email.includes('student')) {
      user.role = 'student';
      user.name = 'Student User';
    } else if (email.includes('department')) {
      user.role = 'department';
      user.name = 'Department Head';
    } else if (email.includes('admin')) {
      user.role = 'admin';
      user.name = 'System Admin';
    } else {
      user.role = 'student'; // Default role
    }
    
    setCurrentUser(user);
    setRole(user.role);
    setIsAuthenticated(true);
    localStorage.setItem('clearpass_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('clearpass_user');
  };

  // Check for existing user session
  useEffect(() => {
    const storedUser = localStorage.getItem('clearpass_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setRole(user.role);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
