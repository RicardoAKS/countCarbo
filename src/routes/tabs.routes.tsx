import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Dashboard from "../pages/Dashboard";
import Settings from '../pages/Settings';

const TabsStack = createBottomTabNavigator();
const options: any = { 
    tabBarActiveTintColor: "#25a55f",
    tabBarLabelStyle: {
        fontWeight: '900',
        marginBottom: 5
    },
    tabBarIconStyle: {
        marginTop: 5
    },
}

const TabsRoutes: React.FC = () => (
    <TabsStack.Navigator screenOptions={{ headerShown: false, tabBarStyle: { height: 55 } }}>
        <TabsStack.Screen 
            name="Inicio" 
            component={Dashboard} 
            options={
                { 
                    ...options,
                    tabBarIcon: ({ focused, color, size }) => <Ionicons name="home" size={size} color={color} />
                }
            } 
        />
        <TabsStack.Screen 
            name="Configurações"
            component={Settings}
            options={
                {
                    ...options,
                    tabBarIcon: ({ focused, color, size }) => <Ionicons name="settings" size={size} color={color} /> 
                }
            }
        />
    </TabsStack.Navigator>
)

export default TabsRoutes;