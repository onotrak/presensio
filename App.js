/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useEffect } from 'react';
import RootNavigation from 'navigation/RootNavigation';
import { StyleSheet } from 'react-native';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { initDatabase } from './src/database/db';

const App = () => {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <KeyboardProvider>
      <SafeAreaProvider
        style={styles.container}
        initialMetrics={initialWindowMetrics}
      >
        <RootNavigation />
      </SafeAreaProvider>
    </KeyboardProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
