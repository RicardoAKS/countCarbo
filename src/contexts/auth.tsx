import React, { createContext, PropsWithChildren, useEffect, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as auth from '../services/auth';
import api from '../services/api';

interface User {
    name: string;
    email: string;
}

interface AuthContextData {
    signed: boolean;
    loading: boolean;
    user: User | null;
    signIn(): Promise<void>;
    signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [user, setUser]       = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    async function signIn() {
        const response = await auth.signIn();

        console.log(response)

        setUser(response.user);

        api.defaults.headers['Authorization'] = `Bearer ${response.token}`;

        await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(response.user));
        await AsyncStorage.setItem('@RNAuth:token', response.token);
    }

    async function signOut() {
        AsyncStorage.clear()
        .then(() => {
            setUser(null);
        })
    }

    useEffect(() => {

        (async () => {

            const storagedUser = await AsyncStorage.getItem('@RNAuth:user');
            const storageToken = await AsyncStorage.getItem('@RNAuth:token');

            if(storagedUser && storageToken){
                api.defaults.headers['Authorization'] = `Bearer ${storageToken}`;
                setUser(JSON.parse(storagedUser));
            }
            setLoading(false);
        })()

    }, []);

    return (
        <AuthContext.Provider value={{ signed: !!user, loading, user: user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);

    return context;
}