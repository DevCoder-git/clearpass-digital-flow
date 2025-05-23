
import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Overview from "@/pages/Overview";
import Requests from "@/pages/Requests";
import Settings from "@/pages/Settings";
import AppLayout from "@/components/layout/AppLayout";
import ClearanceRequest from "@/components/clearance/ClearanceRequest";
import NotFound from "@/pages/NotFound";
import Documentation from "@/pages/Documentation";
import Verification from "@/pages/Verification";
import ProtectedRoute from "@/components/ProtectedRoute";
import DocumentManager from "@/components/document/DocumentManager";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import StudentDashboard from "@/pages/student/StudentDashboard";

// New imports for admin routes
import UsersManagement from "@/pages/admin/UsersManagement";
import DepartmentsManagement from "@/pages/admin/DepartmentsManagement";

// New import for department dashboard
import DepartmentDashboard from "@/pages/department/DepartmentDashboard";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/verification" element={<Verification />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<AppLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="admin" element={<AdminDashboard />} />
                  <Route path="student" element={<StudentDashboard />} />
                  <Route path="department" element={<DepartmentDashboard />} /> {/* Added department dashboard route */}
                  <Route path="overview" element={<Overview />} />
                  <Route path="apply" element={<ClearanceRequest />} />
                  <Route path="requests" element={<Requests />} />
                  <Route path="documentation" element={<Documentation />} />
                  <Route path="verification" element={<Verification />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="users" element={<UsersManagement />} />
                  <Route path="departments" element={<DepartmentsManagement />} />
                  <Route path="documents" element={
                    <div className="p-8">
                      <h2 className="text-2xl font-bold mb-4">Documents</h2>
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
                    </div>
                  } />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
