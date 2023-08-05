import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import colors from 'tailwindcss/colors';

import { useAuth } from '../contexts/auth';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

const Routes: React.FC = () => {
    const { signed, loading } = useAuth();

    if(loading) {
        return (
            <View className='flex-1 justify-center items-center'>
                <ActivityIndicator size={"large"} color={colors.violet[200]} />
            </View>
        )
    }

    return signed ? <AppRoutes /> : <AuthRoutes />;
}

export default Routes;