
import React, { useState } from 'react';
import { Building, CheckCircle, Clock, XCircle, Users, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import RequestList from '@/components/clearance/RequestList';
import DashboardCard from '@/components/shared/DashboardCard';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

const DepartmentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    requests, 
    users, 
    departments, 
    getDepartmentUsers, 
    getDepartmentRequests,
    systemStats
  } = useData();

  // Get current user's department
  const userDepartment = currentUser?.department || 'Library'; // Default fallback
  
  // Get department-specific data
  const departmentUsers = getDepartmentUsers(userDepartment);
  const departmentRequests = getDepartmentRequests(userDepartment);
  const staffMembers = departmentUsers.filter(user => user.role === 'department' || user.role === 'admin');
  
  // Calculate stats for current department
  const pendingRequests = departmentRequests.filter(req => req.status === 'pending').length;
  const approvedRequests = departmentRequests.filter(req => req.status === 'approved').length;
  const rejectedRequests = departmentRequests.filter(req => req.status === 'rejected').length;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Department Dashboard</h1>
          <p className="text-muted-foreground">{userDepartment} - Department Head</p>
        </div>
        <Button asChild>
          <Link to="/dashboard/staff-management">
            <UserCheck className="mr-2 h-4 w-4" />
            Manage Staff
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4">
        <DashboardCard 
          title="Department Staff" 
          description="Total staff members"
        >
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold">{staffMembers.length}</div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Pending Requests" 
          description="Awaiting approval"
        >
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold">{pendingRequests}</div>
            <Clock className="h-8 w-8 text-clearance-pending" />
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Approved Requests" 
          description="Completed clearances"
        >
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold">{approvedRequests}</div>
            <CheckCircle className="h-8 w-8 text-clearance-approved" />
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Rejected Requests" 
          description="Clearances denied"
        >
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold">{rejectedRequests}</div>
            <XCircle className="h-8 w-8 text-clearance-rejected" />
          </div>
        </DashboardCard>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <DashboardCard 
          title="Staff Management" 
          description="Manage staff permissions and approvals"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Staff Members</span>
              <span className="text-2xl font-bold">{staffMembers.length}</span>
            </div>
            <div className="space-y-2">
              {staffMembers.slice(0, 3).map((staff) => (
                <div key={staff.id} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div>
                    <p className="font-medium">{staff.name}</p>
                    <p className="text-sm text-muted-foreground">{staff.role}</p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard/staff-management">
                Manage All Staff
              </Link>
            </Button>
          </div>
        </DashboardCard>

        <DashboardCard 
          title="Department Overview" 
          description="System-wide department statistics"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Departments</span>
              <span className="text-2xl font-bold">{systemStats.totalDepartments}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Students</span>
              <span className="text-2xl font-bold">{systemStats.totalStudents}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">System Requests</span>
              <span className="text-2xl font-bold">{systemStats.totalRequests}</span>
            </div>
          </div>
        </DashboardCard>
      </div>
      
      <DashboardCard 
        title="Recent Department Requests" 
        description="Latest clearance requests for your department"
      >
        <RequestList 
          title="" 
          viewType="department" 
          requests={departmentRequests.slice(0, 10)} 
        />
        {departmentRequests.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No requests found for {userDepartment} department.
          </div>
        )}
      </DashboardCard>
    </div>
  );
};

export default DepartmentDashboard;
