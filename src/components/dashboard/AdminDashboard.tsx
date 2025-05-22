
import React from 'react';
import { Users, Building, GraduationCap, FileText, CheckCircle, Clock, XCircle, BarChart3 } from 'lucide-react';
import RequestList from '@/components/clearance/RequestList';
import DashboardCard from '@/components/shared/DashboardCard';
import { Progress } from '@/components/ui/progress';
import { ClearanceStatus } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for the admin dashboard
const recentRequests = [
  {
    id: '1',
    studentId: 's1',
    studentName: 'John Doe',
    departmentName: 'Library',
    requestDate: '2023-03-15',
    status: 'pending' as ClearanceStatus,
  },
  {
    id: '2',
    studentId: 's2',
    studentName: 'Jane Smith',
    departmentName: 'Accounts Department',
    requestDate: '2023-03-14',
    status: 'approved' as ClearanceStatus,
  },
  {
    id: '3',
    studentId: 's3',
    studentName: 'Michael Johnson',
    departmentName: 'Hostel',
    requestDate: '2023-03-13',
    status: 'rejected' as ClearanceStatus,
    comment: 'Outstanding fees need to be cleared'
  },
];

const pendingRequests = [
  {
    id: '4',
    studentId: 's4',
    studentName: 'Emily Wilson',
    departmentName: 'Library',
    requestDate: '2023-03-16',
    status: 'pending' as ClearanceStatus,
  },
  {
    id: '5',
    studentId: 's5',
    studentName: 'David Brown',
    departmentName: 'Accounts Department',
    requestDate: '2023-03-15',
    status: 'pending' as ClearanceStatus,
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
  // Function to handle request approval
  const handleApprove = (requestId: string) => {
    toast.success(`Request #${requestId} has been approved`);
  };
  
  // Function to handle request rejection
  const handleReject = (requestId: string) => {
    toast.error(`Request #${requestId} has been rejected`);
  };
  
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
            <GraduationCap className="h-8 w-8 text-muted-foreground" />
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
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="statistics">Department Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <DashboardCard 
            title="Requests Awaiting Approval" 
            description="Student requests that need your action"
          >
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="p-4 border rounded-md bg-background">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <h3 className="font-medium">{request.studentName}</h3>
                      <div className="text-sm text-muted-foreground">
                        {request.departmentName} • Submitted on {request.requestDate}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-clearance-rejected hover:text-red-700"
                        onClick={() => handleReject(request.id)}
                      >
                        Reject
                      </Button>
                      <Button 
                        size="sm" 
                        className="text-white bg-clearance-approved hover:bg-green-700"
                        onClick={() => handleApprove(request.id)}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </TabsContent>
        
        <TabsContent value="all">
          <DashboardCard 
            title="All Clearance Requests" 
            description="Latest activity across all departments"
          >
            <RequestList requests={recentRequests} viewType="admin" />
          </DashboardCard>
        </TabsContent>
        
        <TabsContent value="statistics">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
