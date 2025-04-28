
export const isDevelopment = () => {
  return import.meta.env.DEV;
};

export const shouldUseBackend = () => {
  return import.meta.env.VITE_USE_BACKEND === 'true';
};

export const getApiBaseUrl = () => {
  // In production, use relative URLs (already working properly in our case)
  // In development, can use localhost or other URLs as needed
  return '/api';
};

// Default values for development without backend
export const defaultUser = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: null as 'student' | 'department' | 'admin' | null,
  twoFactorEnabled: false
};
