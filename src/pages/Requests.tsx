
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getClearanceRequests } from '@/api/clearanceService';
import RequestList from '@/components/clearance/RequestList';
import DashboardCard from '@/components/shared/DashboardCard';
import { ClearanceStatus } from '@/components/shared/StatusBadge';

interface RequestData {
  id: string;
  studentId: string;
  studentName: string;
  departmentName: string;
  requestDate: string;
  status: ClearanceStatus;
  comment?: string;
  responseDate?: string;
}

const Requests: React.FC = () => {
  const { role } = useAuth();
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, this would fetch from the backend
        // For now, we'll use dummy data based on the user's role
        const response = await getClearanceRequests();
        
        // For demo purposes, we're using static data
        const dummyRequests = [
          {
            id: '1',
            studentId: 's1',
            studentName: 'John Doe',
            departmentName: 'Library',
            requestDate: '2023-03-15',
            status: 'approved' as ClearanceStatus,
          },
          {
            id: '2',
            studentId: 's1',
            studentName: 'John Doe',
            departmentName: 'Accounts Department',
            requestDate: '2023-03-15',
            status: 'pending' as ClearanceStatus,
          },
          {
            id: '3',
            studentId: 's1',
            studentName: 'John Doe',
            departmentName: 'Hostel',
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
              requestDate: '2023-03-14',
              status: 'approved' as ClearanceStatus,
            },
            {
              id: '5',
              studentId: 's3',
              studentName: 'Michael Johnson',
              departmentName: 'Sports Department',
              requestDate: '2023-03-13',
              status: 'pending' as ClearanceStatus,
            },
          ]);
        } else if (role === 'department') {
          // Department heads see requests for their department
          setRequests([
            {
              id: '6',
              studentId: 's1',
              studentName: 'John Doe',
              departmentName: 'Library',
              requestDate: '2023-03-15',
              status: 'pending' as ClearanceStatus,
            },
            {
              id: '7',
              studentId: 's2',
              studentName: 'Jane Smith',
              departmentName: 'Library',
              requestDate: '2023-03-14',
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
          requests={requests} 
          viewType={role || 'student'} 
        />
      </DashboardCard>
    </div>
  );
};

export default Requests;
