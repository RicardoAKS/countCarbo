import React from "react";
import { View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from "react-native";
import { useFonts } from 'expo-font';
import { useAuth } from "../../contexts/auth";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useForm, Controller } from "react-hook-form";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";

import Logo from '../../../assets/svgs/logo.svg';
import { LoginForm } from "../../@types/app";

const SignIn: React.FC<NativeStackHeaderProps> = ({ navigation }) => {
    const { control, handleSubmit } = useForm<LoginForm>({
        mode: 'onChange',
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const { signIn } = useAuth();

    async function handleSignIn(values: LoginForm) {
        signIn(values.email, values.password)
            .catch((error) => {
                navigation.navigate("SignIn");
            })
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} className="flex items-center px-4 bg-[#25a55f] w-full h-full pt-10 pb-5">

            <TouchableWithoutFeedback
                className="w-full h-full"
                onPress={() => Keyboard.dismiss()}
            >

                <View className="w-full h-full items-center pb-10">

                    <View className="w-full h-1/2 flex justify-between items-start mb-10">

                        <TouchableOpacity
                            className="bg-white rounded-full p-2"
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" color="#25a55f" size={20} />
                        </TouchableOpacity>

                        <View className="justify-center items-center flex w-full">
                            <View className="w-1/2 aspect-square bg-white rounded-3xl">
                                <Logo width={"100%"} height={"100%"} />
                            </View>
                        </View>
                    </View>

                    <View className="h-1/2 w-full justify-end items-center flex bg-[#25a55f]">

                        <View className="bg-[#25a55f] w-full justify-end items-center flex">
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
                                        let placeholderTextColor = "#ffffff60";

                                        if (fieldState.error) {
                                            placeholderTextColor = "#f0000060";
                                        }

                                        return (
                                            <View className="w-full mb-3">
                                                <TextInput
                                                    className={`rounded-md border bg-[#25a55f] border-white border-solid w-full p-2 text-white ${fieldState.error ? 'border-red-600' : ''} ${fieldState.error ? 'text-red-600' : ''}`}
                                                    placeholder="E-mail"
                                                    placeholderTextColor={placeholderTextColor}
                                                    value={field.value}
                                                    onChangeText={field.onChange}
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
                                        required: "Senha obrigatória"
                                    }
                                }
                                render={
                                    ({ field, fieldState }) => {
                                        let placeholderTextColor = "#ffffff60";

                                        if (fieldState.error) {
                                            placeholderTextColor = "#f0000060";
                                        }

                                        return (
                                            <View className="w-full">

                                                <TextInput
                                                    className={`rounded-md border bg-[#25a55f] border-white border-solid w-full p-2 text-white ${fieldState.error ? 'border-red-600' : ''} ${fieldState.error ? 'text-red-600' : ''}`}
                                                    placeholder="Senha"
                                                    placeholderTextColor={placeholderTextColor}
                                                    value={field.value}
                                                    onChangeText={field.onChange}
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

                            <TouchableOpacity
                                className="w-full py-3 flex justify-center items-center bg-white mt-3 rounded-md"
                                onPress={handleSubmit(handleSignIn)}
                            >
                                <Text className="text-[#000] font-['Bourton-inline'] text-[20px]">ENTRAR</Text>
                            </TouchableOpacity>

                            <Text className="text-white mt-3" onPress={
                                () => navigation.navigate("ForgetPassword")
                            }
                            >Esqueci minha senha</Text>

                        </View>

                    </View>

                </View>

            </TouchableWithoutFeedback>

        </KeyboardAvoidingView>
    );
};

export default SignIn;