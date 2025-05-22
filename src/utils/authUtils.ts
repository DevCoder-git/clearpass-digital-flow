
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
  if (email.includes('student')) {
    return 'student';
  } else if (email.includes('department')) {
    return 'department';
  } else if (email.includes('admin')) {
    return 'admin';
  }
  return 'student'; // Default role
};

/**
 * Creates a demo user based on email
 */
export const createDemoUser = (email: string, defaultUser: User): User => {
  const role = determineUserRoleFromEmail(email);
  let name = localStorage.getItem('userName') || 'User';
  
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
  
  return {
    ...defaultUser,
    name,
    email,
    role
  };
};
