
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowDown, ArrowRight, ArrowUp, Save, Plus, Trash2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'sonner';

// Department interface for workflow configuration
interface Department {
  id: string;
  name: string;
  required: boolean;
  order: number;
  dependsOn: string[];
}

// Mock data for workflow configuration
const initialDepartments: Department[] = [
  { id: '1', name: 'Library', required: true, order: 1, dependsOn: [] },
  { id: '2', name: 'Hostel', required: true, order: 2, dependsOn: [] },
  { id: '3', name: 'Accounts', required: true, order: 3, dependsOn: ['1', '2'] },
  { id: '4', name: 'Sports', required: false, order: 4, dependsOn: [] },
  { id: '5', name: 'Laboratory', required: true, order: 5, dependsOn: ['3'] },
];

interface WorkflowConfigPanelProps {
  onSave?: (departments: Department[], settings: WorkflowSettings) => void;
}

interface WorkflowSettings {
  autoApprovalEnabled: boolean;
  autoApprovalDays: number;
  sequentialApproval: boolean;
  emailNotifications: boolean;
  reminderEnabled: boolean;
  reminderDays: number;
}

const defaultSettings: WorkflowSettings = {
  autoApprovalEnabled: false,
  autoApprovalDays: 7,
  sequentialApproval: true,
  emailNotifications: true,
  reminderEnabled: true,
  reminderDays: 3,
};

const WorkflowConfigPanel: React.FC<WorkflowConfigPanelProps> = ({ onSave }) => {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [settings, setSettings] = useState<WorkflowSettings>(defaultSettings);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(departments);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }));
    
    setDepartments(updatedItems);
  };
  
  const handleToggleRequired = (id: string) => {
    setDepartments(prev => 
      prev.map(dept => 
        dept.id === id ? { ...dept, required: !dept.required } : dept
      )
    );
  };
  
  const handleAddDependency = (deptId: string, dependsOnId: string) => {
    setDepartments(prev => 
      prev.map(dept => {
        if (dept.id === deptId) {
          // Prevent adding itself as a dependency
          if (deptId === dependsOnId) return dept;
          
          // Prevent adding dependencies that would create a cycle
          const dependsOn = dept.dependsOn.includes(dependsOnId) 
            ? dept.dependsOn 
            : [...dept.dependsOn, dependsOnId];
            
          return { ...dept, dependsOn };
        }
        return dept;
      })
    );
  };
  
  const handleRemoveDependency = (deptId: string, dependsOnId: string) => {
    setDepartments(prev => 
      prev.map(dept => {
        if (dept.id === deptId) {
          const dependsOn = dept.dependsOn.filter(id => id !== dependsOnId);
          return { ...dept, dependsOn };
        }
        return dept;
      })
    );
  };
  
  const handleAddNewDepartment = () => {
    if (!newDepartmentName.trim()) {
      toast.error('Please enter a department name');
      return;
    }
    
    const newId = (departments.length + 1).toString();
    const newDept: Department = {
      id: newId,
      name: newDepartmentName,
      required: true,
      order: departments.length + 1,
      dependsOn: [],
    };
    
    setDepartments([...departments, newDept]);
    setNewDepartmentName('');
    toast.success(`Added new department: ${newDepartmentName}`);
  };
  
  const handleRemoveDepartment = (id: string) => {
    // Remove the department
    const updatedDepartments = departments.filter(dept => dept.id !== id);
    
    // Remove any dependencies on this department
    const cleanedDepartments = updatedDepartments.map(dept => ({
      ...dept,
      dependsOn: dept.dependsOn.filter(depId => depId !== id),
    }));
    
    // Update order
    const reorderedDepartments = cleanedDepartments.map((dept, index) => ({
      ...dept,
      order: index + 1,
    }));
    
    setDepartments(reorderedDepartments);
    toast.success('Department removed');
  };
  
  const handleUpdateSetting = <K extends keyof WorkflowSettings>(
    key: K, 
    value: WorkflowSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSaveWorkflow = () => {
    if (onSave) {
      onSave(departments, settings);
    }
    toast.success('Workflow configuration saved');
  };
  
  const getDepartmentById = (id: string) => {
    return departments.find(dept => dept.id === id);
  };
  
  return (
    <Tabs defaultValue="departments">
      <TabsList className="mb-4">
        <TabsTrigger value="departments">Department Flow</TabsTrigger>
        <TabsTrigger value="settings">Workflow Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="departments">
        <Card>
          <CardHeader>
            <CardTitle>Clearance Workflow Configuration</CardTitle>
            <CardDescription>
              Configure the order and dependencies of departments in the clearance process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="new-department">Add New Department</Label>
                <Input
                  id="new-department"
                  placeholder="Department Name"
                  value={newDepartmentName}
                  onChange={(e) => setNewDepartmentName(e.target.value)}
                />
              </div>
              <div className="mt-7">
                <Button onClick={handleAddNewDepartment}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
            
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="departments">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="border rounded-md"
                  >
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Required</TableHead>
                          <TableHead>Dependencies</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {departments.map((dept, index) => (
                          <Draggable
                            key={dept.id}
                            draggableId={dept.id}
                            index={index}
                          >
                            {(provided) => (
                              <TableRow
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="cursor-move"
                              >
                                <TableCell className="font-medium">
                                  {dept.order}
                                </TableCell>
                                <TableCell>{dept.name}</TableCell>
                                <TableCell>
                                  <Switch
                                    checked={dept.required}
                                    onCheckedChange={() => handleToggleRequired(dept.id)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-2">
                                    {dept.dependsOn.map(depId => {
                                      const dependency = getDepartmentById(depId);
                                      return dependency ? (
                                        <div key={depId} className="flex items-center bg-secondary text-secondary-foreground rounded-full px-2 py-1 text-xs">
                                          {dependency.name}
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-4 w-4 ml-1 p-0 hover:bg-transparent"
                                            onClick={() => handleRemoveDependency(dept.id, depId)}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      ) : null;
                                    })}
                                    
                                    {dept.dependsOn.length < departments.length - 1 && (
                                      <Select 
                                        onValueChange={(value) => handleAddDependency(dept.id, value)}
                                      >
                                        <SelectTrigger className="w-[120px] h-7 text-xs">
                                          <SelectValue placeholder="Add dependency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {departments
                                            .filter(d => 
                                              d.id !== dept.id && 
                                              !dept.dependsOn.includes(d.id) &&
                                              d.order < dept.order
                                            )
                                            .map(d => (
                                              <SelectItem key={d.id} value={d.id}>
                                                {d.name}
                                              </SelectItem>
                                            ))
                                          }
                                        </SelectContent>
                                      </Select>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveDepartment(dept.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Workflow Settings</CardTitle>
            <CardDescription>
              Configure automation and notification settings for the clearance process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sequential-approval">Sequential Approval</Label>
                  <p className="text-sm text-muted-foreground">
                    Require departments to approve in order
                  </p>
                </div>
                <Switch
                  id="sequential-approval"
                  checked={settings.sequentialApproval}
                  onCheckedChange={(checked) => 
                    handleUpdateSetting('sequentialApproval', checked)
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-approval">Auto-Approval</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically approve requests after a set time
                  </p>
                </div>
                <Switch
                  id="auto-approval"
                  checked={settings.autoApprovalEnabled}
                  onCheckedChange={(checked) => 
                    handleUpdateSetting('autoApprovalEnabled', checked)
                  }
                />
              </div>
              
              {settings.autoApprovalEnabled && (
                <div className="ml-6 border-l-2 pl-4 pt-2 border-muted">
                  <div className="grid gap-2">
                    <Label htmlFor="auto-days">Auto-Approval Days</Label>
                    <Input
                      id="auto-days"
                      type="number"
                      min={1}
                      max={30}
                      value={settings.autoApprovalDays}
                      onChange={(e) => 
                        handleUpdateSetting('autoApprovalDays', parseInt(e.target.value) || 1)
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of days after which requests are automatically approved
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email notifications for clearance updates
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => 
                    handleUpdateSetting('emailNotifications', checked)
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reminder-enabled">Automatic Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Send reminders for pending clearance requests
                  </p>
                </div>
                <Switch
                  id="reminder-enabled"
                  checked={settings.reminderEnabled}
                  onCheckedChange={(checked) => 
                    handleUpdateSetting('reminderEnabled', checked)
                  }
                />
              </div>
              
              {settings.reminderEnabled && (
                <div className="ml-6 border-l-2 pl-4 pt-2 border-muted">
                  <div className="grid gap-2">
                    <Label htmlFor="reminder-days">Reminder Interval (Days)</Label>
                    <Input
                      id="reminder-days"
                      type="number"
                      min={1}
                      max={14}
                      value={settings.reminderDays}
                      onChange={(e) => 
                        handleUpdateSetting('reminderDays', parseInt(e.target.value) || 1)
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      How often to send reminders for pending requests
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveWorkflow}>
          <Save className="mr-2 h-4 w-4" />
          Save Workflow Configuration
        </Button>
      </div>
    </Tabs>
  );
};

export default WorkflowConfigPanel;
