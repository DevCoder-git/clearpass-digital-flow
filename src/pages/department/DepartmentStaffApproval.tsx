
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  position: string;
  approved: boolean;
  avatar?: string;
}

// Demo staff data
const initialStaffData: StaffMember[] = [
  { id: 'staff1', name: 'John Smith', email: 'john.smith@example.com', position: 'Senior Lecturer', approved: true, avatar: 'JS' },
  { id: 'staff2', name: 'Emily Johnson', email: 'e.johnson@example.com', position: 'Assistant Professor', approved: true, avatar: 'EJ' },
  { id: 'staff3', name: 'Robert Davis', email: 'r.davis@example.com', position: 'Lab Technician', approved: false, avatar: 'RD' },
  { id: 'staff4', name: 'Sarah Wilson', email: 's.wilson@example.com', position: 'Junior Lecturer', approved: false, avatar: 'SW' },
  { id: 'staff5', name: 'Michael Brown', email: 'm.brown@example.com', position: 'Teaching Assistant', approved: false, avatar: 'MB' },
];

export default function DepartmentStaffApproval() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(initialStaffData);
  
  const toggleStaffApproval = (id: string) => {
    setStaffMembers(staff => 
      staff.map(member => 
        member.id === id 
          ? { ...member, approved: !member.approved } 
          : member
      )
    );
    
    const member = staffMembers.find(s => s.id === id);
    if (member) {
      toast.success(`${member.name} approval status updated`, {
        description: member.approved ? 'Staff member can no longer approve clearances' : 'Staff member can now approve clearances'
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Staff Approval Management</CardTitle>
          <CardDescription>
            Control which staff members can approve student clearance requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Department heads must approve staff members before they can process student clearance requests. 
                Toggle the switch to grant or revoke approval privileges.</p>
            </div>
            
            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Staff Member</th>
                    <th className="text-left p-3 font-medium">Position</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-center p-3 font-medium">Approval Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {staffMembers.map(staff => (
                    <tr key={staff.id}>
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${staff.name}`} />
                            <AvatarFallback>{staff.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{staff.name}</p>
                            <p className="text-xs text-muted-foreground">{staff.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">{staff.position}</td>
                      <td className="p-3">
                        <Badge variant={staff.approved ? "success" : "secondary"}>
                          {staff.approved ? "Approved" : "Not Approved"}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center">
                          <Switch 
                            id={`approve-${staff.id}`}
                            checked={staff.approved}
                            onCheckedChange={() => toggleStaffApproval(staff.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Staff Approval Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-md p-4 bg-muted/30">
                <h3 className="font-medium mb-2">1. Staff Registration</h3>
                <p className="text-sm text-muted-foreground">New staff members register in the system</p>
              </div>
              <div className="border rounded-md p-4 bg-muted/30">
                <h3 className="font-medium mb-2">2. Department Head Approval</h3>
                <p className="text-sm text-muted-foreground">Department head approves staff for clearance duties</p>
              </div>
              <div className="border rounded-md p-4 bg-muted/30">
                <h3 className="font-medium mb-2">3. Student Request Processing</h3>
                <p className="text-sm text-muted-foreground">Approved staff can process student requests</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Add New Staff</Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
