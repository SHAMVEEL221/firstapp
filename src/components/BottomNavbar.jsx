import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function BottomNavbar({ activeTab, setActiveTab }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const tabs = [
    { name: 'Home', icon: 'home' },
    { name: 'Search', icon: 'search' },
    { name: 'student', icon: 'people' },
    { name: 'Result', icon: 'trophy' },
    { name: 'Chat', icon: 'chatbubble' },
    { name: 'Profile', icon: 'person' },
  ];

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom + 10 }]}>
      <BlurView intensity={40} tint="light" style={styles.blurContainer}>
        <View style={styles.container}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.name;

            return (
             <TouchableOpacity
  key={tab.name}
  style={styles.tab}
  onPress={() => {
    setActiveTab(tab.name);
    navigation.navigate('Main', {
      screen: tab.name,
    });
  }}
>

                <View
                  style={[
                    styles.iconWrapper,
                    isActive && styles.activeIconWrapper,
                  ]}
                >
                  <Ionicons
                    name={isActive ? tab.icon : `${tab.icon}-outline`}
                    size={22}
                    color={isActive ? '#7C3AED' : '#999'}
                  />
                </View>

                {isActive && (
                  <Text style={styles.activeText}>{tab.name}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconWrapper: {
    backgroundColor: '#F3E8FF',
    borderRadius: 15,
  },
  activeText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#7C3AED',
  },
  blurContainer: {
    borderRadius: 30,
    overflow: 'hidden',
  },
});
