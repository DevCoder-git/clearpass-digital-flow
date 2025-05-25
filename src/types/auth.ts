
export type UserRole = 'admin' | 'student' | 'department' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  twoFactorEnabled?: boolean;
}

export interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password: string, useTwoFactor?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  enableTwoFactor: () => Promise<boolean>;
  disableTwoFactor: () => Promise<boolean>;
  requiresTwoFactor: boolean;
  completeTwoFactorAuth: (code: string) => Promise<boolean>;
  updateUserProfile?: (name: string, email: string) => Promise<boolean>;
}
