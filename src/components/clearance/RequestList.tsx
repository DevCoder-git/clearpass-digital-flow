
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileDown, 
  Eye, 
  FileText,
  Download,
  ArrowDownToLine
} from 'lucide-react';
import StatusBadge, { ClearanceStatus } from '@/components/shared/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { generateClearanceCertificate } from '@/utils/certificateGenerator';

interface ClearanceRequest {
  id: string;
  studentId: string;
  studentName: string;
  departmentName: string;
  requestDate: string;
  status: ClearanceStatus;
  comment?: string;
}

interface RequestListProps {
  title?: string;
  viewType?: 'student' | 'department' | 'admin';
  requests: ClearanceRequest[];
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
  selectedIds?: string[];
  onSelectRequest?: (id: string, selected: boolean) => void;
  onViewDocuments?: (request: ClearanceRequest) => void;
}

const RequestList: React.FC<RequestListProps> = ({ 
  title = 'Clearance Requests',
  viewType = 'student',
  requests, 
  onApprove, 
  onReject,
  selectedIds = [],
  onSelectRequest,
  onViewDocuments
}) => {
  const { role } = useAuth();
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [selectAll, setSelectAll] = useState(false);
  
  const handleDownload = async (request: ClearanceRequest) => {
    // In a real app, this would download the certificate from the server
    // Here we'll generate it on the client side
    try {
      toast.loading('Generating certificate...');
      
      const certificateData = {
        studentName: request.studentName,
        studentId: request.studentId,
        completionDate: new Date().toISOString(),
        certificateId: `CERT-${request.id}`,
      };
      
      const pdfBlob = await generateClearanceCertificate(certificateData);
      
      // Create a download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clearance_certificate_${request.studentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.dismiss();
      toast.success('Certificate downloaded successfully');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to generate certificate');
      console.error('Error generating certificate:', error);
    }
  };
  
  const handleViewDetails = (id: string) => {
    // In a real app, this would navigate to a details page
    toast.info(`Viewing details for request ${id}`);
  };
  
  const handleReject = (id: string) => {
    setSelectedRequestId(id);
    setIsRejectDialogOpen(true);
  };
  
  const confirmReject = () => {
    if (!selectedRequestId) return;
    
    if (onReject) {
      onReject(selectedRequestId, rejectReason);
    }
    
    setIsRejectDialogOpen(false);
    setRejectReason('');
    setSelectedRequestId(null);
  };
  
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    
    if (onSelectRequest) {
      requests.forEach(request => {
        if (request.status === 'pending') {
          onSelectRequest(request.id, checked);
        }
      });
    }
  };
  
  const canApproveOrReject = viewType === 'department' && role === 'department';
  const showDepartmentColumn = viewType !== 'department';
  const showStudentColumn = viewType !== 'student';
  const enableBatchSelection = Boolean(onSelectRequest) && (viewType === 'department' || viewType === 'admin');
  
  return (
    <div className="w-full">
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {enableBatchSelection && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              {showStudentColumn && <TableHead>Student</TableHead>}
              {showDepartmentColumn && <TableHead>Department</TableHead>}
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={
                    5 - 
                    (!showStudentColumn ? 1 : 0) - 
                    (!showDepartmentColumn ? 1 : 0) +
                    (enableBatchSelection ? 1 : 0)
                  } 
                  className="h-24 text-center"
                >
                  No requests found.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id}>
                  {enableBatchSelection && (
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(request.id)}
                        onCheckedChange={(checked) => 
                          onSelectRequest && onSelectRequest(request.id, checked === true)
                        }
                        disabled={request.status !== 'pending'}
                        aria-label={`Select request ${request.id}`}
                      />
                    </TableCell>
                  )}
                  {showStudentColumn && <TableCell>{request.studentName}</TableCell>}
                  {showDepartmentColumn && <TableCell>{request.departmentName}</TableCell>}
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>
                    <StatusBadge status={request.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleViewDetails(request.id)}
                            >
                              <Eye size={16} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      {onViewDocuments && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => onViewDocuments(request)}
                              >
                                <FileText size={16} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Documents</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      {request.status === 'approved' && viewType === 'student' && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDownload(request)}
                              >
                                <ArrowDownToLine size={16} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Download Certificate</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      {canApproveOrReject && request.status === 'pending' && (
                        <>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="text-clearance-approved hover:text-clearance-approved/80"
                                  onClick={() => onApprove && onApprove(request.id)}
                                >
                                  <CheckCircle size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Approve Request</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="text-clearance-rejected hover:text-clearance-rejected/80"
                                  onClick={() => handleReject(request.id)}
                                >
                                  <XCircle size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Reject Request</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
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

export default RequestList;
