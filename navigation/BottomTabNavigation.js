import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, Alert, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS, FONTS} from '../constants';
import {Notifications, UserInfomation, Contacts} from '../screens';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import qs from 'qs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
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
    }
    const token = await messaging().getToken();
    setNotificationToken(token);
    console.log(token);
    // lưu token thông báo vào local storage
    AsyncStorage.setItem('@firebaseToken', token);
    //Alert.alert('Đã đăng kí nhận thông báo thành công!');
  };

  const postNotificationToken = useCallback(async () => {
    try {
      const response = await axios.post(
        'https://quangkhaideptrai.000webhostapp.com/api/notificationToken.php',
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
      Alert.alert('Bạn có thông báo mới', remoteMessage.notification.body);
    });
    return unsubscribe;
  });
  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}>
        <Tab.Screen
          name="Notifications"
          component={Notifications}
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
                      <Icon name="bell-badge" size={26} color={COLORS.white} />
                      <Text
                        style={{
                          ...FONTS.body4,
                          color: COLORS.white,
                        }}>
                        Thông báo
                      </Text>
                    </>
                  ) : (
                    <>
                      <Icon
                        name="bell-badge-outline"
                        size={26}
                        color={COLORS.white}
                      />
                      <Text
                        style={{
                          ...FONTS.body3,
                          color: COLORS.white,
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
                      <Icon name="contacts" size={26} color={COLORS.white} />
                      <Text
                        style={{
                          ...FONTS.body4,
                          color: COLORS.white,
                        }}>
                        Danh bạ
                      </Text>
                    </>
                  ) : (
                    <>
                      <Icon
                        name="contacts-outline"
                        size={26}
                        color={COLORS.white}
                      />
                      <Text
                        style={{
                          ...FONTS.body3,
                          color: COLORS.white,
                        }}>
                        Danh bạ
                      </Text>
                    </>
                  )}
                </View>
              );
            },
          }}
        />

        <Tab.Screen
          name="UserInfomation"
          component={UserInfomation}
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
                        color={COLORS.white}
                      />
                      <Text
                        style={{
                          ...FONTS.body3,
                          color: COLORS.white,
                        }}>
                        Thông tin
                      </Text>
                    </>
                  ) : (
                    <>
                      <Icon
                        name="account-circle-outline"
                        size={26}
                        color={COLORS.white}
                      />
                      <Text
                        style={{
                          ...FONTS.body4,
                          color: COLORS.white,
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
    </SafeAreaView>
  );
};
// custom styles
const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: COLORS.primary,
    bottom: 8,
    right: 10,
    left: 10,
    elevation: 0,
    height: 60,
    borderRadius: 15,
    borderBottomWidth: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    ...FONTS.body3,
    color: COLORS.secondaryBlack,
  },
  tabTextActive: {
    ...FONTS.body4,
    color: COLORS.primary,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default BottomTabNavigation;
