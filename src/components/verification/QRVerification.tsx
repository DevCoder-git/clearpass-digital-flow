
import React, { useState, useEffect } from 'react';
import { QrCode, Camera, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { generateQRCode } from '@/utils/qrGenerator';
import { toast } from 'sonner';

interface QRVerificationProps {
  certificateId?: string;
  mode?: 'generate' | 'scan';
  onVerificationComplete?: (result: { verified: boolean, certificateId: string }) => void;
}

const QRVerification: React.FC<QRVerificationProps> = ({ 
  certificateId = 'DEMO1234567890',
  mode = 'generate',
  onVerificationComplete
}) => {
  const [qrDataURL, setQrDataURL] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'invalid'>(
    'pending'
  );
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (mode === 'generate' && certificateId) {
      generateQRForCertificate();
    }
  }, [certificateId, mode]);

  const generateQRForCertificate = async () => {
    try {
      setIsGenerating(true);
      // The QR code will contain a verification URL with the certificate ID
      const verificationURL = `https://clearpass.edu/verify/${certificateId}`;
      const dataURL = await generateQRCode(verificationURL);
      setQrDataURL(dataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartScan = () => {
    // In a real app, this would activate a QR scanner
    // For this demo, we'll simulate scanning after a delay
    setIsCameraActive(true);
    setScanResult(null);
    setVerificationStatus('pending');
    
    // Simulate camera scanning for a few seconds
    setTimeout(() => {
      // Simulate successful scan
      const mockResult = `https://clearpass.edu/verify/DEMO${Math.floor(Math.random() * 10000000)}`;
      setScanResult(mockResult);
      
      // Simulate verification
      setTimeout(() => {
        // 80% chance of success for demo purposes
        const isValid = Math.random() > 0.2;
        setVerificationStatus(isValid ? 'verified' : 'invalid');
        
        if (isValid) {
          toast.success('Certificate verified successfully');
          if (onVerificationComplete) {
            onVerificationComplete({
              verified: true,
              certificateId: mockResult.split('/').pop() || ''
            });
          }
        } else {
          toast.error('Invalid certificate');
          if (onVerificationComplete) {
            onVerificationComplete({
              verified: false,
              certificateId: mockResult.split('/').pop() || ''
            });
          }
        }
        
        setIsCameraActive(false);
      }, 1500);
    }, 3000);
  };

  const handleDownload = () => {
    if (qrDataURL) {
      const link = document.createElement('a');
      link.href = qrDataURL;
      link.download = `clearance-qr-${certificateId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR code downloaded successfully');
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-secondary/20">
        <CardTitle className="flex items-center">
          <QrCode className="h-5 w-5 mr-2" />
          {mode === 'generate' ? 'Clearance QR Code' : 'Scan Clearance Certificate'}
        </CardTitle>
        <CardDescription>
          {mode === 'generate'
            ? 'Present this QR code for physical verification'
            : 'Scan a clearance certificate QR code to verify its authenticity'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 p-6">
        {mode === 'generate' && (
          <div className="flex flex-col items-center justify-center">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center p-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Generating QR code...</p>
              </div>
            ) : qrDataURL ? (
              <>
                <div className="border p-4 rounded-lg shadow-sm">
                  <img 
                    src={qrDataURL} 
                    alt="Clearance QR Code" 
                    className="w-64 h-64"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Certificate ID: {certificateId}
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-16">
                <XCircle className="h-8 w-8 text-destructive mb-2" />
                <p className="text-sm text-muted-foreground">Failed to generate QR code</p>
              </div>
            )}
          </div>
        )}
        
        {mode === 'scan' && (
          <div>
            {isCameraActive && !scanResult && (
              <div className="relative border rounded-lg overflow-hidden h-64">
                {/* This would be a camera view in a real app */}
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  <div className="text-white text-center">
                    <Camera className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                    <p>Scanning QR Code...</p>
                    <p className="text-xs mt-1">Position the QR code within the frame</p>
                  </div>
                </div>
                
                {/* Scanner guide overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-2 border-white/80 rounded-lg"></div>
                </div>
              </div>
            )}
            
            {scanResult && (
              <Alert
                variant={verificationStatus === 'verified' ? 'default' : 'destructive'}
                className={
                  verificationStatus === 'verified' 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : undefined
                }
              >
                <div className="flex items-start">
                  {verificationStatus === 'verified' ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive mt-0.5 mr-2" />
                  )}
                  <div>
                    <AlertTitle>
                      {verificationStatus === 'verified'
                        ? 'Certificate Verified'
                        : 'Verification Failed'}
                    </AlertTitle>
                    <AlertDescription className="text-sm">
                      {verificationStatus === 'verified'
                        ? 'This clearance certificate is valid and authentic.'
                        : 'This QR code does not match any valid clearance certificate.'}
                    </AlertDescription>
                    {verificationStatus === 'verified' && (
                      <p className="text-xs mt-2">
                        Certificate URL: {scanResult}
                      </p>
                    )}
                  </div>
                </div>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="justify-center pt-2 pb-4">
        {mode === 'generate' ? (
          <Button onClick={handleDownload} disabled={!qrDataURL || isGenerating}>
            Download QR Code
          </Button>
        ) : (
          <Button
            onClick={handleStartScan}
            disabled={isCameraActive}
          >
            <Camera className="mr-2 h-4 w-4" />
            {verificationStatus !== 'pending' ? 'Scan Again' : 'Start Scanning'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QRVerification;
