import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Navbar() {
  return (
    <View style={styles.navbar}>
      <Text style={styles.title}>
        My First App
      </Text>

      <TouchableOpacity>
        <Text style={styles.menu}>Menu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    height: 56,                 // same as h-14
    backgroundColor: '#2563EB', // blue-600
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menu: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
