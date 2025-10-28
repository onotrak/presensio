import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from 'screens/SplashScreen';
import LoginScreen from 'screens/LoginScreen';
import RegisterScreen from 'screens/RegisterScreen';
import Dashboard from 'screens/Dashboard';

const Stack = createNativeStackNavigator();
export const navigationRef = React.createRef();

const RootNavigation = () => {
  return (
    <NavigationContainer
      ref={navigationRef}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
