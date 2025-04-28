
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import RequestList from '@/components/clearance/RequestList';
import { Link } from 'react-router-dom';
import { ClearanceStatus } from '@/components/shared/StatusBadge';

interface RequestData {
  id: string;
  studentId: string;
  studentName: string;
  departmentName: string;
  requestDate: string;
  status: ClearanceStatus;
  comment?: string;
}

const StudentDashboard = () => {
  const { currentUser } = useAuth();

  // We'll use the existing mock data for now
  const requests: RequestData[] = [
    {
      id: '1',
      studentId: currentUser?.id || '',
      studentName: currentUser?.name || '',
      departmentName: 'Library',
      requestDate: '2023-03-15',
      status: 'pending',
    },
    {
      id: '2',
      studentId: currentUser?.id || '',
      studentName: currentUser?.name || '',
      departmentName: 'Accounts',
      requestDate: '2023-03-14',
      status: 'approved',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <Button asChild>
          <Link to="/dashboard/apply">
            <FileText className="mr-2 h-4 w-4" />
            New Clearance Request
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 flex items-center space-x-4">
          <Clock className="h-8 w-8 text-orange-500" />
          <div>
            <h3 className="text-lg font-semibold">2</h3>
            <p className="text-sm text-muted-foreground">Pending Requests</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <div>
            <h3 className="text-lg font-semibold">3</h3>
            <p className="text-sm text-muted-foreground">Approved Requests</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <XCircle className="h-8 w-8 text-red-500" />
          <div>
            <h3 className="text-lg font-semibold">1</h3>
            <p className="text-sm text-muted-foreground">Rejected Requests</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Requests</h2>
        <RequestList 
          requests={requests}
          viewType="student"
        />
      </Card>
    </div>
  );
};

export default StudentDashboard;
