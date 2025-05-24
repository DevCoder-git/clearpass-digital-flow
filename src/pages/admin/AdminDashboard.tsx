
import React from 'react';
import { Card } from '@/components/ui/card';
import { Users, Clock, CheckCircle, XCircle, Building } from 'lucide-react';
import RequestList from '@/components/clearance/RequestList';
import { toast } from 'sonner';
import { ClearanceStatus } from '@/components/shared/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/contexts/DataContext';

const AdminDashboard = () => {
  const { 
    requests, 
    systemStats, 
    updateRequestStatus,
    users,
    departments
  } = useData();

  const handleApprove = (id: string) => {
    updateRequestStatus(id, 'approved');
    toast.success('Request approved successfully');
  };

  const handleReject = (id: string, reason: string) => {
    updateRequestStatus(id, 'rejected', reason);
    toast.success('Request rejected successfully');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 flex items-center space-x-4">
          <Users className="h-8 w-8 text-blue-500" />
          <div>
            <h3 className="text-lg font-semibold">{systemStats.totalStudents}</h3>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <Building className="h-8 w-8 text-purple-500" />
          <div>
            <h3 className="text-lg font-semibold">{systemStats.totalDepartments}</h3>
            <p className="text-sm text-muted-foreground">Departments</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <Clock className="h-8 w-8 text-orange-500" />
          <div>
            <h3 className="text-lg font-semibold">{systemStats.pendingRequests}</h3>
            <p className="text-sm text-muted-foreground">Pending Requests</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <div>
            <h3 className="text-lg font-semibold">{systemStats.approvedRequests}</h3>
            <p className="text-sm text-muted-foreground">Approved Requests</p>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending Requests ({systemStats.pendingRequests})</TabsTrigger>
          <TabsTrigger value="approved">Approved Requests ({systemStats.approvedRequests})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected Requests ({systemStats.rejectedRequests})</TabsTrigger>
          <TabsTrigger value="departments">Departments ({systemStats.totalDepartments})</TabsTrigger>
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
            {systemStats.pendingRequests === 0 && (
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
            {systemStats.approvedRequests === 0 && (
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
            {systemStats.rejectedRequests === 0 && (
              <p className="text-muted-foreground text-center py-4">No rejected requests found.</p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="mt-0">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Department Overview</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {departments.map((dept) => (
                <Card key={dept.id} className="p-4">
                  <h3 className="font-semibold">{dept.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{dept.description}</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Head:</span>
                      <span className="font-medium">{dept.head}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Users:</span>
                      <span className="font-medium">{dept.userCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending:</span>
                      <span className="font-medium text-orange-600">{dept.pendingRequests}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
