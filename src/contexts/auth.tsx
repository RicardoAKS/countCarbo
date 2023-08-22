import React, { createContext, PropsWithChildren, useEffect, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as auth from '../services/auth';
import api from '../services/api';

import { AuthContextData, CustomAlertButtonType, RegisterForm, User, styleCustomAlertType } from '../@types/app';
import CustomAlert from '../components/CustomAlert';

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [user, setUser]                 = useState<User | null>(null);
    const [loading, setLoading]           = useState(true);

    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState(null);
    const [message, setMessage] = useState(null);
    const [styleCustomAlert, setStyleCustomAlert] = useState<styleCustomAlertType|null>(null);

    const [buttons, setButtons] = useState<Array<CustomAlertButtonType>|null>(null);

    useEffect(() => {

        if(title != null && message != null && styleCustomAlert != null && buttons != null){
            setModalVisible(true);
        }

    }, [title, message, styleCustomAlert, buttons]);
    
    const configCustomAlert = (title: string, message: string, buttons: Array<CustomAlertButtonType>, styleCustomAlert?: styleCustomAlertType) => {
        setTitle(title);
        setMessage(message);
        setButtons(buttons);
        setStyleCustomAlert(styleCustomAlert);
    }

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
        
        return new Promise(async (resolve, reject) => {
            
            setLoading(true);
            
            console.log(values)

            api.post("/app/createUser", JSON.stringify(values))
            .then(response => {

                setLoading(false);

                let user = values;
                delete user.password;

                setUser(user);
        
                const token = response.data.token;
        
                configCustomAlert(
                    "Cadastro de usuário", 
                    "Cadastro feito com sucesso!!", 
                    [
                        {
                            text: "OK",
                            onPress: async () => {
                                setLoading(true);

                                api.defaults.headers['Authorization'] = `Bearer ${token}`;
                        
                                await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(user));
                                await AsyncStorage.setItem('@RNAuth:token', token);
                                resolve("");

                                setTitle(null);
                                setMessage(null);
                                setButtons(null);
                                setStyleCustomAlert(null);

                                setLoading(false);
        
                            },
                            styles: {
                                backgroundColor: '#00000000',
                                color: '#fff',
                                borderColor: '#fff'
                            }
                        }
                    ],
                    {
                        container: {
                            backgroundColor: '#25a55f'
                        },
                        title: {
                            color: '#fff',
                        },
                        message: {
                            color: '#fff'
                        }
                    }
                )
            })
            .catch(error => {

                console.log(error)

                if(error.response.status == 403){
        
                    configCustomAlert(
                        "Cadastro de usuário",
                        error.response.data.message, 
                        [
                            {
                                text: "OK",
                                onPress: () => {
                                    setTitle(null);
                                    setMessage(null);
                                    setButtons(null);
                                    setStyleCustomAlert(null);

                                    setLoading(false);
                                },
                                styles: {
                                    backgroundColor: '#00000000',
                                    color: '#fff',
                                    borderColor: '#fff'
                                }
                            }
                        ],
                        {
                            container: {
                                backgroundColor: '#e0c00b'
                            },
                            title: {
                                color: '#fff',
                            },
                            message: {
                                color: '#fff'
                            }
                        }
                    )
        
                } else {

                    configCustomAlert(
                        "Cadastro de usuário",
                        "Ocorreu algum erro inesperado, tente novamento mais tarde",
                        [
                            {
                                text: "OK",
                                onPress: () => {
                                    setTitle(null);
                                    setMessage(null);
                                    setButtons(null);
                                    setStyleCustomAlert(null);

                                    setLoading(false);
                                },
                                styles: {
                                    backgroundColor: '#00000000',
                                    color: '#fff'
                                }
                            }
                        ],
                        {
                            container: {
                                backgroundColor: '#c90e27'
                            },
                            title: {
                                color: '#fff',
                            },
                            message: {
                                color: '#fff'
                            }
                        }
                    )

                    reject(error);
                }
    
            });

        });
        
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
        <>
            <CustomAlert
                visible={modalVisible}
                setModalVisible={setModalVisible}
                title={title}
                message={message}
                styleCustomAlert={styleCustomAlert}
                buttons={buttons}
                onRequestClose={() => setLoading(false)}
            />
            <AuthContext.Provider value={{ signed: !!user, loading, user: user, signIn, signOut, register }}>
                {children}
            </AuthContext.Provider>
        </>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);

    return context;
}