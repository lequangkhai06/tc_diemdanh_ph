import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = async () => {
  try {
    await AsyncStorage.removeItem('@login_token');
    console.log('logged out');
    return true;
  } catch (error) {
    console.log('Lỗi khi xoá token:', error);
    return false;
  }
};

export default Logout;
