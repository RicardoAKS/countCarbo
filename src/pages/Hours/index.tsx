import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, Button, Text, TouchableOpacity, Modal, TextInput, ScrollView, Switch, RefreshControl, ActivityIndicator } from "react-native";
import { useAuth } from "../../contexts/auth";
import { Hour, HourCadastre } from "../../@types/app";
import Ionicons from 'react-native-vector-icons/Ionicons';
import TimeInput from "@tighten/react-native-time-input";
import { Controller, useForm } from "react-hook-form";
import MaskInput from 'react-native-mask-input'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import api from "../../services/api";
import { useFocusEffect } from "@react-navigation/native";
import colors from 'tailwindcss/colors';

const Times: React.FC = () => {
    const [hours, setHours] = useState<Hour[]>([]);
    const [hourEdit, setHourEdit] = useState<Hour | null>(null);

    const [refreshing, setRefreshing] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);

    const [loadMore, setLoadMore] = useState<boolean>(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalHourVisible, setModalHourVisible] = useState(false);

    const [maxCarbohydrate, setMaxCarbohydrate] = useState(null);

    const { control, handleSubmit, setValue, clearErrors, getValues } = useForm<HourCadastre>({
        mode: 'onChange'
    });

    const { user, setLoading, configCustomAlert } = useAuth();

    async function handleAddHour(values: HourCadastre) {

        setModalVisible(false);
        setLoading(true);

        setValue("hour", "");
        setValue("max_carbohydrate", null);
        setValue("min_carbohydrate", null);
        setValue("description", null);
        setValue("notification", false);

        try {
            
            let response = await api.post('/app/submitHour', values);

            if(response.data.response){
                let hour: Hour = {
                    id: response.data.response,
                    ...values
                }
        
                setHours(state => {
        
                    if (state.findIndex(item => item.id == hour.id) == -1) {
                        state.push(hour)
                    }
        
                    state.sort((a: Hour, b: Hour) => {
                        if (a.hour > b.hour) return -1;
                        if (a.hour < b.hour) return 1;
        
                        return 0;
                    })
        
                    return state;
                });
                setLoading(false);
            } else {
                configCustomAlert(
                    "Cadastro de Horário",
                    "Ocorreu algum erro inesperado, tente novamento mais tarde",
                    [
                        {
                            text: "OK",
                            onPress: () => {
    
                                configCustomAlert(null, null, null, null)
    
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
            }

        } catch (error) {

            console.log(error)
            if(error.response.status == 403 || error.response.status == 409){
                configCustomAlert(
                    "Cadastro de Horário",
                    error.response.data.message,
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                configCustomAlert(null, null, null, null);

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
                    "Cadastro de Horário",
                    "Ocorreu algum erro inesperado, tente novamento mais tarde",
                    [
                        {
                            text: "OK",
                            onPress: () => {
    
                                configCustomAlert(null, null, null, null)
    
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

            }

        }

    }

    async function handleEditHour(values: HourCadastre){
        
        setModalHourVisible(false);
        setHourEdit(null);
        setLoading(true);

        setValue("id", null);
        setValue("hour", "");
        setValue("max_carbohydrate", null);
        setValue("min_carbohydrate", null);
        setValue("description", null);
        setValue("notification", false);

        try {
            
            let response = await api.post('/app/editHour', values);

            if(response.data.response){
                let hour: Hour = {
                    id: values.id,
                    ...values
                }
        
                setHours(state => {
        
                    let index = state.findIndex(item => item.id == hour.id);
                    if (index == -1) {
                        state.push(hour)
                    } else {
                        state[index] = hour;
                    }
        
                    return state;
                });
                setLoading(false);
            } else {
                configCustomAlert(
                    "Cadastro de Horário",
                    "Ocorreu algum erro inesperado, tente novamento mais tarde",
                    [
                        {
                            text: "OK",
                            onPress: () => {
    
                                configCustomAlert(null, null, null, null)
    
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
            }

        } catch (error) {

            console.log(error)
            if(error.response.status == 403 || error.response.status == 409){
                configCustomAlert(
                    "Cadastro de Horário",
                    error.response.data.message,
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                configCustomAlert(null, null, null, null);

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
                    "Cadastro de Horário",
                    "Ocorreu algum erro inesperado, tente novamento mais tarde",
                    [
                        {
                            text: "OK",
                            onPress: () => {
    
                                configCustomAlert(null, null, null, null)
    
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

            }

        }
        
    }

    useEffect(() => {

        if (hourEdit) {

            setValue("id", hourEdit.id);
            setValue("hour", hourEdit.hour);
            setValue("min_carbohydrate", hourEdit.min_carbohydrate);
            setValue("max_carbohydrate", hourEdit.max_carbohydrate);
            setValue("description", hourEdit.description);
            setValue("notification", hourEdit.notification == 1 ? true : false);

            setModalHourVisible(true);
        } else {
            setModalHourVisible(false);
        }

    }, [hourEdit])

    async function getHours(pageNumber){

        return new Promise(async (resolve, reject) => {

            setLoading(true);
            try {
                let response = await api.post('/app/getHours', {
                    page: pageNumber
                });

                resolve(response.data);
            } catch (error) {
                reject(error)
            }

        })

    }

    useFocusEffect(useCallback(() => {

        if(!refreshing){
            getHours(page)
            .then((response) => {
                setTotalPages(response["total_pages"]);
                setHours(response["hours"]);
                setLoading(false);
                setLoadMore(false);
            })
            .catch((error) => console.log(error))
        }

    }, [page]))

    useFocusEffect(useCallback(() => {

        if(refreshing){
            setLoadMore(false);
            getHours(1)
            .then((response) => {

                console.log(response)
                setRefreshing(false);
                setTotalPages(response["total_pages"]);
                setHours(response["hours"]);
                setLoading(false);
            })
            .catch((error) => console.log(error))
        }

    }, [refreshing]))

    const onRefresh = useCallback(() => {

        setLoadMore(false);
        setRefreshing(true);
        setPage(1);
        getHours(1)
        .then((response) => {
            setRefreshing(false);
            setTotalPages(response["total_pages"]);
            setHours(response["hours"]);
            setLoading(false);
        })
        .catch((error) => console.log(error))

    }, [])

    const isCloseBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 5;

        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    }

    return (
        <ScrollView 
            className="w-full h-full pb-20 bg-[#25a55f]" 
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onScroll={
                ({ nativeEvent }) => {
                    if(isCloseBottom(nativeEvent)){

                        if(page <= totalPages){
                            setLoadMore(true);
                            setPage(page + 1);
                        }

                    }
                }
            }
            scrollEventThrottle={400}
        >

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

                                <TouchableOpacity 
                                    className="rounded-md bg-[#fff] px-2 py-2 mt-3 flex flex-row justify-center items-center" 
                                    onPress={
                                        () => {
                                            setValue("hour", "");
                                            setValue("max_carbohydrate", null);
                                            setValue("min_carbohydrate", null);
                                            setValue("description", null);
                                            setValue("notification", false);

                                            setModalVisible(true)
                                        }
                                    }
                                >
                                    <Ionicons name="add-outline" size={20} color={"#25a55f"} />
                                    <FontAwesome5 name="user-clock" size={25} color={"#25a55f"} />
                                </TouchableOpacity>
                            </View>
                        )
                }

                {
                    hours.map((hour: Hour, index: number) => {

                        return (
                            <View className="w-full border-b border-[#00000050] py-2" key={index}>
                                <View className="w-full flex flex-row flex-wrap justify-between items-center">

                                    <View className="w-1/2 flex flex-row flex-wrap justify-start items-start">
                                        <Text className="text-3xl text-white font-['Bourton-inline']">
                                            {hour.hour}
                                        </Text>

                                        {(hour.notification === true || hour.notification === 1 || hour.notification === "1") && (
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

                                    <Text numberOfLines={3} className="w-3/4 text-lg text-white text-justify">{hour.description}</Text>

                                    <View className="w-1/4 flex justify-center items-center">

                                        <TouchableOpacity className="bg-white rounded-lg flex justify-center items-center px-3 py-2" onPress={() => setHourEdit(hour)}>
                                            <FontAwesome5 name="pencil-alt" size={20} color={"#25a55f"} />
                                        </TouchableOpacity>

                                    </View>

                                </View>
                            </View>
                        )
                    })
                }

                {
                    hours.length > 0 && loadMore && (
                        <View className='flex-1 justify-center items-center bg-[#25a55f] w-full py-5 z-50'>
                            <ActivityIndicator size={"large"} color={colors.white} />
                        </View>
                    )
                }
            </View>

            <Modal
                animationType="fade"
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false)
                }}
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
                                                    value={field.value ? true : false}
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
                                                        value={`${field.value ? field.value : ''}`.replace(/[^0-9]/g, "")}
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
                onRequestClose={
                    () => {
                        setModalHourVisible(false);
                        setHourEdit(null);
                    }
                }
                transparent={true}
            >

                <ScrollView className="w-full h-full bg-[#00000090]">
                    <View className="w-full h-full items-center px-8 py-10 relative">

                        <View className="fixed w-full bg-white rounded-md flex flex-row flex-wrap justify-center items-center px-3 py-2 z-20">

                            <View className="w-full items-end">
                                <TouchableOpacity onPress={
                                    () => {
                                        setHourEdit(null);
                                        setModalHourVisible(false)
                                    }
                                }>
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
                                                    value={field.value ? true : false}
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
                                                        value={`${field.value ? field.value : ''}`.replace(/[^0-9]/g, "")}
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
                                    onPress={handleSubmit(handleEditHour)}
                                >
                                    <Text className="text-[#fff] font-['Bourton-inline'] text-[20px]">ATUALIZAR</Text>
                                </TouchableOpacity>

                            </View>

                        </View>

                    </View>
                </ScrollView>

            </Modal>

        </ScrollView >
    );
};

export default Times;