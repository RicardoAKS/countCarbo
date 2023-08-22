import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, TouchableOpacity, TextInput, Text, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/auth';
import { RegisterForm } from '../../@types/app';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

import Heart from '../../../assets/svgs/heart.svg';

const Register: React.FC<NativeStackHeaderProps> = ({ navigation }) => {
    const { register } = useAuth();
    const { control, handleSubmit } = useForm<RegisterForm>({
        mode: 'onChange',
        defaultValues: {
            name: "",
            lastName: "",
            email: "",
            password: ""
        }
    });

    function submitForm(values: RegisterForm) {
        register(values)
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            className="w-full flex-1 h-full bg-[#25a55f] pt-10 px-5 justify-center"
        >

            <TouchableWithoutFeedback
                className="w-full h-full"
                onPress={() => Keyboard.dismiss()}
            >
                <ScrollView
                    className="w-full pb-20"
                    contentContainerStyle={{ paddingBottom: 5 }}
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

                        <View className="w-full px-5 justify-center items-center mb-5">

                            <View className="w-1/2 aspect-square rounded-full bg-[#25a55f] overflow-hidden p-8">
                                <Heart width={"100%"} height={"100%"} />
                            </View>

                        </View>

                        <Text className="text-4xl w-full text-center font-['Bourton-inline'] text-[#25a55f]">Cadastro</Text>

                        <Text className="text-sm mb-5 text-[#25a55f] text-center w-full font-bold">Por favor insira os seus dados para o seu registro</Text>

                        <View className="border-b border-b-[#25a55f] border-solid w-full mb-5" />

                        <Controller
                            control={control}
                            name="name"
                            rules={
                                {
                                    required: 'Nome obrigatório',
                                    validate: {
                                        matchPattern: (v) => /^[a-zA-Z ]+$/.test(v),
                                    }
                                }
                            }
                            render={
                                ({ field, fieldState }) => {
                                    const [nameFocus, setNameFocus] = useState(false);
                                    let placeholderTextColor = nameFocus ? "#25a55f60" : "#00000060";

                                    if (fieldState.error) {
                                        placeholderTextColor = "#f0000060";
                                    }

                                    return (
                                        <View className="w-full mb-3">
                                            <Text className={`text-sm mb-1 ${nameFocus ? 'text-[#25a55f]' : 'text-black'} ${fieldState.error ? 'text-red-600' : ''}`}>Nome</Text>
                                            <TextInput
                                                className={`border border-solid px-2 py-2 rounded-md text-black border-black focus:border-[#25a55f] focus:text-[#25a55f] ${fieldState.error ? 'border-red-600' : ''} ${fieldState.error ? 'text-red-600' : ''}`}
                                                placeholder="João"
                                                placeholderTextColor={placeholderTextColor}
                                                value={field.value}
                                                onChangeText={field.onChange}
                                                onBlur={() => setNameFocus(false)}
                                                onFocus={() => setNameFocus(true)}
                                            />

                                            {
                                                fieldState.error && fieldState.error?.type == "required" && (
                                                    <Text className="text-xs text-red-600 font-bold ml-1">{fieldState?.error?.message}</Text>
                                                )
                                            }

                                            {
                                                fieldState.error && fieldState.error?.type == "matchPattern" && (
                                                    <Text className="text-xs text-red-600 font-bold ml-1">O nome deve conter apenas letras</Text>
                                                )
                                            }
                                        </View>
                                    )
                                }
                            }
                        />

                        <Controller
                            control={control}
                            name="lastName"
                            rules={{ required: false }}
                            render={
                                ({ field, fieldState }) => {
                                    const [lastNameFocus, setLastNameFocus] = useState(false);
                                    let placeholderTextColor = lastNameFocus ? "#25a55f60" : "#00000060";

                                    if (fieldState.error) {
                                        placeholderTextColor = "#f0000060";
                                    }

                                    return (
                                        <View className="w-full mb-3">
                                            <Text className={`text-sm mb-1 ${lastNameFocus ? 'text-[#25a55f]' : 'text-black'} ${fieldState.error ? 'text-red-600' : ''}`}>Sobrenome</Text>
                                            <TextInput
                                                className={`border border-solid px-2 py-2 rounded-md text-black border-black focus:border-[#25a55f] focus:text-[#25a55f] ${fieldState.error ? 'border-red-600' : ''} ${fieldState.error ? 'text-red-600' : ''}`}
                                                placeholder="Gomes da Silva"
                                                placeholderTextColor={placeholderTextColor}
                                                value={field.value}
                                                onChangeText={field.onChange}
                                                onBlur={() => setLastNameFocus(false)}
                                                onFocus={() => setLastNameFocus(true)}
                                            />

                                            {
                                                fieldState.error && (
                                                    <Text className="text-xs text-red-600 font-bold ml-1">{fieldState?.error?.message}</Text>
                                                )
                                            }
                                        </View>
                                    )
                                }
                            }
                        />

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

                        <Controller
                            control={control}
                            name="password"
                            rules={
                                {
                                    required: "Senha obrigatória",
                                }
                            }
                            render={
                                ({ field, fieldState }) => {
                                    const [passwordFocus, setPasswordFocus] = useState(false);
                                    let placeholderTextColor = passwordFocus ? "#25a55f60" : "#00000060";

                                    if (fieldState.error) {
                                        placeholderTextColor = "#f0000060";
                                    }

                                    return (
                                        <View className="w-full mb-3">
                                            <Text className={`text-sm mb-1 ${passwordFocus ? 'text-[#25a55f]' : 'text-black'} ${fieldState.error ? 'text-red-600' : ''}`}>Senha</Text>
                                            <TextInput
                                                className={`border border-solid px-2 py-2 rounded-md text-black border-black focus:border-[#25a55f] focus:text-[#25a55f] ${fieldState.error ? 'border-red-600' : ''} ${fieldState.error ? 'text-red-600' : ''}`}
                                                placeholder="********"
                                                placeholderTextColor={placeholderTextColor}
                                                value={field.value}
                                                onChangeText={field.onChange}
                                                onBlur={() => setPasswordFocus(false)}
                                                onFocus={() => setPasswordFocus(true)}
                                                secureTextEntry
                                            />

                                            {
                                                fieldState.error && fieldState.error?.type == "required" && (
                                                    <Text className="text-xs text-red-600 font-bold ml-1">{fieldState?.error?.message}</Text>
                                                )
                                            }
                                        </View>
                                    )
                                }
                            }
                        />

                        <TouchableOpacity className="w-full p-3 flex justify-center items-center rounded-md bg-white border border-black border-solid" onPress={handleSubmit(submitForm)}>

                            <Text className="text-black text-[20px] font-['Bourton-inline']">CADASTRAR-SE</Text>

                        </TouchableOpacity>


                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>

        </KeyboardAvoidingView>
    );
}

export default Register;