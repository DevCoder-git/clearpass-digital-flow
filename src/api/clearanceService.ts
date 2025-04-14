
import api from './authService';

export const getClearanceRequests = async () => {
  try {
    const response = await api.get('/clearance-requests/');
    return response.data;
  } catch (error) {
    console.error('Error fetching clearance requests:', error);
    throw new Error('Failed to fetch clearance requests');
  }
};

export const submitClearanceRequest = async (departmentIds: string[]) => {
  try {
    const requests = departmentIds.map(departmentId => ({
      department: departmentId
    }));
    
    // Submit multiple requests at once
    const responses = await Promise.all(
      requests.map(request => api.post('/clearance-requests/', request))
    );
    
    return responses.map(response => response.data);
  } catch (error) {
    console.error('Error submitting clearance request:', error);
    throw new Error('Failed to submit clearance request');
  }
};

export const updateClearanceRequest = async (requestId: string, data: { status: string, comment?: string }) => {
  try {
    const response = await api.patch(`/clearance-requests/${requestId}/`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating clearance request:', error);
    throw new Error('Failed to update clearance request');
  }
};

export const getDepartments = async () => {
  try {
    const response = await api.get('/departments/');
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw new Error('Failed to fetch departments');
  }
};
