
import { useState } from 'react';
import { User, UserRole } from '@/types/auth';

/**
 * Hook to manage authentication state
 */
export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return {
    currentUser,
    setCurrentUser,
    role,
    setRole,
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    setIsLoading
  };
};
