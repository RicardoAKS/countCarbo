import React, { createContext, PropsWithChildren, useEffect, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

import { AuthContextData, CustomAlertButtonType, CustomRouteType, RegisterForm, User, styleCustomAlertType } from '../@types/app';
import CustomAlert from '../components/CustomAlert';
import axios, { AxiosResponse } from 'axios';

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState(null);
    const [message, setMessage] = useState(null);
    const [styleCustomAlert, setStyleCustomAlert] = useState<styleCustomAlertType | null>(null);

    const [buttons, setButtons] = useState<Array<CustomAlertButtonType> | null>(null);

    useEffect(() => {

        if (title != null && message != null && styleCustomAlert != null && buttons != null) {
            setModalVisible(true);
        }

    }, [title, message, styleCustomAlert, buttons]);

    function configCustomAlert(title: string|null, message: string|null, buttons: Array<CustomAlertButtonType>, styleCustomAlert?: styleCustomAlertType){
        setTitle(title);
        setMessage(message);
        setButtons(buttons);
        setStyleCustomAlert(styleCustomAlert);
    }

    async function signIn(email: string, password: string) {

        setLoading(true);
        api.post("/app/login", JSON.stringify({
            email: email,
            password: password
        }))
            .then(async response => {

                setUser(response.data.user);

                if (response.data.user) {

                    api.defaults.headers['Authorization'] = `Bearer ${response.data.token}`;

                    await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(response.data.user));
                    await AsyncStorage.setItem('@RNAuth:token', response.data.token);
                } else {
                    setLoading(false);
                    configCustomAlert(
                        "Login de Usuário",
                        "Usuário não encontrado no sistema",
                        [
                            {
                                text: "OK",
                                onPress: () => {
                                    setTitle(null);
                                    setMessage(null);
                                    setButtons(null);
                                    setStyleCustomAlert(null);
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
                }

            })
            .catch((error) => {

                console.log("error", error)

                setLoading(false);
                if (typeof error.response != "undefined" && error.response.status == 403 && error.response.headers["content-type"] == 'application/json') {

                    configCustomAlert(
                        "Login de Usúario",
                        error.response.data.message,
                        [
                            {
                                text: "OK",
                                onPress: () => {
                                    setTitle(null);
                                    setMessage(null);
                                    setButtons(null);
                                    setStyleCustomAlert(null);
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
                        "Login de Usúario",
                        "Ocorreu algum erro inesperado, tente novamento mais tarde",
                        [
                            {
                                text: "OK",
                                onPress: () => {
                                    setTitle(null);
                                    setMessage(null);
                                    setButtons(null);
                                    setStyleCustomAlert(null);
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

                }

            })

    }

    async function signOut() {

        setLoading(true)

        api.defaults.headers['Authorization'] = ``;
        AsyncStorage.clear()
            .then(() => {
                setUser(null);
                setLoading(false);
            })

    }

    async function register(values: RegisterForm) {

        return new Promise(async (resolve, reject) => {

            setLoading(true);

            console.log(values)

            api.post("/app/createUser", JSON.stringify(values))
                .then(response => {

                    setLoading(false);

                    let date = new Date();
                    let user: User = {
                        name: values.name, 
                        last_name: values.last_name,
                        email: values.email,
                        create_date: date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0],
                        status: 1
                    };

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

                    if (error.response && error.response.status == 403) {

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

                api.post('/app/checkLogin', {
                    authorization: api.defaults.headers['Authorization']
                })
                .then((response) => {

                    if(response.data.response){
                        setUser(response.data.response);
                    } else {
                        setUser(null);
                        setLoading(false);
                    }

                })
                .catch(error => {
                    setUser(null);
                    setLoading(false);

                    console.log(error)
                })
            } else {
                setLoading(false);
            }
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
            <AuthContext.Provider value={{ signed: !!user, setLoading, loading, user: user, signIn, signOut, register, configCustomAlert }}>
                {children}
            </AuthContext.Provider>
        </>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);

    return context;
}