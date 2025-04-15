
import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '@/api/authService';
import { toast } from 'sonner';

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

// Default values for development without backend
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch the current user on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const storedUser = localStorage.getItem('clearpass_user');
        
        if (storedUser) {
          // Temporarily use stored user while we attempt to verify with backend
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
          setRole(parsedUser.role);
          setIsAuthenticated(true);
          
          // Try to validate with backend
          const apiUser = await getCurrentUser();
          
          if (apiUser) {
            // Update with fresh data if available
            const user = {
              id: apiUser.id,
              name: `${apiUser.first_name} ${apiUser.last_name}`.trim() || apiUser.username,
              email: apiUser.email,
              role: apiUser.role as UserRole
            };
            
            setCurrentUser(user);
            setRole(user.role);
            localStorage.setItem('clearpass_user', JSON.stringify(user));
          }
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        // Clear invalid session data
        localStorage.removeItem('clearpass_user');
        setCurrentUser(null);
        setRole(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // For development, allow login without backend
      if (process.env.NODE_ENV === 'development' && !process.env.USE_BACKEND) {
        // Mock login for development
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
        return;
      }
      
      // Production login using backend
      const apiUser = await apiLogin(email, password);
      
      const user = {
        id: apiUser.id,
        name: `${apiUser.first_name} ${apiUser.last_name}`.trim() || apiUser.username,
        email: apiUser.email,
        role: apiUser.role as UserRole
      };
      
      setCurrentUser(user);
      setRole(user.role);
      setIsAuthenticated(true);
      localStorage.setItem('clearpass_user', JSON.stringify(user));
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      // For production, call the logout API
      if (process.env.NODE_ENV !== 'development' || process.env.USE_BACKEND) {
        await apiLogout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state
      setCurrentUser(null);
      setRole(null);
      setIsAuthenticated(false);
      localStorage.removeItem('clearpass_user');
    }
  };

  // Don't render children until we've checked for an existing session
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
