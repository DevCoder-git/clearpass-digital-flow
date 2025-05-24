
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Shield, Mail, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const { currentUser, role, enableTwoFactor, disableTwoFactor, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(currentUser?.name || '');
  const [editedEmail, setEditedEmail] = useState(currentUser?.email || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileUpdate = async () => {
    if (!editedName.trim() || !editedEmail.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      const success = await updateUserProfile?.(editedName, editedEmail);
      if (success) {
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(currentUser?.name || '');
    setEditedEmail(currentUser?.email || '');
    setIsEditing(false);
  };

  const handleTwoFactorToggle = async () => {
    try {
      if (currentUser?.twoFactorEnabled) {
        await disableTwoFactor();
        toast.success('Two-factor authentication disabled');
      } else {
        await enableTwoFactor();
        toast.success('Two-factor authentication enabled');
      }
    } catch (error) {
      toast.error('Failed to update two-factor authentication');
    }
  };

  const getRoleBadgeVariant = (userRole: string) => {
    switch (userRole) {
      case 'admin':
        return 'destructive';
      case 'department':
        return 'secondary';
      case 'student':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <User className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
      </div>

      {/* Profile Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal information and account details
              </CardDescription>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage 
                src={`https://ui-avatars.com/api/?name=${currentUser?.name}&size=64`} 
                alt={currentUser?.name} 
              />
              <AvatarFallback className="text-lg">
                {currentUser ? getInitials(currentUser.name) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-lg font-medium">{currentUser?.name}</p>
              <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
              <Badge variant={getRoleBadgeVariant(role || '')} className="capitalize">
                {role || 'Unknown'}
              </Badge>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email Address</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleProfileUpdate} 
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                <p className="text-sm mt-1">{currentUser?.name || 'Not set'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                <p className="text-sm mt-1">{currentUser?.email || 'Not set'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                <p className="text-sm mt-1 capitalize">{role || 'Not assigned'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">User ID</Label>
                <p className="text-sm mt-1 font-mono">{currentUser?.id || 'N/A'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Settings</span>
          </CardTitle>
          <CardDescription>
            Manage your account security and authentication preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={currentUser?.twoFactorEnabled || false}
              onCheckedChange={handleTwoFactorToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Role-specific Information */}
      {role && (
        <Card>
          <CardHeader>
            <CardTitle>Role Information</CardTitle>
            <CardDescription>
              Details about your role and permissions in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Role:</span>
                <Badge variant={getRoleBadgeVariant(role)} className="capitalize">
                  {role}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {role === 'admin' && 'You have full administrative access to the system.'}
                {role === 'department' && 'You can manage clearance requests for your department.'}
                {role === 'student' && 'You can submit and track your clearance requests.'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Settings;
