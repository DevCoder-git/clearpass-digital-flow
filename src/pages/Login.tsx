
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import TwoFactorAuth from '@/components/auth/TwoFactorAuth';

const Login: React.FC = () => {
  const { isAuthenticated, requiresTwoFactor, completeTwoFactorAuth } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleTwoFactorComplete = async () => {
    // In a real app, this would get the code from the input
    // Here we're just simulating a successful verification
    const success = await completeTwoFactorAuth('123456');
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleTwoFactorCancel = () => {
    // Redirect back to login
    window.location.reload();
  };

  const onLoginStart = (email: string) => {
    setEmail(email);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="w-full max-w-md p-8 space-y-8 bg-background rounded-lg shadow-xl border">
        {requiresTwoFactor ? (
          <TwoFactorAuth 
            onVerified={handleTwoFactorComplete} 
            onCancel={handleTwoFactorCancel}
            email={email}
          />
        ) : (
          <LoginForm onLoginStart={onLoginStart} />
        )}
      </div>
    </div>
  );
};

export default Login;
