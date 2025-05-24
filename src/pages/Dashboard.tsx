
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { role, currentUser } = useAuth();

  console.log('Dashboard component - Current role:', role);
  console.log('Dashboard component - Current user:', currentUser);

  // Redirect based on user role
  useEffect(() => {
    console.log('Dashboard useEffect - Role:', role);
  }, [role]);

  if (!role) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  // Role-based redirection
  switch (role) {
    case 'admin':
      console.log('Redirecting to admin dashboard');
      return <Navigate to="/dashboard/admin" replace />;
    case 'student':
      console.log('Redirecting to student dashboard');
      return <Navigate to="/dashboard/student" replace />;
    case 'department':
      console.log('Redirecting to department dashboard');
      return <Navigate to="/dashboard/department" replace />;
    default:
      console.log('Unknown role, redirecting to overview');
      return <Navigate to="/dashboard/overview" replace />;
  }
};

export default Dashboard;
