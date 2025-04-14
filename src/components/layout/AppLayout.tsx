
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import NotificationCenter from '@/components/advanced/NotificationCenter';
import AnalyticsDashboard from '@/components/advanced/AnalyticsDashboard';
import ReminderService from '@/utils/reminderService';

const AppLayout: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Start the reminder service when the app layout is mounted
    const reminderService = ReminderService.getInstance();
    reminderService.startReminderService();
    
    return () => {
      // Clean up when the component unmounts
      reminderService.stopReminderService();
    };
  }, []);

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-background flex items-center justify-between px-6">
          <h1 className="text-xl font-bold">ClearPass</h1>
          
          <div className="flex items-center space-x-2">
            <NotificationCenter />
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
