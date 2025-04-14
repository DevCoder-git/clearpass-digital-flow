
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getClearanceRequests, updateClearanceRequest } from '@/api/clearanceService';
import RequestList from '@/components/clearance/RequestList';
import DashboardCard from '@/components/shared/DashboardCard';
import { ClearanceStatus } from '@/components/shared/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BatchActionsPanel from '@/components/advanced/BatchActionsPanel';
import DocumentUploader from '@/components/advanced/DocumentUploader';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Layers, Filter, X, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import NotificationHandler, { NotificationType } from '@/utils/notificationHandler';

interface RequestData {
  id: string;
  studentId: string;
  studentName: string;
  departmentName: string;
  departmentId: string;
  requestDate: string;
  status: ClearanceStatus;
  comment?: string;
  responseDate?: string;
}

const Requests: React.FC = () => {
  const { role } = useAuth();
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([]);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(null);
  const [filterStatus, setFilterStatus] = useState<ClearanceStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const notificationHandler = NotificationHandler.getInstance();
  
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, this would fetch from the backend
        // For now, we'll use dummy data based on the user's role
        
        // For demo purposes, we're using static data
        const dummyRequests = [
          {
            id: '1',
            studentId: 's1',
            studentName: 'John Doe',
            departmentName: 'Library',
            departmentId: 'd1',
            requestDate: '2023-03-15',
            status: 'approved' as ClearanceStatus,
          },
          {
            id: '2',
            studentId: 's1',
            studentName: 'John Doe',
            departmentName: 'Accounts Department',
            departmentId: 'd2',
            requestDate: '2023-03-15',
            status: 'pending' as ClearanceStatus,
          },
          {
            id: '3',
            studentId: 's1',
            studentName: 'John Doe',
            departmentName: 'Hostel',
            departmentId: 'd3',
            requestDate: '2023-03-15',
            status: 'rejected' as ClearanceStatus,
            comment: 'Outstanding fees need to be cleared'
          },
        ];
        
        if (role === 'admin') {
          // Admins see all requests from multiple students
          setRequests([
            ...dummyRequests,
            {
              id: '4',
              studentId: 's2',
              studentName: 'Jane Smith',
              departmentName: 'Library',
              departmentId: 'd1',
              requestDate: '2023-03-14',
              status: 'approved' as ClearanceStatus,
            },
            {
              id: '5',
              studentId: 's3',
              studentName: 'Michael Johnson',
              departmentName: 'Sports Department',
              departmentId: 'd4',
              requestDate: '2023-03-13',
              status: 'pending' as ClearanceStatus,
            },
            {
              id: '6',
              studentId: 's4',
              studentName: 'Emily Wilson',
              departmentName: 'Library',
              departmentId: 'd1',
              requestDate: '2023-03-12',
              status: 'pending' as ClearanceStatus,
            },
            {
              id: '7',
              studentId: 's5',
              studentName: 'Robert Brown',
              departmentName: 'Accounts Department',
              departmentId: 'd2',
              requestDate: '2023-03-11',
              status: 'pending' as ClearanceStatus,
            },
          ]);
        } else if (role === 'department') {
          // Department heads see requests for their department
          setRequests([
            {
              id: '8',
              studentId: 's1',
              studentName: 'John Doe',
              departmentName: 'Library',
              departmentId: 'd1',
              requestDate: '2023-03-15',
              status: 'pending' as ClearanceStatus,
            },
            {
              id: '9',
              studentId: 's2',
              studentName: 'Jane Smith',
              departmentName: 'Library',
              departmentId: 'd1',
              requestDate: '2023-03-14',
              status: 'pending' as ClearanceStatus,
            },
            {
              id: '10',
              studentId: 's6',
              studentName: 'Alice Johnson',
              departmentName: 'Library',
              departmentId: 'd1',
              requestDate: '2023-03-10',
              status: 'pending' as ClearanceStatus,
            },
            {
              id: '11',
              studentId: 's7',
              studentName: 'David Lee',
              departmentName: 'Library',
              departmentId: 'd1',
              requestDate: '2023-03-09',
              status: 'pending' as ClearanceStatus,
            },
          ]);
        } else {
          // Students see their own requests
          setRequests(dummyRequests);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [role]);
  
  const handleViewDocuments = (request: RequestData) => {
    setSelectedRequest(request);
    setDocumentDialogOpen(true);
  };
  
  const handleSelectRequest = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedRequestIds(prev => [...prev, id]);
    } else {
      setSelectedRequestIds(prev => prev.filter(requestId => requestId !== id));
    }
  };
  
  const handleApproveAll = (ids: string[]) => {
    // In a real implementation, this would call an API
    const updatedRequests = requests.map(request => {
      if (ids.includes(request.id)) {
        // Generate notification
        notificationHandler.addNotification({
          id: `approval-${Date.now()}-${request.id}`,
          type: NotificationType.REQUEST_APPROVED,
          title: "Batch Approval Success",
          message: `Request for ${request.departmentName} has been approved.`,
          timestamp: new Date().toISOString(),
          read: false,
        });
        
        return {
          ...request,
          status: 'approved' as ClearanceStatus,
          responseDate: new Date().toISOString(),
        };
      }
      return request;
    });
    
    setRequests(updatedRequests);
    setSelectedRequestIds([]);
  };
  
  const handleRejectAll = (ids: string[], reason: string) => {
    // In a real implementation, this would call an API
    const updatedRequests = requests.map(request => {
      if (ids.includes(request.id)) {
        // Generate notification
        notificationHandler.addNotification({
          id: `rejection-${Date.now()}-${request.id}`,
          type: NotificationType.REQUEST_REJECTED,
          title: "Batch Rejection Notice",
          message: `Request for ${request.departmentName} has been rejected.`,
          timestamp: new Date().toISOString(),
          read: false,
        });
        
        return {
          ...request,
          status: 'rejected' as ClearanceStatus,
          comment: reason,
          responseDate: new Date().toISOString(),
        };
      }
      return request;
    });
    
    setRequests(updatedRequests);
    setSelectedRequestIds([]);
  };
  
  const handleClearSelection = () => {
    setSelectedRequestIds([]);
  };
  
  const handleApprove = (id: string) => {
    const updatedRequests = requests.map(request => {
      if (request.id === id) {
        // Generate notification
        notificationHandler.addNotification({
          id: `approval-${Date.now()}-${id}`,
          type: NotificationType.REQUEST_APPROVED,
          title: "Clearance Approved",
          message: `Your clearance request for ${request.departmentName} has been approved.`,
          timestamp: new Date().toISOString(),
          read: false,
        });
        
        return {
          ...request,
          status: 'approved' as ClearanceStatus,
          responseDate: new Date().toISOString(),
        };
      }
      return request;
    });
    
    setRequests(updatedRequests);
    toast.success(`Request approved successfully`);
  };
  
  const handleReject = (id: string, reason: string) => {
    const updatedRequests = requests.map(request => {
      if (request.id === id) {
        // Generate notification
        notificationHandler.addNotification({
          id: `rejection-${Date.now()}-${id}`,
          type: NotificationType.REQUEST_REJECTED,
          title: "Clearance Rejected",
          message: `Your clearance request for ${request.departmentName} has been rejected.`,
          timestamp: new Date().toISOString(),
          read: false,
        });
        
        return {
          ...request,
          status: 'rejected' as ClearanceStatus,
          comment: reason,
          responseDate: new Date().toISOString(),
        };
      }
      return request;
    });
    
    setRequests(updatedRequests);
    toast.success(`Request rejected successfully`);
  };
  
  const getFilteredRequests = () => {
    return requests.filter(request => {
      const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
      const matchesSearch = searchTerm === '' || 
        request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.departmentName.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  };
  
  const filteredRequests = getFilteredRequests();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p className="text-center text-lg text-muted-foreground">
          Loading requests...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Clearance Requests</h1>
      </div>
      
      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-2">
          <label htmlFor="status-filter" className="text-sm font-medium">
            Filter by Status
          </label>
          <Select
            value={filterStatus}
            onValueChange={(value) => setFilterStatus(value as ClearanceStatus | 'all')}
          >
            <SelectTrigger className="w-[180px]" id="status-filter">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2 flex-1 max-w-md">
          <label htmlFor="search" className="text-sm font-medium">
            Search
          </label>
          <div className="relative">
            <Input
              id="search"
              placeholder="Search by name or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all" className="flex items-center">
            <Layers className="mr-2 h-4 w-4" />
            All Requests
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Pending
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4" />
            Approved
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center">
            <XCircle className="mr-2 h-4 w-4" />
            Rejected
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <DashboardCard 
            title="All Clearance Requests" 
            description={role === 'student' 
              ? "All your clearance requests"
              : role === 'department'
                ? "Requests pending your approval"
                : "All clearance requests in the system"
            }
          >
            <RequestList 
              requests={filteredRequests} 
              viewType={role || 'student'} 
              onApprove={handleApprove}
              onReject={handleReject}
              selectedIds={selectedRequestIds}
              onSelectRequest={handleSelectRequest}
              onViewDocuments={handleViewDocuments}
            />
          </DashboardCard>
        </TabsContent>
        
        <TabsContent value="pending">
          <DashboardCard 
            title="Pending Requests" 
            description="Clearance requests awaiting action"
          >
            <RequestList 
              requests={filteredRequests.filter(r => r.status === 'pending')} 
              viewType={role || 'student'} 
              onApprove={handleApprove}
              onReject={handleReject}
              selectedIds={selectedRequestIds}
              onSelectRequest={handleSelectRequest}
              onViewDocuments={handleViewDocuments}
            />
          </DashboardCard>
        </TabsContent>
        
        <TabsContent value="approved">
          <DashboardCard 
            title="Approved Requests" 
            description="Successfully approved clearance requests"
          >
            <RequestList 
              requests={filteredRequests.filter(r => r.status === 'approved')} 
              viewType={role || 'student'} 
              onViewDocuments={handleViewDocuments}
            />
          </DashboardCard>
        </TabsContent>
        
        <TabsContent value="rejected">
          <DashboardCard 
            title="Rejected Requests" 
            description="Clearance requests that were rejected"
          >
            <RequestList 
              requests={filteredRequests.filter(r => r.status === 'rejected')} 
              viewType={role || 'student'} 
              onViewDocuments={handleViewDocuments}
            />
          </DashboardCard>
        </TabsContent>
      </Tabs>
      
      {/* Batch Actions Panel */}
      {(role === 'department' || role === 'admin') && (
        <BatchActionsPanel
          selectedIds={selectedRequestIds}
          onApproveAll={handleApproveAll}
          onRejectAll={handleRejectAll}
          onClearSelection={handleClearSelection}
        />
      )}
      
      {/* Document Viewer/Uploader Dialog */}
      <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Supporting Documents
            </DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <span>
                  Request from {selectedRequest.studentName} for {selectedRequest.departmentName}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="py-4">
              <DocumentUploader
                requestId={selectedRequest.id}
                departmentName={selectedRequest.departmentName}
                status={selectedRequest.status}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Requests;
