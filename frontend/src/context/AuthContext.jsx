import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userService from '../api/userService';
import { LoadingContext } from './LoadingContext';
import { ModalContext } from './ModalContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const { setIsLoading } = useContext(LoadingContext);
  const { openModal } = useContext(ModalContext);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setUserToken(token);
        await fetchUserInfo();
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getUserInfo();
      setUserInfo(data);
    } catch (error) {
      console.error('Error fetching user info:', error);
      openModal({
        type: 'error',
        message: 'Không thể tải thông tin người dùng'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await userService.login(email, password);
      const { token } = response;
      
      await AsyncStorage.setItem('token', token);
      setUserToken(token);
      await fetchUserInfo();

      return true;
    } catch (error) {
      openModal({
        type: 'error',
        message: error.response?.data?.message || 'Đăng nhập thất bại'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUserToken(null);
      setUserInfo(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateUserInfo = async (newInfo) => {
    try {
      setIsLoading(true);
      const data = await userService.updateProfile(newInfo);
      setUserInfo(data);
      openModal({
        type: 'success',
        message: 'Cập nhật thông tin thành công'
      });
    } catch (error) {
      console.error('Error updating user info:', error);
      openModal({
        type: 'error',
        message: error.response?.data?.message || 'Không thể cập nhật thông tin'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStudySettings = async (settings) => {
    try {
      setIsLoading(true);
      const data = await userService.updateStudySettings(settings);
      setUserInfo(prev => ({
        ...prev,
        studySettings: data
      }));
      openModal({
        type: 'success',
        message: 'Cập nhật cài đặt thành công'
      });
    } catch (error) {
      console.error('Error updating study settings:', error);
      openModal({
        type: 'error',
        message: error.response?.data?.message || 'Không thể cập nhật cài đặt'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      userToken,
      userInfo,
      login,
      logout,
      updateUserInfo,
      updateStudySettings
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
