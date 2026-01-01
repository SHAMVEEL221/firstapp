import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TopNavbar() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* TOP NAVBAR */}
      <View style={styles.header}>
        <View style={{ width: 40 }} />

        {/* CENTER LOGO */}
        <Image
          source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
          style={styles.logo}
        />

        {/* MENU ICON */}
        <TouchableOpacity onPress={() => setVisible(true)}>
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      {/* MODAL MENU */}
      <Modal animationType="slide" transparent visible={visible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            {/* CLOSE ICON */}
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setVisible(false)}
            >
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>

            {/* BIG IMAGE */}
            <Image
              source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
              style={styles.bigImage}
            />

            {/* BUTTONS */}
            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalText}>About</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalText}>Share App</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    elevation: 4,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  closeIcon: {
    alignSelf: 'flex-end',
  },
  bigImage: {
    width: 120,
    height: 120,
    marginVertical: 20,
  },
  modalButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#2196F3',
    marginTop: 10,
  },
  modalText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
