
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import DepartmentDashboard from '@/components/dashboard/DepartmentDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';

const Dashboard: React.FC = () => {
  const { role } = useAuth();
  
  if (role === 'student') {
    return <StudentDashboard />;
  }
  
  if (role === 'department') {
    return <DepartmentDashboard />;
  }
  
  if (role === 'admin') {
    return <AdminDashboard />;
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
