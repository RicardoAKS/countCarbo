import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';
import { AuthProvider } from './src/contexts/auth';

import { StatusBar } from "expo-status-bar";

const App: React.FC = () => {
  
  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar style="auto" translucent />
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}

export default App;