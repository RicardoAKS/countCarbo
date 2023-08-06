import React, { createContext, PropsWithChildren, useEffect, useState, useContext } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as auth from '../services/auth';
import api from '../services/api';
import { SHA1 } from 'crypto-js';

var Buffer = require('buffer/').Buffer;

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    async function signIn(username: string, password: string) {

        setLoading(true);
        const response = await auth.signIn();

        setUser(response.user);

        api.defaults.headers['Authorization'] = `Bearer ${response.token}`;

        await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(response.user));
        await AsyncStorage.setItem('@RNAuth:token', response.token);
        setLoading(false);
    }

    async function signOut() {

        setLoading(true)

        new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("")
            }, 1000)
        })
            .then(() => {

                AsyncStorage.clear()
                    .then(() => {
                        setUser(null);
                        setLoading(false);
                    })
            })

    }

    async function register(values: RegisterForm) {
        console.log(values);
        
        setLoading(true);
        
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve("")
            }, 1000);
        });

        setLoading(false);

        values.email    = values.email.toLocaleLowerCase();
        values.password = SHA1(values.password).toString();
        const token     = Buffer.from(values.email + ':' + values.password, 'binary').toString('base64')

        Alert.alert(
            "Cadastro de usuário", 
            "Cadastro feito com sucesso!!", 
            [
                {
                    text: "OK",
                    onPress: () => {
                        setLoading(true);

                        new Promise(resolve => {
                            setTimeout(() => {
                                resolve("")
                            }, 1000)
                        }).then(async () => {

                            setUser(values);
                    
                            api.defaults.headers['Authorization'] = `Bearer ${token}`;
                    
                            await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(values));
                            await AsyncStorage.setItem('@RNAuth:token', token);
                            setLoading(false);
                        })

                    }
                }
            ]
        )

    }

    useEffect(() => {

        (async () => {

            const storagedUser = await AsyncStorage.getItem('@RNAuth:user');
            const storageToken = await AsyncStorage.getItem('@RNAuth:token');

            if (storagedUser && storageToken) {
                api.defaults.headers['Authorization'] = `Bearer ${storageToken}`;
                setUser(JSON.parse(storagedUser));
            }
            setLoading(false);
        })()

    }, []);

    return (
        <AuthContext.Provider value={{ signed: !!user, loading, user: user, signIn, signOut, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);

    return context;
}