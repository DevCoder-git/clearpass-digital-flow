
export type UserRole = 'student' | 'department' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  twoFactorEnabled?: boolean;
}

export interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password: string, useTwoFactor?: boolean) => Promise<void>;
  logout: () => void;
  enableTwoFactor: () => Promise<boolean>;
  disableTwoFactor: () => Promise<boolean>;
  requiresTwoFactor?: boolean;
  completeTwoFactorAuth: (code: string) => Promise<boolean>;
}

