
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClearanceStatus } from '@/components/shared/StatusBadge';

// Department interface
export interface Department {
  id: string;
  name: string;
  description: string;
  head: string;
  userCount: number;
  pendingRequests: number;
  status: 'active' | 'inactive';
}

// User interface
export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'department' | 'admin';
  department: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

// Request interface
export interface ClearanceRequest {
  id: string;
  studentId: string;
  studentName: string;
  departmentName: string;
  requestDate: string;
  status: ClearanceStatus;
  comment?: string;
}

// System statistics interface
export interface SystemStats {
  totalStudents: number;
  totalDepartments: number;
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
}

interface DataContextType {
  departments: Department[];
  users: SystemUser[];
  requests: ClearanceRequest[];
  systemStats: SystemStats;
  updateDepartments: (departments: Department[]) => void;
  addDepartment: (department: Department) => void;
  deleteDepartment: (departmentId: string) => void;
  updateUsers: (users: SystemUser[]) => void;
  addUser: (user: SystemUser) => void;
  deleteUser: (userId: string) => void;
  updateRequests: (requests: ClearanceRequest[]) => void;
  addRequest: (request: ClearanceRequest) => void;
  updateRequestStatus: (requestId: string, status: ClearanceStatus, comment?: string) => void;
  getDepartmentUsers: (departmentName: string) => SystemUser[];
  getDepartmentRequests: (departmentName: string) => ClearanceRequest[];
  refreshStats: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial data
const initialDepartments: Department[] = [
  {
    id: '1',
    name: 'Library',
    description: 'Manages all library resources and clearances',
    head: 'Jane Smith',
    userCount: 45,
    pendingRequests: 8,
    status: 'active'
  },
  {
    id: '2',
    name: 'Accounts Department',
    description: 'Handles financial clearances and fee verification',
    head: 'Dr. Wilson',
    userCount: 32,
    pendingRequests: 12,
    status: 'active'
  },
  {
    id: '3',
    name: 'Hostel',
    description: 'Manages hostel clearances and room allocations',
    head: 'Mr. Brown',
    userCount: 28,
    pendingRequests: 5,
    status: 'active'
  },
  {
    id: '4',
    name: 'Sports Department',
    description: 'Handles sports equipment and facility clearances',
    head: 'Ms. Davis',
    userCount: 18,
    pendingRequests: 3,
    status: 'active'
  },
  {
    id: '5',
    name: 'Computer Science',
    description: 'Manages computer lab and equipment clearances',
    head: 'Dr. Johnson',
    userCount: 52,
    pendingRequests: 7,
    status: 'active'
  },
  {
    id: '6',
    name: 'Academic Office',
    description: 'Handles academic records and transcript clearances',
    head: 'Prof. Anderson',
    userCount: 25,
    pendingRequests: 4,
    status: 'active'
  },
  {
    id: '7',
    name: 'Medical Center',
    description: 'Manages health clearances and medical records',
    head: 'Dr. Roberts',
    userCount: 15,
    pendingRequests: 2,
    status: 'active'
  },
  {
    id: '8',
    name: 'Transport Department',
    description: 'Handles vehicle and transportation clearances',
    head: 'Mr. Thompson',
    userCount: 12,
    pendingRequests: 1,
    status: 'active'
  }
];

const initialUsers: SystemUser[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@university.edu',
    role: 'student',
    department: 'Computer Science',
    status: 'active',
    joinDate: '2023-01-15'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@university.edu',
    role: 'department',
    department: 'Library',
    status: 'active',
    joinDate: '2022-08-20'
  },
  {
    id: '3',
    name: 'Dr. Wilson',
    email: 'wilson@university.edu',
    role: 'department',
    department: 'Accounts Department',
    status: 'active',
    joinDate: '2021-03-10'
  },
  {
    id: '4',
    name: 'Admin User',
    email: 'admin@university.edu',
    role: 'admin',
    department: 'Administration',
    status: 'active',
    joinDate: '2020-01-01'
  }
];

const initialRequests: ClearanceRequest[] = [
  {
    id: '1',
    studentId: 's1',
    studentName: 'John Doe',
    departmentName: 'Library',
    requestDate: new Date().toISOString().split('T')[0],
    status: 'pending',
  },
  {
    id: '2',
    studentId: 's2',
    studentName: 'Jane Miller',
    departmentName: 'Accounts Department',
    requestDate: new Date().toISOString().split('T')[0],
    status: 'approved',
  },
  {
    id: '3',
    studentId: 's3',
    studentName: 'Michael Johnson',
    departmentName: 'Hostel',
    requestDate: new Date().toISOString().split('T')[0],
    status: 'rejected',
    comment: 'Outstanding fees need to be cleared'
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [users, setUsers] = useState<SystemUser[]>(initialUsers);
  const [requests, setRequests] = useState<ClearanceRequest[]>(initialRequests);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalStudents: 0,
    totalDepartments: 8,
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0
  });

  // Calculate and update system statistics whenever data changes
  const refreshStats = () => {
    const totalStudents = users.filter(user => user.role === 'student').length;
    const totalDepartments = departments.length;
    const totalRequests = requests.length;
    const pendingRequests = requests.filter(req => req.status === 'pending').length;
    const approvedRequests = requests.filter(req => req.status === 'approved').length;
    const rejectedRequests = requests.filter(req => req.status === 'rejected').length;

    setSystemStats({
      totalStudents,
      totalDepartments,
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests
    });

    // Update department user counts
    const updatedDepartments = departments.map(dept => ({
      ...dept,
      userCount: users.filter(user => user.department === dept.name).length,
      pendingRequests: requests.filter(req => req.departmentName === dept.name && req.status === 'pending').length
    }));
    
    if (JSON.stringify(updatedDepartments) !== JSON.stringify(departments)) {
      setDepartments(updatedDepartments);
    }
  };

  // Refresh stats whenever data changes
  useEffect(() => {
    refreshStats();
  }, [users, requests, departments]);

  const updateDepartments = (newDepartments: Department[]) => {
    setDepartments(newDepartments);
  };

  const addDepartment = (department: Department) => {
    setDepartments(prev => [...prev, department]);
  };

  const deleteDepartment = (departmentId: string) => {
    setDepartments(prev => prev.filter(dept => dept.id !== departmentId));
  };

  const updateUsers = (newUsers: SystemUser[]) => {
    setUsers(newUsers);
  };

  const addUser = (user: SystemUser) => {
    setUsers(prev => [...prev, user]);
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const updateRequests = (newRequests: ClearanceRequest[]) => {
    setRequests(newRequests);
  };

  const addRequest = (request: ClearanceRequest) => {
    setRequests(prev => [...prev, request]);
  };

  const updateRequestStatus = (requestId: string, status: ClearanceStatus, comment?: string) => {
    setRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status, comment }
          : request
      )
    );
  };

  const getDepartmentUsers = (departmentName: string) => {
    return users.filter(user => user.department === departmentName);
  };

  const getDepartmentRequests = (departmentName: string) => {
    return requests.filter(request => request.departmentName === departmentName);
  };

  const value: DataContextType = {
    departments,
    users,
    requests,
    systemStats,
    updateDepartments,
    addDepartment,
    deleteDepartment,
    updateUsers,
    addUser,
    deleteUser,
    updateRequests,
    addRequest,
    updateRequestStatus,
    getDepartmentUsers,
    getDepartmentRequests,
    refreshStats
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
