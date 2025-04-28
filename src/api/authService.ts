
import axios from 'axios';

// Use relative URLs instead of hardcoded localhost URLs
const API_URL = '/api';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for session cookies
});

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login/', { email, password });
    return response.data;
  } catch (error) {
    console.error('API login error:', error);
    throw new Error('Authentication failed');
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout/');
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Logout failed');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me/');
    return response.data;
  } catch (error) {
    return null;
  }
};

export default api;
