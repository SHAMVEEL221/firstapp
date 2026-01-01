import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function HiScreen() {
  return (
    <LinearGradient
      colors={['#7C3AED', '#A78BFA']}
      style={styles.container}
    >
      <View style={styles.card}>
        <Ionicons name="hand-left-outline" size={48} color="#7C3AED" />

        <Text style={styles.title}>Hi 👋</Text>
        <Text style={styles.subtitle}>
          Welcome to your app
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 40,
    paddingHorizontal: 30,
    borderRadius: 24,
    alignItems: 'center',
    width: '80%',

    // shadow
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
  },

  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
});
