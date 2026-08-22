const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('hostelhub_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data?.error?.message || data?.message || 'An error occurred';
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // If network error (backend down/unreachable), throw structured network error
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      const netErr = new Error('Unable to connect to the server. Please check your connection.');
      netErr.isNetworkError = true;
      throw netErr;
    }
    throw error;
  }
};
