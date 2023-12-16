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
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import CustomModal from '../components/Modal';
const UserInfomation = ({navigation}) => {
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
        <Text style={styles.buttonText}>Đăng xuất tài khoản</Text>
      </TouchableOpacity>
    );
  };
  const [phoneNumber, setPhoneNumber] = useState('');
  const [FirebaseToken, setFirebaseToken] = useState('');
  const [parentInfo, setParentInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  // modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  // modal actions
  const showModal = (ModalTitle, ModalMessage) => {
    setTitle(ModalTitle);
    setMessage(ModalMessage);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  function truncate(str, maxLength) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + '...';
    }
    return str;
  }
  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('@login_token');
      const getfirebaseToken = await AsyncStorage.getItem('@firebaseToken');
      if (token && getfirebaseToken) {
        console.log('More:', token);
        setPhoneNumber(token);
        setFirebaseToken(getfirebaseToken);
      } else {
        navigation.reset({
          index: 0,
          routes: [{name: 'Walkthrough'}],
        });
      }
    } catch (error) {
      console.error('Lỗi kiểm tra token:', error);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    if (phoneNumber) {
      console.log('phoneNumber:', phoneNumber);
      fetchData();
    }
  }, [phoneNumber]);

  const fetchData = async () => {
    if (!phoneNumber) return;
    try {
      setIsLoading(true);
      const response = await axios.post(
        'https://quangkhaideptrai.000webhostapp.com/api/getUserParents.php',
        qs.stringify({
          phoneNumber: phoneNumber,
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
        routes: [{name: 'Walkthrough'}],
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
      <SpinnerOverlay
        textStyle={{color: '#fff', fontSize: 15}}
        size="small"
        overlayColor="rgba(0, 0, 0, 0.25)"
        animation="fade"
        cancelable={true}
        visible={isLoading}
        textContent={''}
      />
      <SafeAreaView style={{flex: 1}}>
        <PageContainer>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[COLORS.primary]}
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
                  showModal('Device token', truncate(FirebaseToken, 26));
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

      {/* show modal here */}
      <CustomModal
        title={title}
        message={message}
        visible={modalVisible}
        onClose={closeModal}
      />
    </>
  );
};

export default UserInfomation;
