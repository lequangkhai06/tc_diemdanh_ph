import {useEffect, useState} from 'react';
import {
  ScrollView,
  TextInput,
  View,
  Text,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, SIZES, FONTS} from '../constants';
import Button from '../components/Button';
import PageTitle from '../components/PageTitle';
import axios from 'axios';
import qs from 'qs';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function PhoneNumber({navigation}) {
  const [phoneNumber, setPhoneNumber] = useState(''); // Lưu trữ giá trị số điện thoại
  const [isLoading, setIsLoading] = useState(false);
  // kiểm tra người dùng đã đăng nhập hay chưa?
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('@login_token');
        if (token) {
          navigation.navigate('BottomTabNavigation');
        }
      } catch (error) {
        console.error('Lỗi kiểm tra token:', error);
      }
    };
    checkToken();
  });
  const checkPhoneNumber = async () => {
    if (phoneNumber === '') {
      Alert.alert('Thông báo', 'Vui lòng nhập số điện thoại.');
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(
        'https://khkt.khaidev.com/api/checkParentNumber.php',
        qs.stringify({
          phoneNumber: phoneNumber,
        }),
      );
      setIsLoading(false);
      const data = response.data;
      if (data.status === true) {
        // Lưu token đăng nhập
        const storeToken = async value => {
          try {
            await AsyncStorage.setItem('@login_token', value);
          } catch (e) {
            console.error(e);
          }
        };
        storeToken(phoneNumber)
          .then(() => {
            console.log('Lưu giá trị thành công');
          })
          .catch(error => {
            console.error('Lưu giá trị thất bại:', error);
          });
        navigation.navigate('BottomTabNavigation');
      }
      Alert.alert('Thông báo', data.message);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Có lỗi', error);
    }
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
      <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
        <PageTitle onPress={() => navigation.navigate('Walkthrough')} />
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <ScrollView>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text
              style={{
                ...FONTS.h2,
                color: COLORS.black,
                marginTop: 40,
              }}>
              Nhập Số Điện Thoại Của Bạn
            </Text>
            <Text
              style={{
                ...FONTS.body3,
                textAlign: 'center',
                marginVertical: 4,
                color: COLORS.black,
              }}>
              Đăng nhập dễ dàng với mã xác minh số điện thoại.
            </Text>
            <View
              style={{
                width: '100%',
                paddingHorizontal: 22,
                paddingVertical: 60,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 88,
                }}>
                <TouchableOpacity
                  style={{
                    width: 100,
                    height: 48,
                    marginHorizontal: 5,
                    borderRadius: SIZES.padding,
                    borderColor: COLORS.secondaryWhite,
                    borderWidth: 1,
                    backgroundColor: COLORS.secondaryWhite,
                    flexDirection: 'row',
                    fontSize: 12,
                  }}>
                  <View style={{justifyContent: 'center'}}>
                    <Image
                      source={require('../assets/images/down.png')}
                      style={{
                        width: 10,
                        height: 10,
                        tintColor: COLORS.black,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      justifyContent: 'center',
                      marginLeft: 5,
                    }}>
                    <Image
                      source={{uri: 'https://flagsapi.com/VN/flat/64.png'}}
                      resizeMode="contain"
                      style={{
                        width: 30,
                        height: 30,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      justifyContent: 'center',
                      marginLeft: 5,
                    }}>
                    <Text style={{color: '#111', fontSize: 12}}>+84</Text>
                  </View>
                </TouchableOpacity>
                {/* Phone Number Text Input */}
                <TextInput
                  style={{
                    flex: 1,
                    marginVertical: 10,
                    backgroundColor: COLORS.secondaryWhite,
                    borderRadius: SIZES.padding,
                    paddingLeft: SIZES.padding,
                    height: 50,
                    fontSize: 12,
                    color: COLORS.secondary,
                  }}
                  placeholder="Nhập số điện thoại tại đây"
                  placeholderTextColor="#111"
                  selectionColor="#111"
                  keyboardType="numeric"
                  value={phoneNumber} // Gán giá trị số điện thoại từ state
                  onChangeText={text => setPhoneNumber(text)} // Cập nhật giá trị số điện thoại vào state
                  required
                />
              </View>
              <Button
                title="Đăng nhập"
                // onPress={() => navigation.navigate('Verification')}
                onPress={checkPhoneNumber} // Gọi hàm postData khi nút được nhấn
                style={{
                  width: '100%',
                  paddingVertical: 12,
                  marginBottom: 48,
                }}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
