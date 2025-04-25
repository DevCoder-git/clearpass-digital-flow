
export const isDevelopment = () => {
  return import.meta.env.DEV;
};

export const shouldUseBackend = () => {
  return import.meta.env.VITE_USE_BACKEND === 'true';
};

// Default values for development without backend
export const defaultUser = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: null as 'student' | 'department' | 'admin' | null,
  twoFactorEnabled: false
};

