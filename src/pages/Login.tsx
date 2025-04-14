
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';

const Login: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">ClearPass</h1>
        <p className="text-lg text-muted-foreground">Digital No Due Clearance System</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;
