import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../components/PageContainer';
import {COLORS, FONTS} from '../constants';
import {useEffect} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logout from '../components/Logout';
import axios from 'axios';
import qs from 'qs';

const More = ({navigation}) => {
  const styles = StyleSheet.create({
    button: {
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#ecedef',
      borderRadius: 20,
      padding: 15,
      width: '100%',
    },
    buttonText: {
      color: COLORS.black,
      marginLeft: 6,
      fontWeight: 'bold',
    },
  });
  const LogoutButton = ({onPress}) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Icon
          name="log-out"
          size={20}
          style={{
            color: COLORS.black,
            fontWeight: 'bold',
          }}
        />
        <Text style={styles.buttonText}>Đăng xuất</Text>
      </TouchableOpacity>
    );
  };
  const [phoneNumber, setPhoneNumber] = useState('');
  const [parentInfo, setParentInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('@login_token');
      if (token) {
        console.log('More:', token);
        setPhoneNumber(token);
      }
    } catch (error) {
      console.error('Lỗi kiểm tra token:', error);
    }
  };
  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    console.log('phoneNumber:', phoneNumber);
    fetchData();
  }, [phoneNumber]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        'https://khkt.khaidev.com/api/getUserParents.php',
        qs.stringify({
          phoneNumber: phoneNumber, // Sử dụng giá trị số điện thoại từ state
        }),
      );
      setIsLoading(false);
      const data = response.data;
      console.log(data);
      setParentInfo(data);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Có lỗi', error);
    }
  };
  const handleLogout = async () => {
    if (Logout()) {
      Alert.alert('Thông báo', 'Đăng xuất tài khoản thành công.');
      navigation.reset({
        index: 0,
        routes: [{name: 'Walkthrough'}, {name: 'Walkthrough'}],
      });
    }
  };
  const handleSetting = async () => {
    Alert.alert('Thông báo', 'Đang cập nhật.');
  };
  const handleTest = async () => {
    Alert.alert('Thông báo', 'Đang cập nhật.');
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } catch (error) {
      console.log(error);
    }
    setRefreshing(false);
  };
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <PageContainer>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: 22,
                marginVertical: 22,
              }}>
              <Icon name="user" size={20} color={COLORS.primary} />

              <Text style={{...FONTS.h4, color: COLORS.black}}>Thông Tin</Text>
              <Icon
                name="settings"
                size={20}
                color={COLORS.primary}
                onPress={handleSetting}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 22,
              }}>
              <View
                style={{
                  height: 65,
                  width: 65,
                  borderRadius: 35,
                  backgroundColor: COLORS.secondaryWhite,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={{
                    uri: parentInfo.userAvatar
                      ? parentInfo.userAvatar
                      : `https://ui-avatars.com/api/?name=${parentInfo.fullName}&background=random&rounded=true`,
                  }}
                  resizeMode="contain"
                  style={{
                    height: 65,
                    width: 65,
                    borderRadius: 35,
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  marginHorizontal: 22,
                }}>
                <Text
                  style={{
                    ...FONTS.h3,
                    marginVertical: 6,
                    color: COLORS.black,
                    fontWeight: 'bold',
                  }}>
                  {parentInfo.fullName}
                </Text>
                <Text style={{...FONTS.body3, color: COLORS.secondaryBlack}}>
                  {' '}
                  {parentInfo.phoneNumber}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <Icon name="chevron-right" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginTop: 32,
              }}>
              <TouchableOpacity
                onPress={handleTest}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 22,
                  paddingVertical: 12,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon name="user" size={20} color={COLORS.black} />
                  <Text
                    style={{...FONTS.h4, marginLeft: 12, color: COLORS.black}}>
                    {' '}
                    Tài khoản
                  </Text>
                </View>
                <Icon name="chevron-right" size={20} color={COLORS.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  console.log('Pressed');
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 22,
                  paddingVertical: 12,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon name="bell" size={20} color={COLORS.black} />
                  <Text
                    style={{...FONTS.h4, marginLeft: 12, color: COLORS.black}}>
                    {' '}
                    Thông báo
                  </Text>
                </View>
                <Icon name="chevron-right" size={20} color={COLORS.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  console.log('Pressed');
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 22,
                  paddingVertical: 12,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon name="lock" size={20} color={COLORS.black} />
                  <Text
                    style={{...FONTS.h4, marginLeft: 12, color: COLORS.black}}>
                    Bảo mật
                  </Text>
                </View>
                <Icon name="chevron-right" size={20} color={COLORS.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  console.log('Pressed');
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 22,
                  paddingVertical: 12,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon name="database" size={20} color={COLORS.black} />
                  <Text
                    style={{...FONTS.h4, marginLeft: 12, color: COLORS.black}}>
                    Dữ liệu sử dụng
                  </Text>
                </View>
                <Icon name="chevron-right" size={20} color={COLORS.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  console.log('Pressed');
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 22,
                  paddingVertical: 12,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon name="alert-triangle" size={20} color={COLORS.black} />
                  <Text
                    style={{...FONTS.h4, marginLeft: 12, color: COLORS.black}}>
                    Hỗ trợ
                  </Text>
                </View>
                <Icon name="chevron-right" size={20} color={COLORS.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 22,
                  paddingVertical: 12,
                }}>
                <LogoutButton onPress={handleLogout} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </PageContainer>
      </SafeAreaView>
    </>
  );
};

export default More;
