
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import RequestList from '@/components/clearance/RequestList';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [requests, setRequests] = useState([
    {
      id: '1',
      studentId: 's1',
      studentName: 'John Doe',
      departmentName: 'Library',
      requestDate: '2023-03-15',
      status: 'pending' as const,
    },
    {
      id: '2',
      studentId: 's2',
      studentName: 'Jane Smith',
      departmentName: 'Library',
      requestDate: '2023-03-14',
      status: 'pending' as const,
    },
    {
      id: '3',
      studentId: 's3',
      studentName: 'Alice Johnson',
      departmentName: 'Accounts',
      requestDate: '2023-03-13',
      status: 'pending' as const,
    },
  ]);

  const handleApprove = (id: string) => {
    setRequests(prev =>
      prev.map(request =>
        request.id === id
          ? { ...request, status: 'approved' as const }
          : request
      )
    );
    toast.success('Request approved successfully');
  };

  const handleReject = (id: string, reason: string) => {
    setRequests(prev =>
      prev.map(request =>
        request.id === id
          ? { ...request, status: 'rejected' as const, comment: reason }
          : request
      )
    );
    toast.success('Request rejected successfully');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 flex items-center space-x-4">
          <Users className="h-8 w-8 text-blue-500" />
          <div>
            <h3 className="text-lg font-semibold">150</h3>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <Clock className="h-8 w-8 text-orange-500" />
          <div>
            <h3 className="text-lg font-semibold">25</h3>
            <p className="text-sm text-muted-foreground">Pending Requests</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <div>
            <h3 className="text-lg font-semibold">75</h3>
            <p className="text-sm text-muted-foreground">Approved Requests</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <XCircle className="h-8 w-8 text-red-500" />
          <div>
            <h3 className="text-lg font-semibold">10</h3>
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
