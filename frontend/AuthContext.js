import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set up axios defaults
  const API_URL = 'http://localhost:5000/api';
  
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      setCurrentUser(response.data.user);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      const { token: newToken, user } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setCurrentUser(user);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { token: newToken, user } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setCurrentUser(user);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (googleToken, profile) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/google`, { 
        google_token: googleToken,
        profile
      });
      const { token: newToken, user } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setCurrentUser(user);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Google login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (phoneNumber) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/send-otp`, { phone_number: phoneNumber });
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (verificationData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, verificationData);
      const { token: newToken, user } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setCurrentUser(user);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'OTP verification failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_URL}/users/profile`, userData);
      setCurrentUser(response.data.user);
      return response.data.user;
    } catch (error) {
      setError(error.response?.data?.message || 'Profile update failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    googleLogin,
    sendOtp,
    verifyOtp,
    logout,
    updateProfile,
    isAuthenticated: !!currentUser,
    isPremium: currentUser?.is_premium || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
