import React from 'react';
import {COLORS} from '../constants';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
const CustomModal = ({title, message, visible, onClose}) => {
  const closeModal = () => {
    onClose();
  };

  return (
    <Modal
      animationType=""
      transparent={true}
      visible={visible}
      onRequestClose={closeModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text>
              <Icon name="x-circle" size={20} color={COLORS.primary} />
            </Text>
          </TouchableOpacity> */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={closeModal}>
            <Text style={styles.buttonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
    paddingVertical: 5,
    zIndex: 1,
  },
  title: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  message: {
    color: '#000',
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 25,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.primary,
  },
});

export default CustomModal;
