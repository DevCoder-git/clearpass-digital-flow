
import React, { useState } from 'react';
import { Building, CheckCircle, Clock, XCircle, Check, X } from 'lucide-react';
import RequestList from '@/components/clearance/RequestList';
import DashboardCard from '@/components/shared/DashboardCard';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ClearanceStatus } from '@/components/shared/StatusBadge';

// Mock data for the department dashboard
const pendingRequests = [
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
    departmentName: 'Library',
    requestDate: '2023-03-14',
    status: 'pending' as ClearanceStatus,
  },
  {
    id: '3',
    studentId: 's3',
    studentName: 'Michael Johnson',
    departmentName: 'Library',
    requestDate: '2023-03-13',
    status: 'pending' as ClearanceStatus,
  },
];

const recentlyProcessed = [
  {
    id: '4',
    studentId: 's4',
    studentName: 'Emily Davis',
    departmentName: 'Library',
    requestDate: '2023-03-10',
    status: 'approved' as ClearanceStatus,
  },
  {
    id: '5',
    studentId: 's5',
    studentName: 'Robert Wilson',
    departmentName: 'Library',
    requestDate: '2023-03-09',
    status: 'rejected' as ClearanceStatus,
    comment: 'Books not returned',
  },
];

const departmentStats = {
  pending: 15,
  approved: 42,
  rejected: 8,
};

const DepartmentDashboard: React.FC = () => {
  const [requests, setRequests] = useState(pendingRequests);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  
  const handleIndividualApprove = (id: string) => {
    // Update the request status
    setRequests(prev => prev.filter(req => req.id !== id));
    console.log('Approving individual request:', id);
    toast.success(`Request #${id} approved successfully!`);
  };
  
  const handleIndividualReject = (id: string) => {
    setSelectedRequestId(id);
    setIsRejectDialogOpen(true);
  };
  
  const handleApprove = (id: string) => {
    handleIndividualApprove(id);
  };
  
  const handleReject = (id: string) => {
    handleIndividualReject(id);
  };
  
  const confirmReject = () => {
    if (!selectedRequestId) return;
    
    // Update the request status
    setRequests(prev => prev.filter(req => req.id !== selectedRequestId));
    console.log('Rejecting request:', selectedRequestId, 'Reason:', rejectReason);
    
    toast.success('Request rejected successfully!');
    setIsRejectDialogOpen(false);
    setRejectReason('');
    setSelectedRequestId(null);
  };

  const handleBulkApprove = () => {
    const count = requests.length;
    setRequests([]);
    toast.success(`${count} requests approved successfully!`);
  };

  const handleBulkReject = () => {
    const count = requests.length;
    setRequests([]);
    toast.success(`${count} requests rejected successfully!`);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Department Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <DashboardCard 
          title="Pending Requests" 
          description="Awaiting approval"
        >
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold">{departmentStats.pending}</div>
            <Clock className="h-8 w-8 text-clearance-pending" />
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Approved Requests" 
          description="Completed clearances"
        >
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold">{departmentStats.approved}</div>
            <CheckCircle className="h-8 w-8 text-clearance-approved" />
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Rejected Requests" 
          description="Clearances denied"
        >
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold">{departmentStats.rejected}</div>
            <XCircle className="h-8 w-8 text-clearance-rejected" />
          </div>
        </DashboardCard>
      </div>
      
      <DashboardCard 
        title="Pending Clearance Requests" 
        description="Student requests awaiting your approval"
      >
        <div className="space-y-4">
          {requests.length > 0 && (
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="text-sm font-medium">Bulk Actions:</span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleBulkReject}>
                  <X className="h-4 w-4 mr-1" />
                  Reject All
                </Button>
                <Button size="sm" onClick={handleBulkApprove}>
                  <Check className="h-4 w-4 mr-1" />
                  Approve All
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            {requests.map((request) => (
              <div key={request.id} className="p-4 border rounded-md bg-background">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <h3 className="font-medium">{request.studentName}</h3>
                    <div className="text-sm text-muted-foreground">
                      Student ID: {request.studentId} • Submitted on {request.requestDate}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Department: {request.departmentName}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-clearance-rejected hover:text-red-700 hover:border-red-300"
                      onClick={() => handleIndividualReject(request.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button 
                      size="sm" 
                      className="text-white bg-clearance-approved hover:bg-green-700"
                      onClick={() => handleIndividualApprove(request.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {requests.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No pending requests at the moment.
              </div>
            )}
          </div>
        </div>
      </DashboardCard>
      
      <DashboardCard 
        title="Recently Processed Requests" 
        description="Requests you've recently approved or rejected"
      >
        <RequestList 
          title="" 
          viewType="department" 
          requests={recentlyProcessed} 
        />
      </DashboardCard>
      
      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Clearance Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this clearance request.
              This will be visible to the student.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-32"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmReject}
              disabled={!rejectReason.trim()}
            >
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentDashboard;
