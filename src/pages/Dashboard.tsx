
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { role } = useAuth();
  
  if (role === 'student') {
    return <Navigate to="/dashboard/student" replace />;
  }
  
  if (role === 'department') {
    return <Navigate to="/dashboard/requests" replace />;
  }
  
  if (role === 'admin') {
    return <Navigate to="/dashboard/admin" replace />;
  }
  
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-center text-lg text-muted-foreground">
        Loading your dashboard...
      </p>
    </div>
  );
};

export default Dashboard;
