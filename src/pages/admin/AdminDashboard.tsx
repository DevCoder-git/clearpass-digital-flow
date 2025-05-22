
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import RequestList from '@/components/clearance/RequestList';
import { toast } from 'sonner';
import { ClearanceStatus } from '@/components/shared/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      studentName: 'John Doe',
      departmentName: 'Library',
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    },
    {
      id: '2',
      studentId: 's2',
      studentName: 'Jane Smith',
      departmentName: 'Library',
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    },
    {
      id: '3',
      studentId: 's3',
      studentName: 'Michael Johnson',
      departmentName: 'Accounts',
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    },
    {
      id: '4',
      studentId: 's4',
      studentName: 'Emily Wilson',
      departmentName: 'Hostel',
      requestDate: new Date().toISOString().split('T')[0],
      status: 'approved',
    },
    {
      id: '5',
      studentId: 's5',
      studentName: 'Robert Brown',
      departmentName: 'Sports',
      requestDate: new Date().toISOString().split('T')[0],
      status: 'rejected',
      comment: 'Outstanding fees need to be cleared'
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

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending Requests ({pendingRequests})</TabsTrigger>
          <TabsTrigger value="approved">Approved Requests ({approvedRequests})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected Requests ({rejectedRequests})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-0">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Pending Clearance Requests</h2>
            <RequestList 
              requests={requests.filter(r => r.status === 'pending')}
              viewType="admin"
              onApprove={handleApprove}
              onReject={handleReject}
            />
            {pendingRequests === 0 && (
              <p className="text-muted-foreground text-center py-4">No pending requests found.</p>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="approved" className="mt-0">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Approved Clearance Requests</h2>
            <RequestList 
              requests={requests.filter(r => r.status === 'approved')}
              viewType="admin"
            />
            {approvedRequests === 0 && (
              <p className="text-muted-foreground text-center py-4">No approved requests found.</p>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-0">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Rejected Clearance Requests</h2>
            <RequestList 
              requests={requests.filter(r => r.status === 'rejected')}
              viewType="admin"
            />
            {rejectedRequests === 0 && (
              <p className="text-muted-foreground text-center py-4">No rejected requests found.</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
