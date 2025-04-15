
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Download, Filter, RefreshCw, Calendar } from 'lucide-react';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import DepartmentDashboard from '@/components/dashboard/DepartmentDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import QRVerification from '@/components/verification/QRVerification';
import DocumentManager from '@/components/document/DocumentManager';

// Mock data for charts
const departmentPerformanceData = [
  { name: 'Library', approved: 42, rejected: 8, pending: 5 },
  { name: 'Hostel', approved: 38, rejected: 5, pending: 7 },
  { name: 'Accounts', approved: 36, rejected: 8, pending: 10 },
  { name: 'Sports', approved: 40, rejected: 2, pending: 4 },
  { name: 'Lab', approved: 35, rejected: 7, pending: 10 },
];

const clearanceStatusData = [
  { name: 'Approved', value: 165, color: '#22c55e' },
  { name: 'Pending', value: 35, color: '#f59e0b' },
  { name: 'Rejected', value: 25, color: '#ef4444' },
];

const monthlyTrendsData = [
  { name: 'Jan', requests: 45, approvals: 35 },
  { name: 'Feb', requests: 52, approvals: 45 },
  { name: 'Mar', requests: 48, approvals: 40 },
  { name: 'Apr', requests: 70, approvals: 55 },
  { name: 'May', requests: 95, approvals: 75 },
  { name: 'Jun', requests: 78, approvals: 68 },
];

const Overview: React.FC = () => {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [timeRange, setTimeRange] = useState<string>('month');
  
  // Load the appropriate dashboard based on user role
  const renderRoleDashboard = () => {
    switch (role) {
      case 'admin':
        return <AdminDashboard />;
      case 'department':
        return <DepartmentDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Date Range</span>
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          {renderRoleDashboard()}
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Clearance Status</CardTitle>
                <CardDescription>
                  Distribution of clearance request statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={clearanceStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {clearanceStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Department Performance</CardTitle>
                <CardDescription>
                  Approval rates by department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={departmentPerformanceData}
                      barSize={20}
                      stackOffset="expand"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="approved" stackId="a" fill="#22c55e" name="Approved" />
                      <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" />
                      <Bar dataKey="rejected" stackId="a" fill="#ef4444" name="Rejected" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Monthly Trends</CardTitle>
                    <CardDescription>
                      Clearance requests and approvals over time
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant={timeRange === 'month' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setTimeRange('month')}
                    >
                      Month
                    </Button>
                    <Button 
                      variant={timeRange === 'quarter' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setTimeRange('quarter')}
                    >
                      Quarter
                    </Button>
                    <Button 
                      variant={timeRange === 'year' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setTimeRange('year')}
                    >
                      Year
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyTrendsData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="requests" fill="#3b82f6" name="Total Requests" />
                      <Bar dataKey="approvals" fill="#22c55e" name="Approvals" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="verification" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <QRVerification mode="generate" certificateId="CLEAR-2025-00123" />
            <QRVerification mode="scan" />
          </div>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <DocumentManager 
              requestId="req-123" 
              departmentName="Library" 
              status="pending" 
            />
            <DocumentManager 
              requestId="req-124" 
              departmentName="Accounts Department" 
              status="approved"
              existingDocuments={[
                {
                  id: "doc1",
                  name: "Fee Receipt.pdf",
                  size: 256000,
                  type: "application/pdf",
                  url: "#",
                  uploadDate: new Date().toISOString(),
                  verified: true
                }
              ]}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Overview;
