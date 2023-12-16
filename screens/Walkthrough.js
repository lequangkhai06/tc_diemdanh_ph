import {View, Text, Image, StatusBar} from 'react-native';
import React, {useEffect, useState} from 'react';
import PageContainer from '../components/PageContainer';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SIZES, FONTS, COLORS} from '../constants';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Walkthrough({navigation}) {
  const [router, setRouter] = useState('');
  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('@login_token');
      if (token) {
        // Notification
        console.log('Homepage:', token);
        setRouter('BottomTabNavigation');
      } else {
        setRouter('PhoneNumber');
      }
    } catch (error) {
      console.error('Lỗi kiểm tra token:', error);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    console.log('router:', router);
  }, [router]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <PageContainer>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'column',
            marginHorizontal: 22,
          }}>
          <Image
            source={require('../assets/images/logo.jpg')}
            resizeMode="contain"
            style={{
              width: 310,
              height: 310,
              marginVertical: 70,
            }}
          />

          <Text
            style={{
              ...(SIZES.width <= 360 ? {...FONTS.h5} : {...FONTS.h4}),
              textAlign: 'center',
              color: COLORS.black,
              marginHorizontal: SIZES.padding * 0.8,
              marginBottom: 10,
              fontWeight: 'bold',
            }}>
            Chăm chỉ học hành - Thành công sẽ đến
          </Text>
          <View style={{width: '100%', alignItems: 'center'}}>
            <Button
              title="BẮT ĐẦU"
              onPress={() => navigation.navigate(router)}
              style={{
                width: '100%',
                paddingVertical: 12,
                marginBottom: 90,
              }}
            />

            <Text
              style={{
                ...FONTS.body3,
                marginVertical: 12,
                color: COLORS.black,
              }}>
              &copy; 2023, Developed by TC Soft.
            </Text>
          </View>
        </View>
      </PageContainer>
    </SafeAreaView>
  );
}
