import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/verification" element={<Verification />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<AppLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="overview" element={<Overview />} />
                  <Route path="apply" element={<ClearanceRequest />} />
                  <Route path="requests" element={<Requests />} />
                  <Route path="documentation" element={<Documentation />} />
                  <Route path="verification" element={<Verification />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
