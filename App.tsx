import { NavigationContainer } from '@react-navigation/native';
import React, { useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from './src/contexts/auth';
import { StatusBar } from "expo-status-bar";
import { useFonts } from 'expo-font';
import Routes from './src/routes';
import { View } from 'react-native';


SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    'Bourton-inline': require("./assets/fonts/bourtoninline.ttf")
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <View className="w-full h-full flex-1 relative" onLayout={onLayoutRootView}>
      <NavigationContainer>
        <AuthProvider>
          <StatusBar style="auto" translucent />
          <Routes />
        </AuthProvider>
      </NavigationContainer>
    </View>
  );
}

export default App;