
import { login as apiLogin, logout as apiLogout } from '@/api/authService';
import { toast } from 'sonner';
import { User, UserRole } from '@/types/auth';
import { isDevelopment, defaultUser } from '@/utils/environmentUtils';
import { createDemoUser, processUserData } from '@/utils/authUtils';

/**
 * Hook to handle authentication actions like login and logout
 */
export const useAuthActions = (
  setCurrentUser: (user: User | null) => void,
  setRole: (role: UserRole) => void,
  setIsAuthenticated: (value: boolean) => void
) => {
  const login = async (email: string, password: string) => {
    try {
      console.log('Login attempt for:', email);
      
      if (isDevelopment()) {
        console.log('Using development mode login');
        // Parse role from email for demo purposes
        const roleParts = email.split('_');
        let role = defaultUser.role;
        
        // If email contains role info (e.g., "admin_user@example.com")
        if (roleParts.length > 1) {
          const requestedRole = roleParts[0];
          if (['admin', 'student', 'department'].includes(requestedRole)) {
            role = requestedRole as UserRole;
          }
        }
        
        const user = createDemoUser(email, {...defaultUser, role});
        
        setCurrentUser(user);
        setRole(user.role);
        setIsAuthenticated(true);
        localStorage.setItem('clearpass_user', JSON.stringify(user));
        localStorage.setItem('userName', user.name);
        toast.success(`Welcome, ${user.name}!`);
        return;
      }
      
      // In production, try to use the API
      try {
        const apiUser = await apiLogin(email, password);
        const user = processUserData(apiUser);
        
        setCurrentUser(user);
        setRole(user.role);
        setIsAuthenticated(true);
        localStorage.setItem('clearpass_user', JSON.stringify(user));
        localStorage.setItem('userName', user.name);
        toast.success(`Welcome, ${user.name}!`);
      } catch (apiError) {
        console.error('API login failed:', apiError);
        
        // If API fails in production environment, fall back to mock login for demo
        console.log('Falling back to demo mode login');
        const roleParts = email.split('_');
        let role = defaultUser.role;
        
        if (roleParts.length > 1) {
          const requestedRole = roleParts[0];
          if (['admin', 'student', 'department'].includes(requestedRole)) {
            role = requestedRole as UserRole;
          }
        }
        
        const user = createDemoUser(email, {...defaultUser, role});
        
        setCurrentUser(user);
        setRole(user.role);
        setIsAuthenticated(true);
        localStorage.setItem('clearpass_user', JSON.stringify(user));
        localStorage.setItem('userName', user.name);
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
      localStorage.removeItem('userName');
      toast.info('You have been logged out');
    }
  };

  return {
    login,
    logout
  };
};
