
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Download, ExternalLink, BookOpen, Search, HelpCircle, Video } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DocumentationHub: React.FC = () => {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('guides');

  const documentationItems = [
    {
      title: "Getting Started Guide",
      description: "Learn the basics of using the ClearPass system.",
      type: "PDF",
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      link: "#",
      forRoles: ["student", "department", "admin"],
    },
    {
      title: "Student User Manual",
      description: "Comprehensive guide for students on applying for clearance.",
      type: "PDF",
      icon: <FileText className="h-8 w-8 text-primary" />,
      link: "#",
      forRoles: ["student", "admin"],
    },
    {
      title: "Department Processing Guide",
      description: "How to review and process clearance applications.",
      type: "PDF",
      icon: <FileText className="h-8 w-8 text-primary" />,
      link: "#",
      forRoles: ["department", "admin"],
    },
    {
      title: "Administrator Manual",
      description: "System administration and configuration guide.",
      type: "PDF",
      icon: <FileText className="h-8 w-8 text-primary" />,
      link: "#",
      forRoles: ["admin"],
    },
    {
      title: "QR Code Verification Guide",
      description: "How to verify digital certificates using QR codes.",
      type: "PDF",
      icon: <FileText className="h-8 w-8 text-primary" />,
      link: "#",
      forRoles: ["student", "department", "admin"],
    }
  ];

  const videoTutorials = [
    {
      title: "Introduction to ClearPass",
      description: "Overview of the digital clearance system.",
      duration: "3:45",
      icon: <Video className="h-8 w-8 text-primary" />,
      link: "#",
      forRoles: ["student", "department", "admin"],
    },
    {
      title: "Applying for Clearance",
      description: "Step-by-step guide for students.",
      duration: "5:20",
      icon: <Video className="h-8 w-8 text-primary" />,
      link: "#",
      forRoles: ["student", "admin"],
    },
    {
      title: "Processing Applications",
      description: "For department officials reviewing applications.",
      duration: "4:10",
      icon: <Video className="h-8 w-8 text-primary" />,
      link: "#",
      forRoles: ["department", "admin"],
    }
  ];

  const faqs = [
    {
      question: "How do I apply for clearance?",
      answer: "Navigate to the Dashboard, click on 'Apply for Clearance', select the departments you need clearance from, and submit your application.",
      forRoles: ["student"],
    },
    {
      question: "How long does the clearance process take?",
      answer: "Typically, the clearance process takes 2-3 business days, but it may vary depending on the number of departments involved and the volume of applications.",
      forRoles: ["student", "department", "admin"],
    },
    {
      question: "What documents do I need to submit?",
      answer: "Required documents vary by department. The system will display the specific requirements for each department when you apply.",
      forRoles: ["student"],
    },
    {
      question: "How do I verify a certificate?",
      answer: "Use the 'Verification' tab in the dashboard to scan the QR code on a certificate or enter the certificate ID manually.",
      forRoles: ["student", "department", "admin"],
    },
    {
      question: "Can I approve applications in bulk?",
      answer: "Yes, department officials can select multiple applications and approve them simultaneously using the 'Batch Actions' feature.",
      forRoles: ["department", "admin"],
    }
  ];

  const filteredDocuments = documentationItems.filter(item => 
    item.forRoles.includes(role || "")
  );

  const filteredVideos = videoTutorials.filter(item => 
    item.forRoles.includes(role || "")
  );

  const filteredFaqs = faqs.filter(item => 
    item.forRoles.includes(role || "")
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Documentation & Help</h1>
          <p className="text-muted-foreground">Resources to help you use ClearPass effectively</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search documentation..." 
              className="pl-10 pr-4 py-2 rounded-full border w-full md:w-64"
            />
          </div>
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="guides">Guides & Manuals</TabsTrigger>
          <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="guides" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="bg-secondary/20 pb-2">
                  <div className="flex justify-center mb-2">
                    {doc.icon}
                  </div>
                  <CardTitle className="text-lg text-center">{doc.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardDescription className="text-center mb-4">
                    {doc.description}
                  </CardDescription>
                  <div className="flex justify-center">
                    <span className="text-xs px-2 py-1 bg-secondary/30 rounded-full">
                      {doc.type} Document
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center gap-2 pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="videos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map((video, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-secondary/30 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-primary/90 p-3 shadow-lg">
                      <Video className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{video.title}</CardTitle>
                  <CardDescription>{video.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between pt-0">
                  <span className="text-sm text-muted-foreground">
                    Duration: {video.duration}
                  </span>
                  <Button size="sm">
                    Watch Video
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="faqs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Common questions and answers about using ClearPass
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-secondary/5 transition-colors">
                      <h3 className="text-lg font-medium flex items-start">
                        <HelpCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                        <span>{faq.question}</span>
                      </h3>
                      <p className="mt-2 text-muted-foreground pl-7">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Can't find what you're looking for? Contact support at support@clearpass.edu
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentationHub;
