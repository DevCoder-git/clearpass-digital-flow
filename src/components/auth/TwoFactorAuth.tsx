
import React, { useState, useEffect } from 'react';
import { Loader2, Shield, ShieldCheck, ShieldAlert, KeyRound, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TwoFactorAuthProps {
  onVerified?: () => void;
  onCancel?: () => void;
  email?: string;
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({
  onVerified,
  onCancel,
  email = "user@example.com"
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [method, setMethod] = useState<'email' | 'app'>('email');
  const [timeLeft, setTimeLeft] = useState(60);
  const [hasSentOTP, setHasSentOTP] = useState(false);
  
  // Timer for OTP resend countdown
  useEffect(() => {
    if (!hasSentOTP || timeLeft <= 0) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [hasSentOTP, timeLeft]);
  
  const handleSendOTP = () => {
    setIsLoading(true);
    
    // In a real app, this would call an API to send the OTP
    setTimeout(() => {
      setIsLoading(false);
      setHasSentOTP(true);
      setTimeLeft(60);
      
      toast.success(
        method === 'email'
          ? `Verification code sent to ${email}`
          : 'Please enter the code from your authenticator app'
      );
    }, 1500);
  };
  
  const handleVerify = () => {
    if (otpValue.length < 6) {
      toast.error('Please enter all 6 digits of the verification code');
      return;
    }
    
    setIsLoading(true);
    
    // In a real app, this would verify the OTP with the backend
    setTimeout(() => {
      setIsLoading(false);
      
      // Demo: Simple validation - if OTP has 6 digits, 80% chance of success
      const isValid = otpValue.length === 6 && Math.random() > 0.2;
      
      if (isValid) {
        toast.success('Two-factor authentication verified successfully!');
        if (onVerified) onVerified();
      } else {
        toast.error('Invalid verification code. Please try again.');
        setOtpValue("");
      }
    }, 1500);
  };
  
  const handleResend = () => {
    if (timeLeft > 0) return;
    handleSendOTP();
  };
  
  const obscureEmail = (email: string) => {
    const [username, domain] = email.split('@');
    return `${username.substring(0, 2)}***@${domain}`;
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-primary" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Protect your account with an extra layer of security
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs 
          defaultValue="email" 
          value={method} 
          onValueChange={(value) => setMethod(value as 'email' | 'app')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="email" className="flex items-center justify-center">
              <KeyRound className="h-4 w-4 mr-2" />
              Email OTP
            </TabsTrigger>
            <TabsTrigger value="app" className="flex items-center justify-center">
              <Smartphone className="h-4 w-4 mr-2" />
              Authenticator
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="space-y-4 pt-2">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-6">
                We'll send a verification code to <span className="font-medium">{obscureEmail(email)}</span>
              </p>
              
              {!hasSentOTP ? (
                <Button
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Send Verification Code
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm font-medium mb-2">Enter verification code</p>
                    <InputOTP 
                      maxLength={6}
                      value={otpValue}
                      onChange={setOtpValue}
                      render={({ slots }) => (
                        <InputOTPGroup>
                          {slots.map((slot, i) => (
                            <InputOTPSlot key={i} {...slot} index={i} />
                          ))}
                        </InputOTPGroup>
                      )}
                    />
                  </div>
                  
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={timeLeft > 0}
                      className="text-xs text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
                    >
                      {timeLeft > 0 
                        ? `Resend code in ${timeLeft} seconds` 
                        : 'Resend verification code'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="app" className="space-y-4 pt-2">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-6">
                Enter the code from your authenticator app (Google Authenticator, Authy, etc.)
              </p>
              
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm font-medium mb-2">Enter authenticator code</p>
                  <InputOTP 
                    maxLength={6}
                    value={otpValue}
                    onChange={setOtpValue}
                    render={({ slots }) => (
                      <InputOTPGroup>
                        {slots.map((slot, i) => (
                          <InputOTPSlot key={i} {...slot} index={i} />
                        ))}
                      </InputOTPGroup>
                    )}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleVerify} 
          disabled={isLoading || otpValue.length < 6 || (!hasSentOTP && method === 'email')}
        >
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Verify
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TwoFactorAuth;
