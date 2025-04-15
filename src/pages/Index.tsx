import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, ArrowRight, CheckCircle, Clock, XCircle, BookOpen, QrCode } from 'lucide-react';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary-foreground" />
            <h1 className="text-2xl font-bold text-primary-foreground">ClearPass</h1>
          </div>
          <div>
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-b from-primary/10 to-background py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold leading-tight tracking-tighter md:text-6xl">
                Digital No Due <span className="text-primary">Clearance</span> System
              </h1>
              <p className="text-xl text-muted-foreground">
                Streamline your institution's clearance process with our digital solution.
                Say goodbye to paperwork and manual approvals.
              </p>
              <div className="flex gap-4">
                <Link to="/login">
                  <Button size="lg" className="gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -left-4 -top-4 h-72 w-72 rounded-lg bg-primary/10"></div>
                <Card className="relative h-80 w-80 overflow-hidden">
                  <div className="flex h-full w-full items-center justify-center bg-muted p-6">
                    <FileText className="h-20 w-20 text-primary" />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ClearPass is designed to simplify and digitize the no due clearance process
              in educational institutions.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CheckCircle className="h-10 w-10 mb-2 text-clearance-approved" />
                <CardTitle>Easy Application</CardTitle>
                <CardDescription>
                  Students can apply for clearance with just a few clicks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Apply for clearance from multiple departments in one go.
                  Track your clearance status in real-time.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Clock className="h-10 w-10 mb-2 text-clearance-pending" />
                <CardTitle>Real-time Tracking</CardTitle>
                <CardDescription>
                  Get instant updates on your clearance status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Track approval status across departments.
                  Receive notifications when your requests are processed.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <XCircle className="h-10 w-10 mb-2 text-clearance-rejected" />
                <CardTitle>Efficient Processing</CardTitle>
                <CardDescription>
                  Departments can efficiently process clearance requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Department staff can approve or reject requests with comments.
                  Students get immediate feedback on rejected requests.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                Ready to Streamline Your Clearance Process?
              </h2>
              <p className="text-primary-foreground/80">
                Join institutions that have eliminated paperwork and improved efficiency.
              </p>
            </div>
            <Link to="/login">
              <Button size="lg" variant="secondary">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Documentation and Verification Section */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <section className="py-16 bg-secondary/10 rounded-3xl my-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Resources & Verification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-background rounded-xl p-6 shadow-lg flex flex-col items-center text-center">
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Documentation Center</h3>
                <p className="text-muted-foreground mb-6">
                  Access comprehensive guides, tutorials, and FAQs about the ClearPass system.
                </p>
                <Button asChild className="mt-auto">
                  <Link to="/documentation">Browse Documentation</Link>
                </Button>
              </div>
              
              <div className="bg-background rounded-xl p-6 shadow-lg flex flex-col items-center text-center">
                <QrCode className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Certificate Verification</h3>
                <p className="text-muted-foreground mb-6">
                  Verify the authenticity of clearance certificates using QR codes or certificate IDs.
                </p>
                <Button asChild className="mt-auto">
                  <Link to="/verification">Verify Certificate</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-secondary py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <FileText className="h-6 w-6" />
              <span className="text-lg font-semibold">ClearPass</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ClearPass. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
