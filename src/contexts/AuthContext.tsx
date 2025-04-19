
import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '@/api/authService';
import { toast } from 'sonner';

export type UserRole = 'student' | 'department' | 'admin' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  twoFactorEnabled?: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password: string, useTwoFactor?: boolean) => Promise<void>;
  logout: () => void;
  enableTwoFactor: () => Promise<boolean>;
  disableTwoFactor: () => Promise<boolean>;
  requiresTwoFactor?: boolean;
  completeTwoFactorAuth: (code: string) => Promise<boolean>;
}

// Default values for development without backend
const defaultUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: null,
  twoFactorEnabled: false
};

// Helper to check if we're in development mode
const isDevelopment = () => {
  return import.meta.env.DEV;
};

// Helper to check if we should use backend in development
const shouldUseBackend = () => {
  return import.meta.env.VITE_USE_BACKEND === 'true';
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
  const [requiresTwoFactor, setRequiresTwoFactor] = useState<boolean>(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        console.log('🔍 Attempting to fetch current user...');
        const storedUser = localStorage.getItem('clearpass_user');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
          setRole(parsedUser.role);
          setIsAuthenticated(true);
          
          try {
            console.log('🌐 Trying to validate user with backend...');
            const apiUser = await getCurrentUser();
            
            if (apiUser) {
              console.log('✅ Backend user validation successful', apiUser);
              const user = {
                id: apiUser.id,
                name: `${apiUser.first_name} ${apiUser.last_name}`.trim() || apiUser.username,
                email: apiUser.email,
                role: apiUser.role as UserRole,
                twoFactorEnabled: apiUser.two_factor_enabled || false
              };
              
              setCurrentUser(user);
              setRole(user.role);
              localStorage.setItem('clearpass_user', JSON.stringify(user));
            } else {
              console.warn('❌ Backend returned no user');
            }
          } catch (backendError) {
            console.error('🚨 Backend validation error:', backendError);
          }
        }
      } catch (error) {
        console.error('🔴 Error fetching current user:', error);
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

  const login = async (email: string, password: string, useTwoFactor = false) => {
    try {
      console.log('Login attempt for:', email);
      
      // Always use mock login in development mode unless specifically configured to use backend
      if (isDevelopment()) {
        console.log('Using development mode login');
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
        
        // Simulate two-factor auth
        if (useTwoFactor) {
          user.twoFactorEnabled = true;
          setRequiresTwoFactor(true);
          toast.info("Two-factor authentication required");
          return;
        }
        
        setCurrentUser(user);
        setRole(user.role);
        setIsAuthenticated(true);
        localStorage.setItem('clearpass_user', JSON.stringify(user));
        toast.success(`Welcome, ${user.name}!`);
        return;
      }
      
      // Production login using backend
      try {
        const apiUser = await apiLogin(email, password);
        
        // Check if 2FA is enabled
        if (apiUser.two_factor_enabled && useTwoFactor) {
          setRequiresTwoFactor(true);
          toast.info("Please enter your two-factor authentication code");
          return;
        }
        
        const user = {
          id: apiUser.id,
          name: `${apiUser.first_name} ${apiUser.last_name}`.trim() || apiUser.username,
          email: apiUser.email,
          role: apiUser.role as UserRole,
          twoFactorEnabled: apiUser.two_factor_enabled || false
        };
        
        setCurrentUser(user);
        setRole(user.role);
        setIsAuthenticated(true);
        localStorage.setItem('clearpass_user', JSON.stringify(user));
      } catch (apiError) {
        console.error('API login error:', apiError);
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  };

  const completeTwoFactorAuth = async (code: string): Promise<boolean> => {
    // In a real app, this would validate the 2FA code with the backend
    try {
      // Simulate successful 2FA for demo
      if (code.length === 6) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (currentUser) {
          setIsAuthenticated(true);
          setRequiresTwoFactor(false);
          localStorage.setItem('clearpass_user', JSON.stringify(currentUser));
          toast.success('Two-factor authentication successful');
          return true;
        }
      }
      
      toast.error('Invalid verification code');
      return false;
    } catch (error) {
      console.error('2FA error:', error);
      toast.error('Two-factor authentication failed');
      return false;
    }
  };

  const enableTwoFactor = async (): Promise<boolean> => {
    try {
      if (!currentUser) {
        toast.error('You must be logged in to enable two-factor authentication');
        return false;
      }
      
      // In a real app, this would enable 2FA with the backend
      // Here we'll just update the local state
      
      const updatedUser = {
        ...currentUser,
        twoFactorEnabled: true
      };
      
      setCurrentUser(updatedUser);
      localStorage.setItem('clearpass_user', JSON.stringify(updatedUser));
      toast.success('Two-factor authentication enabled');
      return true;
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      toast.error('Failed to enable two-factor authentication');
      return false;
    }
  };

  const disableTwoFactor = async (): Promise<boolean> => {
    try {
      if (!currentUser) {
        toast.error('You must be logged in to disable two-factor authentication');
        return false;
      }
      
      // In a real app, this would disable 2FA with the backend
      // Here we'll just update the local state
      
      const updatedUser = {
        ...currentUser,
        twoFactorEnabled: false
      };
      
      setCurrentUser(updatedUser);
      localStorage.setItem('clearpass_user', JSON.stringify(updatedUser));
      toast.success('Two-factor authentication disabled');
      return true;
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast.error('Failed to disable two-factor authentication');
      return false;
    }
  };

  const logout = async () => {
    try {
      // For production, call the logout API
      if (!isDevelopment() || shouldUseBackend()) {
        await apiLogout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state
      setCurrentUser(null);
      setRole(null);
      setIsAuthenticated(false);
      setRequiresTwoFactor(false);
      localStorage.removeItem('clearpass_user');
      toast.info('You have been logged out');
    }
  };

  // Don't render children until we've checked for an existing session
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        role, 
        isAuthenticated, 
        login, 
        logout, 
        enableTwoFactor, 
        disableTwoFactor,
        requiresTwoFactor,
        completeTwoFactorAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
