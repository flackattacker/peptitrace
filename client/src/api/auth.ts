import api from './api';

// Description: Login user functionality
// Endpoint: POST /api/auth/login
// Request: { email: string, password: string }
// Response: { accessToken: string, refreshToken: string }
export const login = async (email: string, password: string) => {
  console.log("API login called with email:", email);
  try {
    console.log("Making POST request to /api/auth/login");
    const response = await api.post('/api/auth/login', { email, password });
    console.log("Login API response status:", response.status);
    console.log("Login API response data:", response.data);
    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    console.error('Login API error response:', error?.response?.data);
    console.error('Login API error status:', error?.response?.status);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Register user functionality
// Endpoint: POST /api/auth/register
// Request: { email: string, password: string }
// Response: { email: string }
export const register = async (email: string, password: string) => {
  console.log("API register called with email:", email);
  try {
    console.log("Making POST request to /api/auth/register");
    const response = await api.post('/api/auth/register', {email, password});
    console.log("Register API response status:", response.status);
    console.log("Register API response data:", response.data);
    return response.data;
  } catch (error) {
    console.error('Register API error:', error);
    console.error('Register API error response:', error?.response?.data);
    console.error('Register API error status:', error?.response?.status);
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Logout
// Endpoint: POST /api/auth/logout
// Request: {}
// Response: { success: boolean, message: string }
export const logout = async () => {
  console.log("API logout called");
  try {
    console.log("Making POST request to /api/auth/logout");
    const response = await api.post('/api/auth/logout');
    console.log("Logout API response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Logout API error:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
};