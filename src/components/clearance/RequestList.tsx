
import React from 'react';
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
import { CheckCircle, XCircle, AlertCircle, FileDown, Eye } from 'lucide-react';
import StatusBadge, { ClearanceStatus } from '@/components/shared/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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
  onReject?: (id: string) => void;
}

const RequestList: React.FC<RequestListProps> = ({ 
  title = 'Clearance Requests',
  viewType = 'student',
  requests, 
  onApprove, 
  onReject 
}) => {
  const { role } = useAuth();
  
  const handleDownload = (id: string) => {
    // In a real app, this would download the certificate
    toast.success('Certificate downloaded successfully');
  };
  
  const handleViewDetails = (id: string) => {
    // In a real app, this would navigate to a details page
    toast.info(`Viewing details for request ${id}`);
  };
  
  const canApproveOrReject = viewType === 'department' && role === 'department';
  const showDepartmentColumn = viewType !== 'department';
  const showStudentColumn = viewType !== 'student';
  
  return (
    <div className="w-full">
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
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
                    (!showDepartmentColumn ? 1 : 0)
                  } 
                  className="h-24 text-center"
                >
                  No requests found.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id}>
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
                      
                      {request.status === 'approved' && viewType === 'student' && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDownload(request.id)}
                              >
                                <FileDown size={16} />
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
                                  onClick={() => onReject && onReject(request.id)}
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
    </div>
  );
};

export default RequestList;
