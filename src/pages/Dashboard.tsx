
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const { role, isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Log the current role for debugging purposes
    console.log('Current user role in Dashboard:', role);
  }, [role]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (role === 'student') {
    return <Navigate to="/dashboard/student" replace />;
  }
  
  if (role === 'department') {
    return <Navigate to="/dashboard/requests" replace />;
  }
  
  if (role === 'admin') {
    return <Navigate to="/dashboard/admin" replace />;
  }
  
  // Display loading state while role is being determined
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-center text-lg text-muted-foreground">
        Loading your dashboard...
      </p>
    </div>
  );
};

export default Dashboard;
