import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {COLORS, FONTS} from '../constants';
import Icon from 'react-native-vector-icons/Feather';
const PageTitle = props => {
  return (
    <View style={styles.pageTitleContainer}>
      <TouchableOpacity
        onPress={props.onPress}
        style={{
          marginRight: 12,
        }}>
        <Icon name="arrow-left" size={25} color={COLORS.primary} />
      </TouchableOpacity>
      {props.title && (
        <Text style={{...FONTS.h4, color: COLORS.black}}>{props.title}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pageTitleContainer: {
    marginHorizontal: 22,
    marginVertical: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default PageTitle;
