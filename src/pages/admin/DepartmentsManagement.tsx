
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Department {
  id: string;
  name: string;
  headName: string;
  headEmail: string;
  studentsCount: number;
  pendingRequests: number;
}

const DepartmentsManagement: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 'd1',
      name: 'Library',
      headName: 'Alice Johnson',
      headEmail: 'alice@example.com',
      studentsCount: 150,
      pendingRequests: 12,
    },
    {
      id: 'd2',
      name: 'Accounts Department',
      headName: 'Bob Smith',
      headEmail: 'bob@example.com',
      studentsCount: 200,
      pendingRequests: 8,
    },
    {
      id: 'd3',
      name: 'Hostel',
      headName: 'Carol White',
      headEmail: 'carol@example.com',
      studentsCount: 120,
      pendingRequests: 5,
    },
    {
      id: 'd4',
      name: 'Sports Department',
      headName: 'David Brown',
      headEmail: 'david@example.com',
      studentsCount: 80,
      pendingRequests: 2,
    },
    {
      id: 'd5',
      name: 'Laboratory',
      headName: 'Emma Davis',
      headEmail: 'emma@example.com',
      studentsCount: 75,
      pendingRequests: 10,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [newDepartment, setNewDepartment] = useState<Partial<Department>>({
    name: '',
    headName: '',
    headEmail: '',
  });

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.headName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.headEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setNewDepartment({
      name: '',
      headName: '',
      headEmail: '',
    });
    setDialogOpen(true);
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setNewDepartment({ ...department });
    setDialogOpen(true);
  };

  const handleSaveDepartment = () => {
    if (!newDepartment.name || !newDepartment.headName || !newDepartment.headEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingDepartment) {
      // Update existing department
      setDepartments((prev) =>
        prev.map((dept) =>
          dept.id === editingDepartment.id
            ? {
                ...dept,
                name: newDepartment.name || dept.name,
                headName: newDepartment.headName || dept.headName,
                headEmail: newDepartment.headEmail || dept.headEmail,
              }
            : dept
        )
      );
      toast.success('Department updated successfully');
    } else {
      // Add new department
      const department: Department = {
        id: `d${departments.length + 1}`,
        name: newDepartment.name || '',
        headName: newDepartment.headName || '',
        headEmail: newDepartment.headEmail || '',
        studentsCount: 0,
        pendingRequests: 0,
      };

      setDepartments((prev) => [...prev, department]);
      toast.success('Department added successfully');
    }

    setDialogOpen(false);
  };

  const handleDeleteDepartment = (id: string) => {
    setDepartments((prev) => prev.filter((dept) => dept.id !== id));
    toast.success('Department deleted successfully');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Departments Management</h1>
      
      <div className="flex items-center justify-between">
        <div className="relative max-w-sm">
          <Input
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <Button onClick={handleAddDepartment}>Add Department</Button>
      </div>

      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department Name</TableHead>
                <TableHead>Department Head</TableHead>
                <TableHead>Contact Email</TableHead>
                <TableHead>Students Count</TableHead>
                <TableHead>Pending Requests</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No departments found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDepartments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell>{department.headName}</TableCell>
                    <TableCell>{department.headEmail}</TableCell>
                    <TableCell>{department.studentsCount}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800">
                        {department.pendingRequests} pending
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditDepartment(department)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteDepartment(department.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingDepartment ? 'Edit Department' : 'Add New Department'}
            </DialogTitle>
            <DialogDescription>
              {editingDepartment
                ? 'Update the department details below.'
                : 'Fill in the information for the new department.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Department Name
              </label>
              <Input
                id="name"
                value={newDepartment.name || ''}
                onChange={(e) =>
                  setNewDepartment({ ...newDepartment, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="headName" className="text-right">
                Department Head
              </label>
              <Input
                id="headName"
                value={newDepartment.headName || ''}
                onChange={(e) =>
                  setNewDepartment({ ...newDepartment, headName: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="headEmail" className="text-right">
                Contact Email
              </label>
              <Input
                id="headEmail"
                type="email"
                value={newDepartment.headEmail || ''}
                onChange={(e) =>
                  setNewDepartment({ ...newDepartment, headEmail: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDepartment}>
              {editingDepartment ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentsManagement;
