
import { getCurrentUser } from '@/api/authService';
import { isDevelopment, shouldUseBackend } from '@/utils/environmentUtils';
import { User, UserRole } from '@/types/auth';
import { processUserData } from '@/utils/authUtils';

/**
 * Hook to handle user validation functionality
 */
export const useUserValidation = (
  setCurrentUser: (user: User | null) => void,
  setRole: (role: UserRole) => void,
  setIsAuthenticated: (value: boolean) => void,
  setIsLoading: (value: boolean) => void
) => {
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
              const user = processUserData(apiUser);
              
              setCurrentUser(user);
              setRole(user.role);
              localStorage.setItem('clearpass_user', JSON.stringify(user));
              localStorage.setItem('userName', user.name);
            }
          } catch (backendError) {
            console.error('🚨 Backend validation error:', backendError);
            if (!isDevelopment()) {
              localStorage.removeItem('clearpass_user');
              localStorage.removeItem('userName');
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
      localStorage.removeItem('userName');
      setCurrentUser(null);
      setRole(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    validateCurrentUser
  };
};
