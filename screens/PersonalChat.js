import {View, Text, TouchableOpacity, Alert, StatusBar} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, FONTS} from '../constants';
import Icon from 'react-native-vector-icons/Feather';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';
import {Linking} from 'react-native';
const defaultdata = [
  {
    _id: 1,
    text: 'Không có thông báo nào cho học sinh này.',
    createdAt: new Date(),
    system: true,
  },
];
const PersonalChat = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState(defaultdata);
  const route = useRoute();
  const {userName, phoneNumber} = route.params;
  const formatMessages = data => {
    return data.map(item => {
      return {
        status: item.status,
        _id: item.id,
        text: item.message,
        createdAt: new Date(item.created_at),
        user: {
          _id: item.user_id,
          name: item.user_name,
          avatar: item.user_avatar,
          phoneNumber: item.sentPhone,
        },
      };
    });
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Function to fetch data from the server
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://khkt.khaidev.com/api/listMessages.php?phoneNumber=${phoneNumber}`,
      );
      const data = response.data;

      if (data.length > 0) {
        const formattedMessages = formatMessages(data);
        setMessages(formattedMessages);
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [phoneNumber]);
  // Customize sender messages
  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: COLORS.primary,
          },
          left: {
            backgroundColor: COLORS.white,
          },
        }}
        textStyle={{
          right: {
            color: COLORS.white,
          },
          left: {
            color: COLORS.black,
          },
        }}
      />
    );
  };

  const onPressAvatar = useCallback(pressedUser => {
    const userInfo = JSON.stringify(pressedUser);
    const parsedUserInfo = JSON.parse(userInfo);
    let userPhoneNumber = '';
    userPhoneNumber =
      parsedUserInfo.phoneNumber !== ''
        ? parsedUserInfo.phoneNumber
        : 'không có.';
    Alert.alert(
      'Thông tin người gửi thông báo',
      'Tên: ' +
        parsedUserInfo.name +
        '\n' +
        'Số điện thoại: ' +
        userPhoneNumber,
      [
        {
          text: 'Đóng',
        },
        {
          text: 'Liên hệ',
          onPress: () => {
            if (parsedUserInfo.phoneNumber === '') {
              Alert.alert('Thông báo', 'Người gửi không có thông tin liên hệ!');
              return;
            }
            Linking.openURL(`tel:${userPhoneNumber}`);
          },
        },
      ],
    );
  }, []);

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
      <SafeAreaView style={{flex: 1, color: COLORS.secondaryWhite}}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 22,
            backgroundColor: COLORS.primary,
            height: 60,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => navigation.navigate('Contacts')}>
              <Icon name="chevron-left" size={28} color={COLORS.white} />
            </TouchableOpacity>
            <View>
              <Text
                style={{
                  ...FONTS.h4,
                  marginLeft: 10,
                  color: COLORS.white,
                  fontWeight: 'bold',
                }}>
                {userName}
              </Text>
              <Text
                style={{
                  ...FONTS.body5,
                  marginLeft: 10,
                  color: COLORS.white,
                }}>
                Dưới đây là lịch sử thông báo.
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => console.log('search')}
              style={{
                marginRight: 8,
              }}>
              <Icon name="menu" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        <GiftedChat
          onPressAvatar={onPressAvatar}
          messages={messages}
          user={{
            _id: 1,
          }}
          renderBubble={renderBubble}
          scrollToBottom
          minInputToolbarHeight={20}
          textInputProps={{
            style: {
              display: 'none',
            },
          }}
          timeTextStyle={{
            left: {color: COLORS.primary},
          }}
          infiniteScroll
        />
      </SafeAreaView>
    </>
  );
};

export default PersonalChat;
