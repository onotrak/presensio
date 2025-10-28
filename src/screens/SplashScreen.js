import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');

        setTimeout(() => {
          if (userData) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Dashboard' }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            });
          }
        }, 1500);
      } catch (error) {
        console.log('Error reading login data:', error);
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        });
      }
    };

    checkLoginStatus();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/presensio.png')}
        style={styles.logoStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  logoStyle: {
    width: 250,
    height: 250,
  },
});

export default SplashScreen;
