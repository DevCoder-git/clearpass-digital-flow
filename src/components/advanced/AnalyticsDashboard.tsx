
import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardCard from '@/components/shared/DashboardCard';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/advanced/DateRangePicker';
import { addDays, format, subDays } from 'date-fns';

// Mock data for the analytics dashboard
const departmentPerformanceData = [
  { name: 'Library', pending: 5, approved: 42, rejected: 3 },
  { name: 'Hostel', pending: 7, approved: 38, rejected: 0 },
  { name: 'Accounts', pending: 12, approved: 36, rejected: 0 },
  { name: 'Sports', pending: 2, approved: 40, rejected: 0 },
  { name: 'Lab', pending: 10, approved: 35, rejected: 0 },
];

const statusDistributionData = [
  { name: 'Approved', value: 191, color: '#4ade80' }, // Green
  { name: 'Pending', value: 36, color: '#f97316' },   // Orange
  { name: 'Rejected', value: 3, color: '#ef4444' },   // Red
];

const timelineData = Array.from({ length: 30 }, (_, i) => {
  const date = subDays(new Date(), 29 - i);
  return {
    date: format(date, 'MMM d'),
    requests: Math.floor(Math.random() * 10) + 1,
    approvals: Math.floor(Math.random() * 8),
  };
});

const AnalyticsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Clearance Analytics</h2>
        <DateRangePicker 
          dateRange={dateRange} 
          onChange={setDateRange} 
        />
      </div>

      <Tabs defaultValue="departmental">
        <TabsList className="mb-4">
          <TabsTrigger value="departmental">Departmental Performance</TabsTrigger>
          <TabsTrigger value="status">Status Distribution</TabsTrigger>
          <TabsTrigger value="timeline">Timeline Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="departmental">
          <DashboardCard 
            title="Departmental Clearance Performance" 
            description="Comparison of clearance processing across departments"
          >
            <div className="h-[400px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentPerformanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="approved" stackId="a" fill="#4ade80" name="Approved" />
                  <Bar dataKey="pending" stackId="a" fill="#f97316" name="Pending" />
                  <Bar dataKey="rejected" stackId="a" fill="#ef4444" name="Rejected" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </TabsContent>
        
        <TabsContent value="status">
          <DashboardCard 
            title="Clearance Status Distribution" 
            description="Overall status of clearance requests in the system"
          >
            <div className="h-[400px] mt-4 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} requests`, 'Count']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </TabsContent>
        
        <TabsContent value="timeline">
          <DashboardCard 
            title="Clearance Request Timeline" 
            description="Trends in request submissions and approvals over time"
          >
            <div className="h-[400px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={timelineData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="requests" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }}
                    name="New Requests"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="approvals" 
                    stroke="#4ade80" 
                    name="Approvals"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
