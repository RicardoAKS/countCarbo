import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabsRoutes from './tabs.routes';
import { NativeStackNavigatorProps } from '@react-navigation/native-stack/lib/typescript/src/types';

const AppStack = createNativeStackNavigator();

const AppRoutes: React.FC<NativeStackNavigatorProps> = ({ screenOptions }) => (
    <AppStack.Navigator screenOptions={screenOptions}>
        <AppStack.Screen name="TabsRoutes" component={TabsRoutes} />
    </AppStack.Navigator>
)

export default AppRoutes;