
import { isDevelopment, shouldUseBackend } from '@/utils/environmentUtils';
import { User } from '@/types/auth';

/**
 * Hook to manage user profile updates
 */
export const useProfileManagement = (
  currentUser: User | null,
  setCurrentUser: (user: User | null) => void
) => {
  const updateUserProfile = async (name: string, email: string) => {
    try {
      // If we have an API, use it to update the user profile
      if (!isDevelopment() && shouldUseBackend()) {
        // This would be implemented with a real API call
        console.log('Would call API to update profile:', { name, email });
      }
      
      // For demo purposes, update the user in local state and localStorage
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          name,
          email
        };
        
        setCurrentUser(updatedUser);
        localStorage.setItem('clearpass_user', JSON.stringify(updatedUser));
        localStorage.setItem('userName', name);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  return {
    updateUserProfile
  };
};
