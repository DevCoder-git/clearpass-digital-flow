
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';
import { useProfileManagement } from './useProfileManagement';
import { useUserValidation } from './useUserValidation';

/**
 * Combined hook for user authentication functionality
 */
export const useUserAuth = () => {
  const {
    currentUser,
    setCurrentUser,
    role,
    setRole,
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    setIsLoading
  } = useAuthState();

  const { login, logout } = useAuthActions(
    setCurrentUser,
    setRole,
    setIsAuthenticated
  );

  const { updateUserProfile } = useProfileManagement(
    currentUser,
    setCurrentUser
  );

  const { validateCurrentUser } = useUserValidation(
    setCurrentUser,
    setRole,
    setIsAuthenticated,
    setIsLoading
  );

  return {
    currentUser,
    role,
    isAuthenticated,
    isLoading,
    login,
    logout,
    validateCurrentUser,
    updateUserProfile
  };
};
