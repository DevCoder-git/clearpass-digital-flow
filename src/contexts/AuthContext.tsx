
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType } from '@/types/auth';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useTwoFactorAuth } from '@/hooks/useTwoFactorAuth';

// Create the auth context with a default value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    currentUser, 
    role, 
    isAuthenticated, 
    isLoading,
    login: userLogin,
    logout,
    validateCurrentUser,
    updateUserProfile: updateUser
  } = useUserAuth();

  const {
    requiresTwoFactor,
    setRequiresTwoFactor,
    completeTwoFactorAuth,
    enableTwoFactor: enable2FA,
    disableTwoFactor: disable2FA
  } = useTwoFactorAuth();

  useEffect(() => {
    // Fetch the current user when the component mounts
    validateCurrentUser();
  }, []);

  const login = async (email: string, password: string, useTwoFactor = false) => {
    if (useTwoFactor) {
      setRequiresTwoFactor(true);
      return;
    }
    await userLogin(email, password);
  };

  const enableTwoFactor = async () => {
    return await enable2FA(currentUser);
  };

  const disableTwoFactor = async () => {
    return await disable2FA(currentUser);
  };

  const updateUserProfile = async (name: string, email: string) => {
    return await updateUser(name, email);
  };

  // Create the context value
  const contextValue: AuthContextType = { 
    currentUser, 
    role, 
    isAuthenticated, 
    login, 
    logout, 
    enableTwoFactor, 
    disableTwoFactor,
    requiresTwoFactor,
    completeTwoFactorAuth,
    updateUserProfile
  };

  // Show a loading indicator while the auth state is being determined
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
