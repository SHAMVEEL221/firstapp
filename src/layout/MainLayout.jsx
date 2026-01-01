import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import BottomNavbar from '../components/BottomNavbar';

// Screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import StudentsScreen from '../screens/StudentsScreen';
import ResultScreen from '../screens/ResultScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createMaterialTopTabNavigator();

export default function MainLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          swipeEnabled: false,
          tabBarStyle: { display: 'none',  },
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Students" component={StudentsScreen} />
        <Tab.Screen name="Result" component={ResultScreen} />
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      {/* 👇 Common Bottom Navigation */}
      <BottomNavbar />
    </View>
  );
}
