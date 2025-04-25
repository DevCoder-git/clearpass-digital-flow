
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QrCode, Search, CheckCircle, XCircle, FileText, Clipboard, ArrowRight, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import QRVerification from './QRVerification';
import BlockchainVerification from './BlockchainVerification';
import { BlockchainCertificateData } from '@/utils/blockchainVerification';

interface VerificationResult {
  verified: boolean;
  certificateId: string;
  studentName?: string;
  studentId?: string;
  issueDate?: string;
  departments?: string[];
  blockchainData?: BlockchainCertificateData;
}

const CertificateVerifier: React.FC = () => {
  const [certificateId, setCertificateId] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>('manual');
  const [showBlockchainVerification, setShowBlockchainVerification] = useState<boolean>(false);

  const handleManualVerify = () => {
    if (!certificateId.trim()) {
      toast.error('Please enter a certificate ID');
      return;
    }

    setIsVerifying(true);

    // Simulate verification process with a delay
    setTimeout(() => {
      // Mock verification result - in a real app, this would call an API
      const isValid = certificateId.startsWith('CLEAR-') && certificateId.length > 10;
      
      if (isValid) {
        setVerificationResult({
          verified: true,
          certificateId: certificateId,
          studentName: "Jane Smith",
          studentId: "STU-20230584",
          issueDate: "2025-04-12",
          departments: ["Library", "Finance", "Housing", "Academic Affairs"]
        });
        setShowBlockchainVerification(true);
        toast.success('Certificate verified successfully');
      } else {
        setVerificationResult({
          verified: false,
          certificateId: certificateId
        });
        setShowBlockchainVerification(false);
        toast.error('Invalid certificate');
      }
      
      setIsVerifying(false);
    }, 1500);
  };

  const handleQrVerificationComplete = (result: { verified: boolean, certificateId: string }) => {
    if (result.verified) {
      setVerificationResult({
        verified: true,
        certificateId: result.certificateId,
        studentName: "John Doe",
        studentId: "STU-20231042",
        issueDate: "2025-04-10",
        departments: ["Library", "Finance", "Housing", "Academic Affairs", "Sports"]
      });
      setShowBlockchainVerification(true);
    } else {
      setVerificationResult({
        verified: false,
        certificateId: result.certificateId
      });
      setShowBlockchainVerification(false);
    }
    
    setActiveTab('manual');
  };

  const handleBlockchainVerified = (blockchainData: BlockchainCertificateData) => {
    if (verificationResult) {
      setVerificationResult({
        ...verificationResult,
        blockchainData
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Certificate Verification</h1>
          <p className="text-muted-foreground">Verify the authenticity of a clearance certificate</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">
                  <Search className="h-4 w-4 mr-2" />
                  <span>Manual Verification</span>
                </TabsTrigger>
                <TabsTrigger value="qr">
                  <QrCode className="h-4 w-4 mr-2" />
                  <span>QR Code Scanner</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual">
                <Card>
                  <CardHeader className="bg-secondary/20">
                    <CardTitle className="text-lg flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Manual Certificate Verification
                    </CardTitle>
                    <CardDescription>
                      Enter the certificate ID to verify its authenticity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex flex-col space-y-1.5">
                        <label htmlFor="certificateId" className="text-sm font-medium">
                          Certificate ID
                        </label>
                        <div className="flex space-x-2">
                          <Input
                            id="certificateId"
                            placeholder="e.g., CLEAR-2025-00123"
                            value={certificateId}
                            onChange={(e) => setCertificateId(e.target.value)}
                          />
                          <Button 
                            onClick={handleManualVerify} 
                            disabled={isVerifying || !certificateId.trim()}
                          >
                            {isVerifying ? (
                              'Verifying...'
                            ) : (
                              <>
                                <Search className="h-4 w-4 mr-2" />
                                Verify
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          The certificate ID can be found at the bottom of the clearance certificate.
                        </p>
                      </div>

                      <div className="relative h-0.5 bg-secondary/20 my-6">
                        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                          OR
                        </span>
                      </div>

                      <div className="flex justify-center">
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveTab('qr')}
                          className="w-full"
                        >
                          <QrCode className="h-4 w-4 mr-2" />
                          Scan QR Code Instead
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="qr">
                <QRVerification 
                  mode="scan" 
                  onVerificationComplete={handleQrVerificationComplete}
                />
              </TabsContent>
            </Tabs>

            {showBlockchainVerification && verificationResult?.verified && (
              <div className="mt-4">
                <BlockchainVerification
                  certificateId={verificationResult.certificateId}
                  onVerified={handleBlockchainVerified}
                />
              </div>
            )}
          </div>

          <div>
            {verificationResult ? (
              <Card className={`shadow-md ${verificationResult.verified ? 'border-green-200' : 'border-red-200'}`}>
                <CardHeader className={verificationResult.verified ? 'bg-green-50' : 'bg-red-50'}>
                  <div className="flex items-center">
                    {verificationResult.verified ? (
                      <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600 mr-2" />
                    )}
                    <CardTitle className="text-lg">
                      {verificationResult.verified ? 'Valid Certificate' : 'Invalid Certificate'}
                    </CardTitle>
                  </div>
                  <CardDescription>
                    {verificationResult.verified
                      ? 'This certificate has been verified as authentic.'
                      : 'This certificate could not be verified.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {verificationResult.verified ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Certificate ID</h4>
                          <div className="flex items-center mt-1">
                            <p className="font-medium">{verificationResult.certificateId}</p>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 ml-1"
                              onClick={() => copyToClipboard(verificationResult.certificateId)}
                            >
                              <Clipboard className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Issue Date</h4>
                          <p className="font-medium mt-1">{verificationResult.issueDate}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Student Name</h4>
                          <p className="font-medium mt-1">{verificationResult.studentName}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Student ID</h4>
                          <p className="font-medium mt-1">{verificationResult.studentId}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Cleared Departments</h4>
                        <div className="flex flex-wrap gap-2">
                          {verificationResult.departments?.map((dept, index) => (
                            <span 
                              key={index}
                              className="bg-secondary/30 text-xs rounded-full py-1 px-3"
                            >
                              {dept}
                            </span>
                          ))}
                        </div>
                      </div>

                      {verificationResult.blockchainData && (
                        <div className="border border-blue-100 bg-blue-50/30 rounded-md p-3 mt-2">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-4 w-4 text-blue-500" />
                            <h4 className="text-sm font-medium">Blockchain Verified</h4>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <p>Transaction ID: {verificationResult.blockchainData.transactionId.substring(0, 10)}...{verificationResult.blockchainData.transactionId.substring(verificationResult.blockchainData.transactionId.length - 6)}</p>
                            <p>Block: {verificationResult.blockchainData.blockNumber}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-4">
                      <XCircle className="h-12 w-12 text-red-500 mb-2" />
                      <p className="text-center text-muted-foreground">
                        The certificate ID <span className="font-medium">{verificationResult.certificateId}</span> is not valid or does not exist in our system.
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className={`bg-${verificationResult.verified ? 'green' : 'red'}-50/50 flex justify-center pt-2 pb-4`}>
                  {verificationResult.verified ? (
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View Certificate Details
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setCertificateId('')}>
                      Try Another Certificate
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ) : (
              <Card className="shadow-md border-dashed h-full flex flex-col justify-center items-center p-8">
                <div className="text-center space-y-4">
                  <div className="mx-auto bg-secondary/20 rounded-full p-4 h-16 w-16 flex items-center justify-center">
                    <ArrowRight className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">Verification Results</h3>
                  <p className="text-muted-foreground">
                    Enter a certificate ID or scan a QR code to verify a certificate.
                    Results will appear here.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateVerifier;
