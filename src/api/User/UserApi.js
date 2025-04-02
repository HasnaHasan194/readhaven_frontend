// Get user profile
export const getUserProfile = async () => {
    try {
      const response = await authAxios.get('/user/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  };
  
  // Edit user profile
  export const editProfile = async (profileData) => {
    try {
      const response = await authAxios.patch('/user/profile', profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  };
  
  // Send email verification
  export const sendEmailVerification = async (newEmail) => {
    try {
      const response = await authAxios.post('/user/verify-email/send', { newEmail });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send verification email');
    }
  };
  
  // Verify email with OTP
  export const verifyEmailOtp = async (data) => {
    try {
      const response = await authAxios.post('/user/verify-email/verify', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to verify email');
    }
  };
  
  // Change password
  export const changePassword = async (passwordData) => {
    try {
      const response = await authAxios.post('/user/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  };
  
  // Forgot password
  export const forgotPassword = async (email) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/forgot-password`, { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to process password reset');
    }
  };
  
  // Reset password
  export const resetPassword = async (token, newPassword) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/reset-password`, { token, newPassword });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
  };
  
  // Api/User/ordersApi.js
  import axios from 'axios';
  import { API_BASE_URL } from '../config';

  
  // Get user orders
  export const getUserOrders = async () => {
    try {
      const response = await authAxios.get('/user/orders');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  };
  
  // Cancel order
  export const cancelOrder = async (orderId) => {
    try {
      const response = await authAxios.patch(`/user/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel order');
    }
  };