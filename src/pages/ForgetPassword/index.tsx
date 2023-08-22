import React, { useState } from 'react';
import { useFonts } from 'expo-font';
import { Controller, useForm } from 'react-hook-form';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Alert, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import { ForgetPasswordType } from '../../@types/app';

const ForgetPassword: React.FC<NativeStackHeaderProps> = ({ navigation }) => {
    const { control, handleSubmit } = useForm<ForgetPasswordType>({
        mode: 'onChange',
        defaultValues: {
            email: ""
        }
    });

    async function submitEmail(values: ForgetPasswordType) {
        console.log(values);

        Alert.alert(
            "Recuperar senha",
            `E-mail enviado para ${values.email}!`,
            [{
                text: "CONTINUAR",
                onPress: () => navigation.goBack()
            }]
        )
    }

    return (
        <View className="flex items-center px-4 bg-[#25a55f] w-full h-full pt-10">

            <TouchableWithoutFeedback
                className="w-full h-full"
                onPress={() => Keyboard.dismiss()}
            >
                <ScrollView
                    className="w-full pb-10 mb-5"
                >

                    <View className="w-full flex justify-between items-start bg-white border-b border-solid border-[#25a55f] rounded-t-lg">

                        <TouchableOpacity
                            className="py-3 px-3"
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" color="#25a55f" size={25} />
                        </TouchableOpacity>

                    </View>

                    <View className="w-full px-3 pb-5 pt-3 bg-white rounded-b-lg">

                        <Text className="text-4xl w-full text-center font-['Bourton-inline'] text-[#25a55f]">{"Recuperar\nminha senha"}</Text>

                        <Text className="text-sm my-3 text-[#25a55f] text-justify w-full font-bold px-5">Digite seu e-mail para receber um link para redefinir a sua senha</Text>

                        <Controller
                            control={control}
                            name="email"
                            rules={
                                {
                                    required: "E-mail obrigatório",
                                    validate: {
                                        matchPattern: (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v),
                                    }
                                }
                            }
                            render={
                                ({ field, fieldState }) => {
                                    const [emailFocus, setEmailFocus] = useState(false);
                                    let placeholderTextColor = emailFocus ? "#25a55f60" : "#00000060";

                                    if (fieldState.error) {
                                        placeholderTextColor = "#f0000060";
                                    }

                                    return (
                                        <View className="w-full mb-3">
                                            <Text className={`text-sm mb-1 ${emailFocus ? 'text-[#25a55f]' : 'text-black'} ${fieldState.error ? 'text-red-600' : ''}`}>E-mail</Text>
                                            <TextInput
                                                className={`border border-solid px-2 py-2 rounded-md text-black border-black focus:border-[#25a55f] focus:text-[#25a55f] ${fieldState.error ? 'border-red-600' : ''} ${fieldState.error ? 'text-red-600' : ''}`}
                                                placeholder="joao@example.com"
                                                placeholderTextColor={placeholderTextColor}
                                                value={field.value}
                                                onChangeText={field.onChange}
                                                onBlur={() => setEmailFocus(false)}
                                                onFocus={() => setEmailFocus(true)}
                                            />

                                            {
                                                fieldState.error && fieldState.error?.type == "required" && (
                                                    <Text className="text-xs text-red-600 font-bold ml-1">{fieldState?.error?.message}</Text>
                                                )
                                            }

                                            {
                                                fieldState.error && fieldState.error?.type == "matchPattern" && (
                                                    <Text className="text-xs text-red-600 font-bold ml-1">O e-mail deve ser válido</Text>
                                                )
                                            }
                                        </View>
                                    )
                                }
                            }
                        />

                        <TouchableOpacity className="w-full p-3 flex justify-center items-center rounded-md bg-white border border-black border-solid" onPress={handleSubmit(submitEmail)}>

                            <Text className="text-black text-[20px] font-['Bourton-inline']">ENVIAR E-MAIL</Text>

                        </TouchableOpacity>

                    </View>

                </ScrollView>
            </TouchableWithoutFeedback>
        </View>
    )
};

export default ForgetPassword;