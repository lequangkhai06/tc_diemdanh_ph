import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  RefreshControl,
  StatusBar,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../components/PageContainer';
import {COLORS, FONTS} from '../constants';
import axios from 'axios';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import {Avatar, Badge} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Skeleton from '../components/skeletonContacts';
import styleFlat from '../components/styleFlat';
const Contacts = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('@login_token');
      if (token) {
        console.log('Contacts:', token);
        setPhoneNumber(token);
      } else {
        navigation.reset({
          index: 0,
          routes: [{name: 'Walkthrough'}, {name: 'Walkthrough'}],
        });
      }
    } catch (error) {
      console.error('Lỗi kiểm tra token:', error);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://khkt.khaidev.com/api/listUsers.php?parentNumber=${phoneNumber}`,
      );
      const data = response.data;
      setFilteredUsers(data);
      setIsLoading(false);
    } catch (error) {
      Alert.alert('Có lỗi', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    if (phoneNumber) {
      fetchData();
    }
  }, [phoneNumber]);

  const handleSearch = text => {
    setSearch(text);
  };

  useEffect(() => {
    const filteredData = filteredUsers.filter(user =>
      user.fullName.toLowerCase().includes(search.toLowerCase()),
    );
    // nothing to do here
    // setFilteredUsers(filteredData);
  }, [search]);

  const handleAdd = () => {
    Alert.alert('Thông báo', 'Tính năng đang được cập nhật..');
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

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      key={index}
      onPress={() =>
        navigation.navigate('PersonalChat', {
          phoneNumber: item.phoneNumber,
          userName: item.fullName,
        })
      }
      style={[
        {
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 22,
          borderBottomColor: COLORS.secondaryWhite,
          borderBottomWidth: 5,
        },
        index % 2 !== 0
          ? {
              backgroundColor: COLORS.tertiaryWhite,
            }
          : null,
      ]}>
      <View
        style={{
          paddingVertical: 15,
          marginRight: 22,
        }}>
        <Avatar
          rounded
          source={{
            uri: item.userAvatar,
          }}
          resizeMode="contain"
          style={{
            height: 65,
            width: 65,
            borderRadius: 25,
          }}
        />

        <Badge
          value={item.totalMessage}
          status="error"
          containerStyle={{
            position: 'absolute',
            top: 10,
            right: -3,
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'column',
        }}>
        <Text style={{...FONTS.h4, marginBottom: 4, color: COLORS.black}}>
          {item.fullName}
        </Text>
        <View style={{flexDirection: 'column'}}>
          <Text style={{fontSize: 14, color: COLORS.secondaryGray}}>
            Sinh năm: {item.yearOfBirth}
          </Text>
          <Text style={{fontSize: 14, color: COLORS.secondaryGray}}>
            Lớp: {item.className}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      {/* <SpinnerOverlay
        textStyle={{color: '#fff', fontSize: 15}}
        size="small"
        overlayColor="rgba(0, 0, 0, 0.25)"
        animation="fade"
        cancelable={true}
        visible={isLoading}
        textContent={'Đang tải dữ liệu...'}
      /> */}
      <SafeAreaView style={{flex: 1}}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <PageContainer>
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: 22,
                marginTop: 22,
              }}>
              <Icon name="bells" size={20} color={COLORS.primary} />
              <Text style={{...FONTS.h4, color: COLORS.black}}>Thông Báo</Text>
              <TouchableOpacity onPress={() => handleAdd()}>
                <Icon name="plus" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginHorizontal: 22,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: COLORS.secondaryWhite,
                height: 48,
                marginVertical: 22,
                paddingHorizontal: 12,
                borderRadius: 20,
              }}>
              <Icon name="search1" size={20} color={COLORS.primary} />

              <TextInput
                style={{
                  width: '100%',
                  height: '100%',
                  marginHorizontal: 12,
                }}
                value={search}
                color={COLORS.primary}
                onChangeText={handleSearch}
                placeholder="Tìm kiếm học sinh..."
                placeholderTextColor={COLORS.secondaryGray}
              />
            </View>
            {isLoading ? (
              <View
                style={[
                  styleFlat.container,
                  {alignItems: 'center', justifyContent: 'center'},
                ]}>
                <Skeleton />
              </View>
            ) : (
              <FlatList
                data={filteredUsers}
                renderItem={renderItem}
                keyExtractor={item => item.phoneNumber}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={[COLORS.primary]}
                  />
                }
              />
            )}
          </View>
        </PageContainer>
      </SafeAreaView>
    </>
  );
};

export default Contacts;
