import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomNavbar from './src/components/BottomNavbar';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import StudentsScreen, { StudentDetailsScreen } from './src/screens/StudentsScreen';
import ResultScreen from './src/screens/ResultScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HiScreen from './src/screens/hi';

const Tab = createMaterialTopTabNavigator();
const StudentStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();


// --------------------
// Student Stack
// --------------------
function StudentStackNavigator() {
  return (
    <StudentStack.Navigator screenOptions={{ headerShown: false }}>
      <StudentStack.Screen name="StudentList" component={StudentsScreen} />
      <StudentStack.Screen
        name="StudentDetails"
        component={StudentDetailsScreen}
      />
    </StudentStack.Navigator>
  );
}


// --------------------
// Main Tabs
// --------------------
function MainTabs({ activeTab, setActiveTab }) {
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          swipeEnabled: true,
          tabBarStyle: { display: 'none' },
          lazy: true,
        }}
        sceneContainerStyle={{ backgroundColor: '#f5f5f5' }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="student" component={StudentStackNavigator} />
        <Tab.Screen name="Result" component={ResultScreen} />
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      {/* Bottom Navbar */}
      <BottomNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </>
  );
}


// --------------------
// App
// --------------------
export default function App() {
  const [activeTab, setActiveTab] = useState('Home');

  return (
    <SafeAreaProvider>
      <NavigationContainer
        onStateChange={(state) => {
          if (!state) return;

          const route = state.routes[state.index];

          // If we are inside Main (Tabs)
          if (route.name === 'Main' && route.state) {
            const tabRoute =
              route.state.routes[route.state.index];

            // student stack handling
            if (tabRoute.name === 'student') {
              setActiveTab('student');
            } else {
              setActiveTab(tabRoute.name);
            }
          }
        }}
      >
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          
          {/* Tabs */}
          <RootStack.Screen name="Main">
            {() => (
              <MainTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}
          </RootStack.Screen>

          {/* Hi Screen (NO Bottom Navbar) */}
          <RootStack.Screen
            name="Hi"
            component={HiScreen}
          />

        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
