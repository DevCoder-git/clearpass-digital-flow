
import React, { useState } from 'react';
import { Users, Check, X, UserPlus } from 'lucide-react';
import DashboardCard from '@/components/shared/DashboardCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  canApproveApplications: boolean;
  joinDate: string;
}

const mockStaffMembers: StaffMember[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    canApproveApplications: true,
    joinDate: '2023-01-15',
  },
  {
    id: '2',
    name: 'Prof. Michael Brown',
    email: 'michael.brown@university.edu',
    canApproveApplications: false,
    joinDate: '2023-02-20',
  },
  {
    id: '3',
    name: 'Dr. Emily Davis',
    email: 'emily.davis@university.edu',
    canApproveApplications: true,
    joinDate: '2023-03-10',
  },
];

const StaffManagement: React.FC = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(mockStaffMembers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');

  const toggleApprovalPermission = (staffId: string) => {
    setStaffMembers(prev => 
      prev.map(staff => 
        staff.id === staffId 
          ? { ...staff, canApproveApplications: !staff.canApproveApplications }
          : staff
      )
    );
    
    const staff = staffMembers.find(s => s.id === staffId);
    const action = staff?.canApproveApplications ? 'removed' : 'granted';
    toast.success(`Approval permission ${action} for ${staff?.name}`);
  };

  const addNewStaff = () => {
    if (!newStaffName.trim() || !newStaffEmail.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const newStaff: StaffMember = {
      id: (staffMembers.length + 1).toString(),
      name: newStaffName,
      email: newStaffEmail,
      canApproveApplications: false,
      joinDate: new Date().toISOString().split('T')[0],
    };

    setStaffMembers(prev => [...prev, newStaff]);
    setNewStaffName('');
    setNewStaffEmail('');
    setIsAddDialogOpen(false);
    toast.success(`Staff member ${newStaffName} added successfully`);
  };

  const authorizedStaffCount = staffMembers.filter(staff => staff.canApproveApplications).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <DashboardCard 
          title="Total Staff" 
          description="Department staff members"
        >
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold">{staffMembers.length}</div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Authorized Staff" 
          description="Can approve applications"
        >
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold">{authorizedStaffCount}</div>
            <Check className="h-8 w-8 text-green-500" />
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Pending Authorization" 
          description="Staff awaiting approval rights"
        >
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold">{staffMembers.length - authorizedStaffCount}</div>
            <X className="h-8 w-8 text-orange-500" />
          </div>
        </DashboardCard>
      </div>
      
      <DashboardCard 
        title="Department Staff Members" 
        description="Manage staff permissions for no-due application approvals"
      >
        <div className="space-y-4">
          {staffMembers.map((staff) => (
            <div key={staff.id} className="p-4 border rounded-md bg-background">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h3 className="font-medium">{staff.name}</h3>
                  <div className="text-sm text-muted-foreground">
                    {staff.email} • Joined {staff.joinDate}
                  </div>
                  <div className="text-sm">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                      staff.canApproveApplications 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {staff.canApproveApplications ? 'Can Approve Applications' : 'No Approval Rights'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant={staff.canApproveApplications ? "destructive" : "default"}
                    onClick={() => toggleApprovalPermission(staff.id)}
                  >
                    {staff.canApproveApplications ? (
                      <>
                        <X className="h-4 w-4 mr-1" />
                        Remove Permission
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Grant Permission
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {staffMembers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No staff members found. Add staff members to manage their permissions.
            </div>
          )}
        </div>
      </DashboardCard>

      {/* Add Staff Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
            <DialogDescription>
              Add a new staff member to your department. You can grant them approval permissions later.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter staff member's full name"
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter staff member's email"
                value={newStaffEmail}
                onChange={(e) => setNewStaffEmail(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addNewStaff}>
              Add Staff Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffManagement;
