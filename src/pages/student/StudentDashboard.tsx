
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import RequestList from '@/components/clearance/RequestList';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const { requests, systemStats } = useData();
  const userName = localStorage.getItem('userName') || currentUser?.name || 'Unknown Student';

  // Filter requests for current student
  const studentRequests = requests.filter(request => 
    request.studentName === userName || request.studentId === currentUser?.id
  );

  // Calculate counts for dashboard stats
  const pendingRequests = studentRequests.filter(r => r.status === 'pending').length;
  const approvedRequests = studentRequests.filter(r => r.status === 'approved').length;
  const rejectedRequests = studentRequests.filter(r => r.status === 'rejected').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {userName}</p>
        </div>
        <Button asChild>
          <Link to="/dashboard/apply">
            <FileText className="mr-2 h-4 w-4" />
            New Clearance Request
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
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
        <Card className="p-4 flex items-center space-x-4">
          <FileText className="h-8 w-8 text-blue-500" />
          <div>
            <h3 className="text-lg font-semibold">{systemStats.totalDepartments}</h3>
            <p className="text-sm text-muted-foreground">Total Departments</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">My Clearance Requests</h2>
        <RequestList 
          requests={studentRequests}
          viewType="student"
        />
        {studentRequests.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No clearance requests found.</p>
            <Button asChild>
              <Link to="/dashboard/apply">
                <FileText className="mr-2 h-4 w-4" />
                Submit Your First Request
              </Link>
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default StudentDashboard;
