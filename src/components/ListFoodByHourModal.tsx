import React, { useCallback, useState, useEffect } from 'react';
import { View, Modal, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Text, ImageBackground } from "react-native";
import api from "../services/api";
import { ApiFoodResponse, Food } from '../@types/app';
import { ModalFood } from './ModalFood';

interface ModalFoodProps {
    visible: boolean;
    onRequestClose: () => void;
    hourId: string|number;
}

const ListFoodByHourModal: React.FC<ModalFoodProps> = ({ visible, onRequestClose, hourId }) => {
    const [foods, setFoods] = useState<Food[]>([]);
    const [food, setFood] = useState<Food | null>(null);
    const [foodModalVisible, setFoodModalVisible] = useState<boolean>(false);

    const [refreshing, setRefreshing] = useState<boolean>(true);

    const [totalPage, setTotalPage] = useState<number>(1);
    const [page, setPage] = useState<number>(1);

    const [loading2, setLoading2] = useState<boolean>(true);

    const getFoods = (pageNumber: number) => new Promise((resolve, reject) => {
        api.post('app/getFoodsByHourId', {
            hourId: hourId,
            page: pageNumber
        })
            .then((response) => resolve(response.data))
            .catch(err => reject(err));
    })

    const onRefresh = useCallback(() => {

        setRefreshing(true);
        setPage(1);

    }, [])

    useEffect(() => {

        if(!refreshing && page > 1 && page <= totalPage){
            getFoods(1)
            .then((res: ApiFoodResponse) => {

                setRefreshing(false);
                setTotalPage(res.total_pages);
                setFoods(res.foods)
                setLoading2(false);
            })
            .catch(err => {
                setLoading2(false);
                console.log(err)
            });
        }

    }, [page])

    useEffect(() => {

        if(refreshing){
            getFoods(1)
            .then((res: ApiFoodResponse) => {

                setRefreshing(false);
                setTotalPage(res.total_pages);
                setFoods(res.foods)
                setLoading2(false);
            })
            .catch(err => {
                setLoading2(false);
                console.log(err)
            });
        }

    }, [refreshing])

    return <Modal
        visible={visible}
        onRequestClose={() => onRequestClose()}
        transparent
    >

        <TouchableOpacity activeOpacity={1} onPress={() => onRequestClose()} className="absolute bottom-0 top-0 left-0 right-0 z-0 bg-[#00000070]"></TouchableOpacity>

        <View className="w-full flex-1 px-8 py-9 flex flex-wrap flex-col justify-between">

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                className='w-full h-full bg-white rounded-lg p-2'
            >

                <View className='w-full flex flex-row flex-wrap'>
                    {
                        foods.map((food: Food, i) => {

                            return (
                                <TouchableOpacity
                                    className="w-1/3 overflow-hidden p-1"
                                    key={i}
                                    onPress={
                                        () => {
                                            setFood(food);
                                            setFoodModalVisible(true);
                                        }
                                    }
                                >
                                    <View className='w-full rounded-lg border-2'>
                                        <ImageBackground source={{ uri: `${api.defaults.baseURL}/assets/img/food/${food.id}/${food.images[0].name}` }} imageStyle={{ width: "100%", height: "100%", resizeMode: "cover" }} className="w-full aspect-square z-10 rounded-lg overflow-hidden flex flex-row flex-wrap relative"></ImageBackground>
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    }

                    {
                        foods.length == 0 && !refreshing && (
                            <Text className='text-lg text-center font-bold'>Nenhum alimento se encaixou com o horário configurado</Text>
                        )
                    }
                </View>

                {
                    loading2 && (
                        <View className="w-full flex flex-row flex-wrap justify-center items-center mt-5">
                            <ActivityIndicator size="large" color={"#25a55f"} />
                        </View>
                    )
                }

                {
                    page < totalPage && (
                        <View className="w-full">
                            <TouchableOpacity className="rounded-lg px-3 py-2 bg-[#25a55f] flex flex-row flex-wrap justify-center items-center mt-2" onPress={() => setPage(page + 1)}>
                                <Text className="text-base text-white font-bold">CARREGAR MAIS</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }

                {
                    food && (
                        <ModalFood
                            food={food}
                            visible={foodModalVisible}
                            onRequestClose={() => {
                                setFoodModalVisible(false);
                                setFood(null);
                            }}
                        />
                    )
                }

            </ScrollView>

        </View>

    </Modal>
}

export { ListFoodByHourModal };