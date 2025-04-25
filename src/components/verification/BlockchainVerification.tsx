
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlockchainCertificateData, verifyCertificateOnBlockchain } from '@/utils/blockchainVerification';
import { Loader2, Shield, Check, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface BlockchainVerificationProps {
  certificateId: string;
  onVerified?: (data: BlockchainCertificateData) => void;
}

const BlockchainVerification: React.FC<BlockchainVerificationProps> = ({ 
  certificateId,
  onVerified
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationData, setVerificationData] = useState<BlockchainCertificateData | null>(null);
  const [activeTab, setActiveTab] = useState<string>('summary');

  const handleVerify = async () => {
    if (isVerifying) return;
    
    setIsVerifying(true);
    try {
      const data = await verifyCertificateOnBlockchain(certificateId);
      setVerificationData(data);
      if (data && onVerified) {
        onVerified(data);
      }
    } catch (error) {
      console.error('Blockchain verification error:', error);
      toast.error('Failed to verify certificate on blockchain');
    } finally {
      setIsVerifying(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <Card className="shadow-md border-blue-100">
      <CardHeader className="bg-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Blockchain Verification</CardTitle>
          </div>
          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
            Decentralized
          </Badge>
        </div>
        <CardDescription>
          Verify the authenticity of this certificate using blockchain technology
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        {!verificationData ? (
          <div className="flex flex-col items-center justify-center py-6">
            {isVerifying ? (
              <>
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
                <p className="text-muted-foreground">Verifying certificate on blockchain...</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This may take a moment as we check multiple blockchain nodes
                </p>
              </>
            ) : (
              <>
                <Shield className="h-12 w-12 text-blue-200 mb-4" />
                <p className="text-center text-muted-foreground max-w-sm">
                  Click the button below to verify this certificate's authenticity
                  using blockchain technology for tamper-proof verification.
                </p>
                <Button 
                  variant="default" 
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={handleVerify}
                >
                  Verify on Blockchain
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="font-medium">Certificate Verified</span>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                Authentic
              </Badge>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="technical">Technical Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Issued To</p>
                    <p className="font-medium">{verificationData.issuedTo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Issued By</p>
                    <p className="font-medium">{verificationData.issuedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Issuance Date</p>
                    <p className="font-medium">{verificationData.issuanceDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Certificate ID</p>
                    <div className="flex items-center gap-1">
                      <p className="font-medium">{verificationData.certificateId}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5"
                        onClick={() => copyToClipboard(verificationData.certificateId, "Certificate ID")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="technical" className="pt-4 space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Transaction Hash</p>
                    <div className="flex items-center gap-1">
                      <p className="font-medium text-sm font-mono truncate">
                        {verificationData.transactionId}
                      </p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 flex-shrink-0"
                        onClick={() => copyToClipboard(verificationData.transactionId, "Transaction hash")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Block Number</p>
                    <p className="font-medium">{verificationData.blockNumber.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Certificate Hash</p>
                    <div className="flex items-center gap-1">
                      <p className="font-medium text-sm font-mono truncate">
                        {verificationData.hash}
                      </p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 flex-shrink-0"
                        onClick={() => copyToClipboard(verificationData.hash, "Certificate hash")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
      
      {verificationData && (
        <CardFooter className="bg-blue-50/50 flex justify-center pt-2 pb-4">
          <Button variant="outline" size="sm" className="gap-1">
            <ExternalLink className="h-3 w-3 mr-1" />
            View on Blockchain Explorer
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default BlockchainVerification;
