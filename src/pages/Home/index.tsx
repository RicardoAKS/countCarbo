import React from 'react';
import { useFonts } from 'expo-font';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { ImageBackground, TouchableOpacity, Text, View } from 'react-native';

const Home: React.FC<NativeStackHeaderProps> = ({ navigation }) => {

    return (
        <ImageBackground source={require("../../../assets/backgrounds/home.jpg")} className="flex-1 items-center px-5 relative pt-10">

            <View className="absolute top-0 bottom-0 left-0 right-0 bg-[#00000060]" />

            <View className="h-1/2 flex justify-end items-center">
                <View className="flex justify-center items-center bg-[#ffffff80] border-white border border-solid rounded-3xl px-3 py-5 ">

                    <Text className="font-['Bourton-inline'] text-[60px]">COUNT</Text>
                    <Text className="font-['Bourton-inline'] text-[50px]">CARBO</Text>

                </View>
            </View>

            <View className="w-full h-1/2 flex justify-end items-center">
                <TouchableOpacity
                    className="w-full bg-white p-3 justify-center items-center rounded-md mb-3"
                    onPress={() => navigation.navigate("Register")}
                >

                    <Text className="text-[#000] font-['Bourton-inline'] text-[20px]">CADASTRAR-SE</Text>

                </TouchableOpacity>

                <TouchableOpacity
                    className="w-full bg-white p-3 justify-center items-center rounded-md mb-[14.5%]"
                    onPress={() => navigation.navigate("SignIn")}
                >

                    <Text className="text-[#000] font-['Bourton-inline'] text-[20px]">ENTRAR</Text>
                    
                </TouchableOpacity>
            </View>

        </ImageBackground>
    );
}

export default Home;