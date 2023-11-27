import React from 'react';
import { Ionicons, MaterialCommunityIcons } from 'react-native-vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Settings from '../pages/Settings';
import Times from '../pages/Hours';
import Logout from '../pages/Logout';
import Diet from '../pages/Diet';

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
            name="Horários" 
            component={Times} 
            options={
                { 
                    ...options,
                    tabBarIcon: ({ focused, color, size }) => <Ionicons name="time" size={size} color={color} />
                }
            } 
        />
        <TabsStack.Screen 
            name="Dieta"
            component={Diet}
            options={
                {
                    ...options,
                    tabBarIcon: ({ focused, color, size }) => <MaterialCommunityIcons name="fruit-watermelon" size={size} color={color} />
                }
            }
        />
        {/* <TabsStack.Screen 
            name="Configurações"
            component={Settings}
            options={
                {
                    ...options,
                    tabBarIcon: ({ focused, color, size }) => <Ionicons name="settings" size={size} color={color} /> 
                }
            }
        /> */}
        <TabsStack.Screen 
            name="Sair"
            component={Logout}
            options={
                {
                    ...options,
                    tabBarIcon: ({ focused, color, size }) => <Ionicons name="log-out-outline" size={size} color={color} /> 
                }
            }
        />
    </TabsStack.Navigator>
)

export default TabsRoutes;