import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LeaderboardScreen from '../screens/ChatScreen';
import StudentDetailScreen from '../screens/StudentDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StudentDetail"
        component={StudentDetailScreen}
        options={{ title: 'Student Details' }}
      />
    </Stack.Navigator>
  );
}
