
import React, { useState } from 'react';
import { Building, CheckCircle, Clock, XCircle } from 'lucide-react';
import RequestList from '@/components/clearance/RequestList';
import DashboardCard from '@/components/shared/DashboardCard';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// Mock data for the department dashboard
const pendingRequests = [
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
    departmentName: 'Library',
    requestDate: '2023-03-14',
    status: 'pending',
  },
  {
    id: '3',
    studentId: 's3',
    studentName: 'Michael Johnson',
    departmentName: 'Library',
    requestDate: '2023-03-13',
    status: 'pending',
  },
];

const recentlyProcessed = [
  {
    id: '4',
    studentId: 's4',
    studentName: 'Emily Davis',
    departmentName: 'Library',
    requestDate: '2023-03-10',
    status: 'approved',
  },
  {
    id: '5',
    studentId: 's5',
    studentName: 'Robert Wilson',
    departmentName: 'Library',
    requestDate: '2023-03-09',
    status: 'rejected',
    comment: 'Books not returned',
  },
];

const departmentStats = {
  pending: 15,
  approved: 42,
  rejected: 8,
};

const DepartmentDashboard: React.FC = () => {
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  
  const handleApprove = (id: string) => {
    // In a real app, this would make an API call
    console.log('Approving request:', id);
    toast.success('Request approved successfully!');
  };
  
  const handleReject = (id: string) => {
    setSelectedRequestId(id);
    setIsRejectDialogOpen(true);
  };
  
  const confirmReject = () => {
    if (!selectedRequestId) return;
    
    // In a real app, this would make an API call
    console.log('Rejecting request:', selectedRequestId, 'Reason:', rejectReason);
    
    toast.success('Request rejected successfully!');
    setIsRejectDialogOpen(false);
    setRejectReason('');
    setSelectedRequestId(null);
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
        <RequestList 
          title="" 
          viewType="department" 
          requests={pendingRequests}
          onApprove={handleApprove}
          onReject={handleReject}
        />
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
