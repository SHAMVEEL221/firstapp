import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BottomNavbar from '../components/BottomNavbar';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import StudentsScreen from '../screens/StudentsScreen';
import ResultScreen from '../screens/ResultScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createMaterialTopTabNavigator();

export default function TabsNavigator() {
  const [activeTab, setActiveTab] = useState('Home');

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          swipeEnabled: true,
          tabBarStyle: { display: 'none' },
        }}
        sceneContainerStyle={{ backgroundColor: '#f5f5f5' }}
        onStateChange={(state) => {
          const routeName = state.routes[state.index].name;
          setActiveTab(routeName);
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="student" component={StudentsScreen} />
        <Tab.Screen name="Result" component={ResultScreen} />
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      <BottomNavbar activeTab={activeTab} />
    </>
  );
}
