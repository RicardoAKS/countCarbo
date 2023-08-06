import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ForgetPassword from '../pages/ForgetPassword';
import Register from '../pages/Register';
import SignIn from "../pages/SignIn";
import Home from '../pages/Home';
import { NativeStackNavigatorProps } from '@react-navigation/native-stack/lib/typescript/src/types';

const AuthStack = createNativeStackNavigator();

const AuthRoutes: React.FC<NativeStackNavigatorProps> = ({ screenOptions }) => (
    <AuthStack.Navigator screenOptions={screenOptions}>
        <AuthStack.Screen name="Home" component={Home} />
        <AuthStack.Screen name="Register" component={Register} />
        <AuthStack.Screen name="SignIn" component={SignIn} />
        <AuthStack.Screen name="ForgetPassword" component={ForgetPassword} options={{ animation: 'slide_from_bottom' }} />
    </AuthStack.Navigator>
)

export default AuthRoutes;