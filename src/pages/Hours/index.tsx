import React, { useContext, useEffect, useState } from "react";
import { View, Button, Text, TouchableOpacity, Modal, TextInput, ScrollView, Switch } from "react-native";
import { useAuth } from "../../contexts/auth";
import { Hour, HourCadastre } from "../../@types/app";
import Ionicons from 'react-native-vector-icons/Ionicons';
import TimeInput from "@tighten/react-native-time-input";
import { Controller, useForm } from "react-hook-form";
import MaskInput from 'react-native-mask-input'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Times: React.FC = () => {
    const [hours, setHours] = useState<Hour[]>([]);
    const [hour, setHour] = useState<Hour | null>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalHourVisible, setModalHourVisible] = useState(false);

    const [maxCarbohydrate, setMaxCarbohydrate] = useState(null);

    const { control, handleSubmit, setValue, clearErrors, getValues } = useForm<HourCadastre>({
        mode: 'onChange'
    });

    const { user, setLoading } = useAuth();

    async function handleAddHour(values: HourCadastre) {

        setModalVisible(false);
        setLoading(true);

        setValue("hour", "");
        setValue("max_carbohydrate", null);
        setValue("min_carbohydrate", null);
        setValue("description", null);
        setValue("notification", false);

        let hour: Hour = {
            id: 1,
            users_id: 1,
            ...values
        }

        setHours(state => {

            if (state.findIndex(item => item.hour == hour.hour) == -1) {
                state.push(hour)
            }

            state.sort((a: Hour, b: Hour) => {
                if (a.hour > b.hour) return 1;
                if (a.hour < b.hour) return -1;

                return 0;
            })

            return state;
        });
        setLoading(false)
    }

    useEffect(() => {

        if (hour) {
            setModalHourVisible(true);
        } else {
            setModalHourVisible(false);
        }

    }, [hour])

    return (
        <ScrollView className="w-full h-full pb-20 bg-[#25a55f]">

            <View className="w-full h-full items-center pt-8 px-5">

                {
                    hours.length == 0 ?
                        (
                            <View className="rounded-md w-full aspect-video shadow-2xl bg-white items-center justify-center py-2 px-3">
                                <Text className="text-2xl font-bold">Olá {user.name}</Text>
                                <View className="w-full border border-[#00000050] rounded my-2" />
                                <Text className="text-lg text-center mx-3">Você não tem nenhum horário {"\n"} Se você gostaria de adicionar {"\n"} É só clicar abaixo</Text>
                                <TouchableOpacity className="rounded-md bg-[#25a55f] px-5 py-1 mt-3 flex flex-row justify-center items-center" onPress={() => setModalVisible(true)}>
                                    <Ionicons name="add-outline" size={25} color={"#ffff"} />
                                </TouchableOpacity>
                            </View>
                        )
                        :
                        (
                            <View className="w-full flex flex-row flex-wrap justify-end">

                                <TouchableOpacity className="rounded-md bg-[#fff] px-4 py-2 mt-3 flex flex-row justify-center items-center mx-2">
                                    <Ionicons name="add-outline" size={20} color={"#25a55f"} />
                                    <FontAwesome5 name="utensils" size={25} color={"#25a55f"} />
                                </TouchableOpacity>

                                <TouchableOpacity className="rounded-md bg-[#fff] px-2 py-2 mt-3 flex flex-row justify-center items-center" onPress={() => setModalVisible(true)}>
                                    <Ionicons name="add-outline" size={20} color={"#25a55f"} />
                                    <FontAwesome5 name="user-clock" size={25} color={"#25a55f"} />
                                </TouchableOpacity>
                            </View>
                        )
                }

                {
                    hours.map((hour: Hour, index: number) => {

                        return (
                            <TouchableOpacity className="w-full border-b border-[#00000050] py-2" key={index} onPress={() => setHour(hour)}>
                                <View className="w-full flex flex-row flex-wrap justify-between items-center">

                                    <View className="w-1/2 flex flex-row flex-wrap justify-start items-start">
                                        <Text className="text-3xl text-white font-['Bourton-inline']">
                                            {hour.hour}
                                        </Text>

                                        {hour.notification && (
                                            <Text className="text-white font-['Bourton-inline'] pt-1 pl-1">
                                                <Ionicons name="notifications-sharp" size={18} color={"#fff"} />
                                            </Text>
                                        )}
                                    </View>

                                    {
                                        hour.min_carbohydrate && hour.max_carbohydrate && (
                                            <View className="flex flex-row flex-wrap w-1/2 px-2">
                                                <Text className="text-gray-200 text-base w-full text-right">Carboidratos</Text>
                                                <View className="flex flex-row flex-wrap w-full justify-end">
                                                    <Text className="text-white">{hour.min_carbohydrate} - {hour.max_carbohydrate}</Text>
                                                </View>
                                            </View>
                                        )
                                    }

                                    <Text numberOfLines={3} className="w-full text-lg text-white text-justify">{hour.description}</Text>

                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>

            <Modal
                animationType="fade"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                transparent={true}
            >

                <ScrollView className="w-full h-full bg-[#00000090]">
                    <View className="w-full h-full items-center px-8 py-10 relative">

                        <View className="fixed w-full bg-white rounded-md flex flex-row flex-wrap justify-center items-center px-3 py-2 z-20">

                            <View className="w-full items-end">
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Ionicons name="close-sharp" size={25} color={"#000"} />
                                </TouchableOpacity>
                            </View>

                            <Text className="text-5xl font-['Bourton-inline']">Horário</Text>
                            <View className="w-full border border-[#00000050] rounded my-2" />

                            <Controller
                                control={control}
                                name="hour"
                                rules={
                                    {
                                        required: "Hora inválida",
                                        validate: {
                                            matchPattern: (v) => /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(v),
                                        }
                                    }
                                }
                                render={
                                    ({ field, fieldState }) => {

                                        return (
                                            <View className="w-2/3 pr-2">

                                                <View className="w-full flex flex-row flex-wrap">
                                                    <Text className="text-lg text-gray-500 font-bold">Horário</Text><Text className="text-red-600 font-bold">*</Text>
                                                </View>
                                                <MaskInput
                                                    value={field.value}
                                                    onChangeText={field.onChange}
                                                    mask={[/[0-9]/, /[0-9]/, ':', /[0-9]/, /[0-9]/]}
                                                    className={`rounded-md border border-black border-solid w-full p-2 text-black ${fieldState.error ? 'border-red-600' : ''} ${fieldState.error ? 'text-red-600' : ''}`}
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

                            <Controller
                                control={control}
                                name="notification"
                                render={
                                    ({ field, fieldState }) => {

                                        return (
                                            <View className="w-1/3 flex justify-center items-start">

                                                <View className="w-full flex flex-row flex-wrap">
                                                    <Text className="text-lg text-gray-500 font-bold">Notificação</Text>
                                                </View>
                                                <Switch
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    trackColor={{ false: '#767577', true: '#25a55f' }}
                                                    thumbColor={field.value ? '#25a55f' : '#f4f3f4'}
                                                />

                                            </View>
                                        )
                                    }
                                }
                            />

                            <View className="w-full flex flex-row flex-wrap">

                                <View className="w-full">
                                    <Text className="text-gray-500 text-lg font-bold">Carboidratos</Text>
                                </View>

                                <Controller
                                    control={control}
                                    name="min_carbohydrate"
                                    rules={
                                        {
                                            maxLength: 11,
                                            min: 0,
                                            max: maxCarbohydrate ? maxCarbohydrate : 0
                                        }
                                    }
                                    render={
                                        ({ field, fieldState }) => {

                                            return (
                                                <View className="w-1/2 pr-1">

                                                    <Text className="text-sm text-gray-500">Minimo</Text>
                                                    <TextInput
                                                        value={`${field.value ? field.value : ''}`}
                                                        placeholder="0"
                                                        onChangeText={field.onChange}
                                                        className={`rounded-md border border-black border-solid w-full p-2 text-black ${fieldState.error ? 'border-red-600' : ''} ${fieldState.error ? 'text-red-600' : ''}`}
                                                    />

                                                </View>
                                            )
                                        }
                                    }
                                />

                                <Controller
                                    control={control}
                                    name="max_carbohydrate"
                                    rules={
                                        {
                                            maxLength: 11,
                                            min: 0
                                        }
                                    }
                                    render={
                                        ({ field, fieldState }) => {

                                            return (
                                                <View className="w-1/2 pl-1">

                                                    <Text className="text-sm text-gray-500">Máximo</Text>
                                                    <TextInput
                                                        value={`${field.value ? field.value : ''}`.replace(/[^0-9]/g, "")}
                                                        placeholder="0"
                                                        onChangeText={
                                                            (text) => {
                                                                field.onChange(text)
                                                                setMaxCarbohydrate(text);

                                                                if (getValues("min_carbohydrate") <= Number(text.replace(/[^0-9]/g, ""))) {
                                                                    clearErrors("min_carbohydrate")
                                                                }
                                                            }
                                                        }
                                                        className={`rounded-md border border-black border-solid w-full p-2 text-black ${fieldState.error ? 'border-red-600' : ''} ${fieldState.error ? 'text-red-600' : ''}`}
                                                    />

                                                </View>
                                            )
                                        }
                                    }
                                />

                                <Controller
                                    control={control}
                                    name="description"
                                    render={
                                        ({ field, fieldState }) => {

                                            return (
                                                <View className="w-full">

                                                    <View className="w-full flex flex-row flex-wrap">
                                                        <Text className="text-lg text-gray-500 font-bold">Descrição</Text>
                                                    </View>
                                                    <TextInput
                                                        value={field.value}
                                                        onChangeText={field.onChange}
                                                        multiline
                                                        className={`rounded-md border aspect-[16/6] border-black border-solid w-full p-2 text-black ${fieldState.error ? 'border-red-600' : ''} ${fieldState.error ? 'text-red-600' : ''}`}
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
                                    className="w-full py-3 flex justify-center items-center bg-[#25a55f] mt-3 rounded-md"
                                    onPress={handleSubmit(handleAddHour)}
                                >
                                    <Text className="text-[#fff] font-['Bourton-inline'] text-[20px]">SALVAR</Text>
                                </TouchableOpacity>

                            </View>

                        </View>

                    </View>
                </ScrollView>

            </Modal>

            <Modal
                animationType="fade"
                visible={modalHourVisible}
                onRequestClose={() => setModalHourVisible(false)}
                transparent={true}
            >
                <ScrollView className="w-full h-full bg-[#00000090]">

                    <View className="w-full h-full items-center px-8 py-10 relative">

                        <View className="fixed w-full bg-white rounded-md flex flex-row flex-wrap justify-center items-center px-3 py-2 z-20">

                            <View className="w-full items-end">
                                <TouchableOpacity onPress={() => setHour(null)}>
                                    <Ionicons name="close-sharp" size={25} color={"#000"} />
                                </TouchableOpacity>
                            </View>

                            <View className="w-1/2 flex flex-row flex-wrap">
                                <Text className="text-5xl font-['Bourton-inline'] text-[#25a55f]">{hour?.hour}</Text>
                                {hour?.notification && (
                                    <Text className="text-white font-['Bourton-inline'] pt-1 pl-1">
                                        <Ionicons name="notifications-sharp" size={20} color={"#25a55f"} />
                                    </Text>
                                )}
                            </View>

                            <View className="w-1/2 flex flex-row flex-wrap">
                                {
                                    hour?.min_carbohydrate && hour?.max_carbohydrate && (
                                        <>
                                            <Text className="text-[#25a55f] text-lg font-bold w-full text-right">Carboidratos</Text>
                                            <View className="flex flex-row flex-wrap w-full justify-end">
                                                <Text className="text-[#25a55f] text-base font-semibold">{hour?.min_carbohydrate} - {hour?.max_carbohydrate}</Text>
                                            </View>
                                        </>
                                    )
                                }
                            </View>

                        </View>

                    </View>

                </ScrollView>
            </Modal>

        </ScrollView >
    );
};

export default Times;