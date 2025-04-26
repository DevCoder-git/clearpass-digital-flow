import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import RequestList from '@/components/clearance/RequestList';
import DashboardCard from '@/components/shared/DashboardCard';
import { Progress } from '@/components/ui/progress';
import { ClearanceStatus } from '@/components/shared/StatusBadge';
import DigitalBadge from "@/components/shared/DigitalBadge";

const recentRequests = [
  {
    id: '1',
    studentId: 's1',
    studentName: 'John Doe',
    departmentName: 'Library',
    requestDate: '2023-03-15',
    status: 'approved' as ClearanceStatus,
  },
  {
    id: '2',
    studentId: 's1',
    studentName: 'John Doe',
    departmentName: 'Accounts Department',
    requestDate: '2023-03-15',
    status: 'pending' as ClearanceStatus,
  },
  {
    id: '3',
    studentId: 's1',
    studentName: 'John Doe',
    departmentName: 'Hostel',
    requestDate: '2023-03-15',
    status: 'rejected' as ClearanceStatus,
    comment: 'Outstanding fees need to be cleared'
  },
];

const clearanceStatus = {
  total: 6,
  approved: 2,
  pending: 3,
  rejected: 1,
};

const StudentDashboard: React.FC = () => {
  const progressPercentage = (clearanceStatus.approved / clearanceStatus.total) * 100;

  // Determine if all clearances are approved
  const allCleared = clearanceStatus.approved === clearanceStatus.total;
  const studentName = recentRequests[0]?.studentName || "Student";
  const certificateId = "CLEAR-2025-00123"; // Use actual id if available in real data

  return (
    <div className="space-y-6">
      {/* Show Digital Badge if all clearances approved */}
      {allCleared && (
        <section className="animate-fade-in">
          <DigitalBadge studentName={studentName} certificateId={certificateId} />
        </section>
      )}
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <Link to="/dashboard/apply">
          <Button>
            Apply for Clearance
          </Button>
        </Link>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
          title="Total Departments" 
          description="Departments requiring clearance"
        >
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold">{clearanceStatus.total}</div>
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Approved" 
          description="Cleared departments"
        >
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold">{clearanceStatus.approved}</div>
            <CheckCircle className="h-8 w-8 text-clearance-approved" />
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Pending" 
          description="Awaiting approval"
        >
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold">{clearanceStatus.pending}</div>
            <Clock className="h-8 w-8 text-clearance-pending" />
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Rejected" 
          description="Requires action"
        >
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold">{clearanceStatus.rejected}</div>
            <XCircle className="h-8 w-8 text-clearance-rejected" />
          </div>
        </DashboardCard>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <DashboardCard 
          title="Clearance Progress" 
          description="Overall clearance status"
        >
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <p className="text-3xl font-bold">{Math.round(progressPercentage)}%</p>
              </div>
              <div className="text-sm text-muted-foreground">
                {clearanceStatus.approved}/{clearanceStatus.total} departments
              </div>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-clearance-approved" />
                <span>Approved: {clearanceStatus.approved}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-clearance-pending" />
                <span>Pending: {clearanceStatus.pending}</span>
              </div>
              <div className="flex items-center gap-1">
                <XCircle className="h-4 w-4 text-clearance-rejected" />
                <span>Rejected: {clearanceStatus.rejected}</span>
              </div>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Recent Activity" 
          description="Latest updates on your clearance requests"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              {recentRequests.slice(0, 3).map((request) => (
                <div key={request.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {request.status === 'approved' && (
                      <CheckCircle className="h-4 w-4 text-clearance-approved" />
                    )}
                    {request.status === 'pending' && (
                      <Clock className="h-4 w-4 text-clearance-pending" />
                    )}
                    {request.status === 'rejected' && (
                      <XCircle className="h-4 w-4 text-clearance-rejected" />
                    )}
                    <span>{request.departmentName}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{request.requestDate}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Link to="/dashboard/requests" className="flex items-center text-sm text-primary animated-link">
                View all requests
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </DashboardCard>
      </div>
      
      <DashboardCard 
        title="Recent Clearance Requests" 
        description="Status of your recent clearance applications"
      >
        <RequestList requests={recentRequests} viewType="student" />
      </DashboardCard>
    </div>
  );
};

export default StudentDashboard;
