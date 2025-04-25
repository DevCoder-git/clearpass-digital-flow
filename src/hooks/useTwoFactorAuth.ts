
import { useState } from 'react';
import { toast } from 'sonner';
import { User } from '@/types/auth';

export const useTwoFactorAuth = () => {
  const [requiresTwoFactor, setRequiresTwoFactor] = useState<boolean>(false);

  const completeTwoFactorAuth = async (code: string): Promise<boolean> => {
    try {
      if (code.length === 6) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRequiresTwoFactor(false);
        toast.success('Two-factor authentication successful');
        return true;
      }
      
      toast.error('Invalid verification code');
      return false;
    } catch (error) {
      console.error('2FA error:', error);
      toast.error('Two-factor authentication failed');
      return false;
    }
  };

  const enableTwoFactor = async (currentUser: User | null): Promise<boolean> => {
    try {
      if (!currentUser) {
        toast.error('You must be logged in to enable two-factor authentication');
        return false;
      }
      
      const updatedUser = {
        ...currentUser,
        twoFactorEnabled: true
      };
      
      localStorage.setItem('clearpass_user', JSON.stringify(updatedUser));
      toast.success('Two-factor authentication enabled');
      return true;
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      toast.error('Failed to enable two-factor authentication');
      return false;
    }
  };

  const disableTwoFactor = async (currentUser: User | null): Promise<boolean> => {
    try {
      if (!currentUser) {
        toast.error('You must be logged in to disable two-factor authentication');
        return false;
      }
      
      const updatedUser = {
        ...currentUser,
        twoFactorEnabled: false
      };
      
      localStorage.setItem('clearpass_user', JSON.stringify(updatedUser));
      toast.success('Two-factor authentication disabled');
      return true;
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast.error('Failed to disable two-factor authentication');
      return false;
    }
  };

  return {
    requiresTwoFactor,
    setRequiresTwoFactor,
    completeTwoFactorAuth,
    enableTwoFactor,
    disableTwoFactor
  };
};

