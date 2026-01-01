import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabsNavigator from './TabsNavigator';
import StudentDetailScreen from '../screens/StudentDetailScreen';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator>
      {/* Tabs */}
      <Stack.Screen
        name="Tabs"
        component={TabsNavigator}
        options={{ headerShown: false }}
      />

      {/* Student Detail (NO bottom navbar here) */}
      <Stack.Screen
        name="StudentDetail"
        component={StudentDetailScreen}
        options={{ title: 'Student Details' }}
      />
    </Stack.Navigator>
  );
}
