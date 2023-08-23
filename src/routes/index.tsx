import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import colors from 'tailwindcss/colors';

import { useAuth } from '../contexts/auth';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

import type { NativeStackNavigationOptions } from '@react-navigation/native-stack'

const Routes: React.FC = () => {
    const { signed, loading } = useAuth();

    const options:NativeStackNavigationOptions = {
        headerShown: false,
        animation: "slide_from_right"
    };
    
    return (
        <>
            {loading && (
                <View className='flex-1 justify-center items-center bg-[#25a55f] absolute top-0 bottom-0 right-0 left-0 z-10'>
                    <ActivityIndicator size={"large"} color={colors.white} />
                </View>
            )}

            {signed && (
                <AppRoutes screenOptions={options} children />
            )}

            {!signed && (
                <AuthRoutes screenOptions={options} children />
            )}
        </>
    )
}

export default Routes;