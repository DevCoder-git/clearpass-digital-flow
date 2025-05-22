
import { useState } from 'react';
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '@/api/authService';
import { toast } from 'sonner';
import { User, UserRole } from '@/types/auth';
import { isDevelopment, shouldUseBackend, defaultUser } from '@/utils/environmentUtils';

export const useUserAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = async (email: string, password: string, useTwoFactor = false) => {
    try {
      console.log('Login attempt for:', email);
      
      if (isDevelopment()) {
        console.log('Using development mode login');
        let user = { ...defaultUser, email };
        
        // Set the correct role based on email
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
          user.role = 'student';
        }
        
        setCurrentUser(user);
        setRole(user.role);
        setIsAuthenticated(true);
        localStorage.setItem('clearpass_user', JSON.stringify(user));
        toast.success(`Welcome, ${user.name}!`);
        return;
      }
      
      // In production, try to use the API
      try {
        const apiUser = await apiLogin(email, password);
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
        toast.success(`Welcome, ${user.name}!`);
      } catch (apiError) {
        console.error('API login failed:', apiError);
        
        // If API fails in production environment, fall back to mock login for demo
        console.log('Falling back to demo mode login');
        let user = { ...defaultUser, email };
        
        // Set the correct role based on email for the fallback as well
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
          user.role = 'student';
        }
        
        setCurrentUser(user);
        setRole(user.role);
        setIsAuthenticated(true);
        localStorage.setItem('clearpass_user', JSON.stringify(user));
        toast.success(`Welcome, ${user.name}! (Demo Mode)`);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (!isDevelopment()) {
        try {
          await apiLogout();
        } catch (error) {
          console.error('API Logout error:', error);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setCurrentUser(null);
      setRole(null);
      setIsAuthenticated(false);
      localStorage.removeItem('clearpass_user');
      toast.info('You have been logged out');
    }
  };

  const validateCurrentUser = async () => {
    try {
      console.log('🔍 Attempting to fetch current user...');
      const storedUser = localStorage.getItem('clearpass_user');
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        setRole(parsedUser.role);
        setIsAuthenticated(true);
        
        if (!isDevelopment() || shouldUseBackend()) {
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
            }
          } catch (backendError) {
            console.error('🚨 Backend validation error:', backendError);
            if (!isDevelopment()) {
              localStorage.removeItem('clearpass_user');
              setCurrentUser(null);
              setRole(null);
              setIsAuthenticated(false);
            }
          }
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

  return {
    currentUser,
    role,
    isAuthenticated,
    isLoading,
    login,
    logout,
    validateCurrentUser
  };
};
