
import { User, UserRole } from '@/types/auth';

/**
 * Processes user data from API response or local storage into a standardized User object
 */
export const processUserData = (userData: any): User => {
  return {
    id: userData.id || userData.userId || 'demo-user-id',
    name: userData.name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.username || 'User',
    email: userData.email || 'user@example.com',
    role: userData.role as UserRole || 'student',
    twoFactorEnabled: userData.two_factor_enabled || userData.twoFactorEnabled || false
  };
};

/**
 * Determines user role from email for demo purposes
 */
export const determineUserRoleFromEmail = (email: string): UserRole => {
  console.log('Determining role for email:', email);
  
  if (email.includes('admin_')) {
    console.log('Role determined: admin');
    return 'admin';
  } else if (email.includes('department_')) {
    console.log('Role determined: department');
    return 'department';
  } else if (email.includes('student_')) {
    console.log('Role determined: student');
    return 'student';
  }
  
  console.log('Role determined: student (default)');
  return 'student'; // Default role
};

/**
 * Creates a demo user based on email
 */
export const createDemoUser = (email: string, defaultUser: User): User => {
  const role = determineUserRoleFromEmail(email);
  let name = localStorage.getItem('userName') || 'User';
  
  console.log('Creating demo user with role:', role);
  console.log('User name from localStorage:', name);
  
  // Assign a default name based on role if not provided
  if (!name || name === 'User') {
    if (role === 'student') {
      name = 'Student User';
    } else if (role === 'department') {
      name = 'Department Head';
    } else if (role === 'admin') {
      name = 'System Admin';
    }
  }
  
  const user = {
    ...defaultUser,
    name,
    email,
    role
  };
  
  console.log('Created demo user:', user);
  return user;
};
