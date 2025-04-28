
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import RequestList from '@/components/clearance/RequestList';
import { toast } from 'sonner';
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

const AdminDashboard = () => {
  const [requests, setRequests] = useState<RequestData[]>([
    {
      id: '1',
      studentId: 's1',
      studentName: localStorage.getItem('userName') || 'Unknown Student',
      departmentName: 'Library',
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    },
    {
      id: '2',
      studentId: 's2',
      studentName: localStorage.getItem('userName') || 'Unknown Student',
      departmentName: 'Library',
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    },
  ]);

  const handleApprove = (id: string) => {
    setRequests(prev =>
      prev.map(request =>
        request.id === id
          ? { ...request, status: 'approved' as ClearanceStatus }
          : request
      )
    );
    toast.success('Request approved successfully');
  };

  const handleReject = (id: string, reason: string) => {
    setRequests(prev =>
      prev.map(request =>
        request.id === id
          ? { ...request, status: 'rejected' as ClearanceStatus, comment: reason }
          : request
      )
    );
    toast.success('Request rejected successfully');
  };

  // Get counts for the dashboard
  const totalStudents = new Set(requests.map(r => r.studentId)).size;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const approvedRequests = requests.filter(r => r.status === 'approved').length;
  const rejectedRequests = requests.filter(r => r.status === 'rejected').length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 flex items-center space-x-4">
          <Users className="h-8 w-8 text-blue-500" />
          <div>
            <h3 className="text-lg font-semibold">{totalStudents}</h3>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <Clock className="h-8 w-8 text-orange-500" />
          <div>
            <h3 className="text-lg font-semibold">{pendingRequests}</h3>
            <p className="text-sm text-muted-foreground">Pending Requests</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <div>
            <h3 className="text-lg font-semibold">{approvedRequests}</h3>
            <p className="text-sm text-muted-foreground">Approved Requests</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <XCircle className="h-8 w-8 text-red-500" />
          <div>
            <h3 className="text-lg font-semibold">{rejectedRequests}</h3>
            <p className="text-sm text-muted-foreground">Rejected Requests</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Pending Clearance Requests</h2>
        <RequestList 
          requests={requests.filter(r => r.status === 'pending')}
          viewType="admin"
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;
