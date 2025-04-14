
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import WorkflowConfigPanel from '@/components/advanced/WorkflowConfigPanel';
import MobileQRScanner from '@/components/advanced/MobileQRScanner';
import { ReminderConfig } from '@/utils/reminderService';
import NotificationHandler from '@/utils/notificationHandler';
import ReminderService from '@/utils/reminderService';
import { 
  Settings as SettingsIcon, 
  Bell, 
  UserCircle, 
  Shield, 
  Wrench, 
  BellRing, 
  QrCode,
  FileText,
  Clock,
  Workflow,
} from 'lucide-react';

const Settings: React.FC = () => {
  const { currentUser, role } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Profile state
  const [firstName, setFirstName] = useState(currentUser?.name.split(' ')[0] || '');
  const [lastName, setLastName] = useState(currentUser?.name.split(' ')[1] || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  
  // Reminder settings
  const [reminderConfig, setReminderConfig] = useState<ReminderConfig>({
    enabled: true,
    studentReminders: true,
    departmentReminders: true,
    reminderInterval: 3
  });
  
  // Security settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Digital features
  const [certificateEnabled, setCertificateEnabled] = useState(true);
  const [qrVerification, setQrVerification] = useState(true);
  
  useEffect(() => {
    // Load reminder configuration
    const reminderService = ReminderService.getInstance();
    setReminderConfig(reminderService.getConfig());
  }, []);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Profile updated successfully');
    }, 1000);
  };
  
  const handleNotificationUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Update notification settings
    setTimeout(() => {
      setLoading(false);
      toast.success('Notification preferences updated');
    }, 1000);
  };
  
  const handleReminderUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Update reminder settings
    const reminderService = ReminderService.getInstance();
    reminderService.updateConfig(reminderConfig);
    
    // Start or stop the service based on the enabled setting
    if (reminderConfig.enabled) {
      reminderService.startReminderService();
    } else {
      reminderService.stopReminderService();
    }
    
    setTimeout(() => {
      setLoading(false);
      toast.success('Reminder settings updated');
    }, 1000);
  };
  
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated successfully');
    }, 1000);
  };
  
  const handleDigitalFeaturesUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Digital features settings updated');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-6">
          <TabsTrigger value="profile" className="flex items-center">
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="reminders" className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span>Reminders</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="digital" className="flex items-center">
            <QrCode className="mr-2 h-4 w-4" />
            <span>Digital Features</span>
          </TabsTrigger>
          {role === 'admin' && (
            <TabsTrigger value="system" className="flex items-center">
              <Wrench className="mr-2 h-4 w-4" />
              <span>System</span>
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Student'}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground">
                    Your role cannot be changed. Contact an administrator if this is incorrect.
                  </p>
                </div>
                
                <CardFooter className="px-0 pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationUpdate} className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications about clearance updates
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications in your browser
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="in-app-notifications">In-App Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Show notifications within the application
                      </p>
                    </div>
                    <Switch
                      id="in-app-notifications"
                      checked={inAppNotifications}
                      onCheckedChange={setInAppNotifications}
                    />
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="notification-types">
                      <AccordionTrigger>Notification Types</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Status Change Notifications</Label>
                              <p className="text-sm text-muted-foreground">
                                Notify when clearance request status changes
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Comment Notifications</Label>
                              <p className="text-sm text-muted-foreground">
                                Notify when comments are added to requests
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>System Notifications</Label>
                              <p className="text-sm text-muted-foreground">
                                Updates about system maintenance and changes
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                
                <CardFooter className="px-0 pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reminders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BellRing className="mr-2 h-5 w-5" />
                Reminder Settings
              </CardTitle>
              <CardDescription>
                Configure automated reminders for clearance requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReminderUpdate} className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reminder-enabled">Enable Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Send automated reminders for pending clearance requests
                      </p>
                    </div>
                    <Switch
                      id="reminder-enabled"
                      checked={reminderConfig.enabled}
                      onCheckedChange={(checked) => 
                        setReminderConfig(prev => ({ ...prev, enabled: checked }))
                      }
                    />
                  </div>
                  
                  {reminderConfig.enabled && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="student-reminders">Student Reminders</Label>
                          <p className="text-sm text-muted-foreground">
                            Send reminders to students about pending requests
                          </p>
                        </div>
                        <Switch
                          id="student-reminders"
                          checked={reminderConfig.studentReminders}
                          onCheckedChange={(checked) => 
                            setReminderConfig(prev => ({ ...prev, studentReminders: checked }))
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="department-reminders">Department Reminders</Label>
                          <p className="text-sm text-muted-foreground">
                            Send reminders to departments about pending approvals
                          </p>
                        </div>
                        <Switch
                          id="department-reminders"
                          checked={reminderConfig.departmentReminders}
                          onCheckedChange={(checked) => 
                            setReminderConfig(prev => ({ ...prev, departmentReminders: checked }))
                          }
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="reminder-interval">Reminder Interval (Days)</Label>
                        <Input
                          id="reminder-interval"
                          type="number"
                          min={1}
                          max={14}
                          value={reminderConfig.reminderInterval}
                          onChange={(e) => 
                            setReminderConfig(prev => ({ 
                              ...prev, 
                              reminderInterval: parseInt(e.target.value) || 3 
                            }))
                          }
                        />
                        <p className="text-sm text-muted-foreground">
                          How often to send reminders (in days)
                        </p>
                      </div>
                    </>
                  )}
                </div>
                
                <CardFooter className="px-0 pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Reminder Settings'}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Update your password and manage security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                </div>
                
                <CardFooter className="px-0 pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="digital" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Digital Features</CardTitle>
              <CardDescription>
                Configure digital certificate and verification settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDigitalFeaturesUpdate} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="certificate-enabled">Digital Certificates</Label>
                      <p className="text-sm text-muted-foreground">
                        Generate digital certificates upon clearance completion
                      </p>
                    </div>
                    <Switch
                      id="certificate-enabled"
                      checked={certificateEnabled}
                      onCheckedChange={setCertificateEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="qr-verification">QR Code Verification</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable QR codes for physical verification
                      </p>
                    </div>
                    <Switch
                      id="qr-verification"
                      checked={qrVerification}
                      onCheckedChange={setQrVerification}
                    />
                  </div>
                </div>
                
                {qrVerification && (
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-4">QR Code Preview</h3>
                    <MobileQRScanner 
                      certificateId="DEMO1234567890"
                      mode="generate"
                    />
                  </div>
                )}
                
                <CardFooter className="px-0 pt-6">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Digital Settings'}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {role === 'admin' && (
          <TabsContent value="system" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>
                    Configure system-wide settings (admin only)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Temporarily disable access for non-admin users
                        </p>
                      </div>
                      <Switch
                        id="maintenance-mode"
                        checked={false}
                        onCheckedChange={() => toast.info('This would enable maintenance mode')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="system-email">System Email</Label>
                      <Input
                        id="system-email"
                        type="email"
                        defaultValue="system@clearpass.edu"
                        placeholder="System notification email"
                      />
                      <p className="text-sm text-muted-foreground">
                        Email address used for system notifications
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => toast.success('System settings saved')}>
                    Save System Settings
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Workflow className="mr-2 h-5 w-5" />
                    Workflow Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure the clearance workflow and approval process
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <WorkflowConfigPanel 
                    onSave={() => toast.success('Workflow configuration saved')}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Settings;
