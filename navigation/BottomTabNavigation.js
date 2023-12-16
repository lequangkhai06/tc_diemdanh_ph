import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, Alert} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS, FONTS} from '../constants';
import {Contacts, More} from '../screens';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import qs from 'qs';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Tab = createBottomTabNavigator();
const BottomTabNavigation = () => {
  const [notificationToken, setNotificationToken] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('@login_token');
      if (token) {
        console.log('Access Token:', token);
        setPhoneNumber(token);
      }
    } catch (error) {
      console.error('Lỗi kiểm tra token:', error);
    }
  };

  const getFirebaseToken = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (!enabled) {
      Alert.alert(
        'Cảnh báo',
        'Để nhận được thông báo từ giáo viên, nhà trường. Vui lòng cho chép thông báo!',
      );
      // console.log('Authorization status: ' + authStatus);
    }
    const token = await messaging().getToken();
    setNotificationToken(token);
    //Alert.alert('Đã đăng kí nhận thông báo thành công!');
  };

  const postNotificationToken = useCallback(async () => {
    try {
      const response = await axios.post(
        'https://khkt.khaidev.com/api/notificationToken.php',
        qs.stringify({
          notificationToken: notificationToken,
          phoneNumber: phoneNumber,
        }),
      );
      const data = response.data;
      console.log(notificationToken);
      console.log(data);
    } catch (error) {
      console.log(error);
      // Alert.alert('Có lỗi', error);
    }
  }, [notificationToken, phoneNumber]);

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    if (phoneNumber) {
      getFirebaseToken();
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (notificationToken) {
      postNotificationToken();
    }
  }, [notificationToken, postNotificationToken]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
      Alert.alert('🚀 Bạn có thông báo mới', remoteMessage.notification.body);
    });
    return unsubscribe;
  });
  return (
    <Tab.Navigator
      screenOptions={{
        animationEnabled: true,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: COLORS.white,
          bottom: 0,
          right: 0,
          left: 0,
          elevation: 0,
          height: 60,
        },
      }}>
      <Tab.Screen
        name="Contacts"
        component={Contacts}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {focused ? (
                  <>
                    <Icon name="bell-badge" size={26} color={COLORS.primary} />
                    <Text
                      style={{
                        ...FONTS.body4,
                        color: COLORS.primary,
                      }}>
                      Thông báo
                    </Text>
                  </>
                ) : (
                  <>
                    <Icon
                      name="bell-badge-outline"
                      size={26}
                      color={COLORS.black}
                    />
                    <Text
                      style={{
                        ...FONTS.body3,
                        color: COLORS.secondaryBlack,
                      }}>
                      Thông báo
                    </Text>
                  </>
                )}
              </View>
            );
          },
        }}
      />

      <Tab.Screen
        name="More"
        component={More}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {focused ? (
                  <>
                    <Icon
                      name="account-circle"
                      size={26}
                      color={COLORS.primary}
                    />
                    <Text
                      style={{
                        ...FONTS.body3,
                        color: COLORS.primary,
                      }}>
                      Thông tin
                    </Text>
                  </>
                ) : (
                  <>
                    <Icon
                      name="account-circle-outline"
                      size={26}
                      color={COLORS.black}
                    />
                    <Text
                      style={{
                        ...FONTS.body4,
                        color: COLORS.secondaryBlack,
                      }}>
                      Thông tin
                    </Text>
                  </>
                )}
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
