
import React from 'react';
import { Users, Building, Graduation, FileText, CheckCircle, Clock, XCircle, BarChart3 } from 'lucide-react';
import RequestList from '@/components/clearance/RequestList';
import DashboardCard from '@/components/shared/DashboardCard';
import { Progress } from '@/components/ui/progress';

// Mock data for the admin dashboard
const recentRequests = [
  {
    id: '1',
    studentId: 's1',
    studentName: 'John Doe',
    departmentName: 'Library',
    requestDate: '2023-03-15',
    status: 'pending',
  },
  {
    id: '2',
    studentId: 's2',
    studentName: 'Jane Smith',
    departmentName: 'Accounts Department',
    requestDate: '2023-03-14',
    status: 'approved',
  },
  {
    id: '3',
    studentId: 's3',
    studentName: 'Michael Johnson',
    departmentName: 'Hostel',
    requestDate: '2023-03-13',
    status: 'rejected',
    comment: 'Outstanding fees need to be cleared'
  },
];

const systemStats = {
  students: 150,
  departments: 6,
  clearanceRequests: 120,
  pendingRequests: 30,
};

const departmentPerformance = [
  { name: 'Library', completed: 42, total: 50 },
  { name: 'Hostel', completed: 38, total: 45 },
  { name: 'Accounts', completed: 36, total: 48 },
  { name: 'Sports', completed: 40, total: 42 },
  { name: 'Lab', completed: 35, total: 45 },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
          title="Total Students" 
          description="Registered in the system"
        >
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold">{systemStats.students}</div>
            <Graduation className="h-8 w-8 text-muted-foreground" />
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Departments" 
          description="Active in the system"
        >
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold">{systemStats.departments}</div>
            <Building className="h-8 w-8 text-muted-foreground" />
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Clearance Requests" 
          description="Total requests submitted"
        >
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold">{systemStats.clearanceRequests}</div>
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Pending Requests" 
          description="Awaiting department approval"
        >
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold">{systemStats.pendingRequests}</div>
            <Clock className="h-8 w-8 text-clearance-pending" />
          </div>
        </DashboardCard>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <DashboardCard 
          title="Department Performance" 
          description="Clearance completion rate by department"
        >
          <div className="space-y-4">
            {departmentPerformance.map((dept) => {
              const percentage = Math.round((dept.completed / dept.total) * 100);
              return (
                <div key={dept.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{dept.name}</span>
                    <span>{percentage}% ({dept.completed}/{dept.total})</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Clearance Status Overview" 
          description="System-wide clearance statistics"
        >
          <div className="h-60 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="flex flex-col items-center justify-center p-4 rounded-md bg-secondary">
                <CheckCircle className="h-8 w-8 text-clearance-approved mb-2" />
                <span className="text-2xl font-bold">65</span>
                <span className="text-sm text-muted-foreground">Approved</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-md bg-secondary">
                <Clock className="h-8 w-8 text-clearance-pending mb-2" />
                <span className="text-2xl font-bold">30</span>
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-md bg-secondary">
                <XCircle className="h-8 w-8 text-clearance-rejected mb-2" />
                <span className="text-2xl font-bold">25</span>
                <span className="text-sm text-muted-foreground">Rejected</span>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
      
      <DashboardCard 
        title="Recent Clearance Requests" 
        description="Latest activity across all departments"
      >
        <RequestList requests={recentRequests} viewType="admin" />
      </DashboardCard>
    </div>
  );
};

export default AdminDashboard;
