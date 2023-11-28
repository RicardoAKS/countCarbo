import React, { useState, useEffect, useCallback, useRef } from "react";
import { TouchableOpacity, View, Modal, Text, TextInput, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { useAuth } from "../contexts/auth";
import { FontAwesome5, Ionicons } from 'react-native-vector-icons';
import { ApiFoodResponse, Food } from "../@types/app";
import api from "../services/api";
import ItemFood from "../components/ItemFood";
import { useFocusEffect } from "@react-navigation/native";
import { SelectList } from 'react-native-dropdown-select-list'

interface ModalSelectFoodsProps {
    addFoodModal: boolean,
    onRequestClose: () => void
}

export interface CategoriesType {
    id: number;
    name: string;
}

var timeout;
const ModalSelectFoods: React.FC<ModalSelectFoodsProps> = ({ addFoodModal, onRequestClose }) => {
    const [foods, setFoods] = useState<Food[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(true);

    const [totalPage, setTotalPage] = useState<number>(1);
    const [page, setPage] = useState<number>(1);

    const [category, setCategory] = useState<number | null>();
    const [categoryOld, setCategoryOld] = useState<number | null>();
    const [categories, setCategories] = useState<CategoriesType[]>([]);

    const [search, setSearch] = useState<string>("");

    const [loading2, setLoading2] = useState<boolean>(true);

    const { user, setLoading, configCustomAlert } = useAuth();

    const foodRefs = useRef([]);

    const getFoods = (searchString: string, pageNumber: number, categoryNumber: null | number) => new Promise(async (resolve, reject) => {

        if (categoryNumber == null) resolve({
            "total_pages": 0,
            "count": 0,
            "foods": []
        });

        try {
            let response = await api.post('/app/searchFoods', {
                authorization: api.defaults.headers['Authorization'],
                search: searchString,
                page: pageNumber,
                categoryId: categoryNumber
            });

            if (response.data) {
                resolve(response.data);
            }

        } catch (error) {
            reject(error)
        }
    })

    const getAllCategories = () => new Promise(async (resolve, reject) => {
        try {
            let response = await api.post('/app/getCategoryFoods', {
                authorization: api.defaults.headers['Authorization']
            });

            if (response.data) {
                resolve(response.data);
            }

        } catch (error) {
            reject(error)
        }
    })

    const onRefresh = useCallback(() => {

        setPage(1);
        setSearch("");

        getFoods("", 1, category)
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

    }, [])

    useEffect(() => {

        if (!refreshing) {
            clearTimeout(timeout);

            timeout = setTimeout(async () => {

                setLoading2(true);
                getFoods(search, page, category)
                    .then((res: ApiFoodResponse) => {

                        setTotalPage(res.total_pages);
                        setFoods(state => res.foods)
                        setLoading2(false);
                    })
                    .catch(err => {
                        setLoading2(false);
                        console.log(err)
                    });

            }, 1000);
        }

    }, [search]);

    useEffect(() => {

        if (!refreshing && category && page > 1 && page <= totalPage) {
            setLoading2(true);
            getFoods(search, page, category)
                .then((res: ApiFoodResponse) => {
                    setTotalPage(res.total_pages);

                    if(category == categoryOld){
                        setFoods(state => [...state, ...res.foods])
                    } else {
                        setCategoryOld(category)
                        setFoods(res.foods);
                    }

                    setLoading2(false);
                })
                .catch(err => {
                    setLoading2(false);
                    console.log(err)
                });
        }

    }, [page]);

    useEffect(() => {

        setLoading2(true);
        getFoods(search, page, category)
            .then((res: ApiFoodResponse) => {
                setTotalPage(res.total_pages);
                if(category == categoryOld){
                    setFoods(state => [...state, ...res.foods])
                } else {
                    setCategoryOld(category)
                    setFoods(res.foods);
                }
                setLoading2(false);
            })
            .catch(err => {
                setLoading2(false);
                console.log(err)
            });

    }, [category])

    useFocusEffect(useCallback(() => {

        setLoading2(true);
        getAllCategories()
            .then((categories: CategoriesType[]) => {
                setRefreshing(false);
                setLoading2(false);
                setCategories(categories)
            })
            .catch((err) => console.log(err))

        if (refreshing) {
            setPage(1);
            setSearch("");
        }

    }, [refreshing]))

    const handleAdd = async () => {

        let foodIds = [];
        for(let foodRef of foodRefs.current){

            if(foodRef){
                let foodId = foodRef.returnData();
                if(foodId){
                    foodIds.push(foodId);
                }
            }

        }

        if(foodIds.length > 0){

            setLoading(true)
            api.post('/app/addFoodDiet', {
                "authorization": api.defaults.headers['Authorization'],
                "foodsId": foodIds
            })
            .then(() => {
                setLoading(false);
                onRequestClose();
                setCategory(null);
                setSearch("");
                setPage(1);
            })
            .catch((err) => {
                console.log(err);

                setLoading(false);
                configCustomAlert(
                    "Adicionar na dieta",
                    "Ocorreu algum erro inesperado ao tentar adicionar a sua dieta, tente novamento mais tarde",
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
            })

        } else {

            configCustomAlert(
                "Adicionar na dieta",
                "Selecione pelo menos um alimento para adicionar a dieta",
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

    }

    return (
        <Modal
            animationType="fade"
            visible={addFoodModal}
            onRequestClose={() => onRequestClose()}
            transparent={true}
        >
            <TouchableOpacity activeOpacity={1} onPress={() => onRequestClose()} className="absolute bottom-0 top-0 left-0 right-0 z-0 bg-[#00000070]"></TouchableOpacity>

            <View className="w-full flex-1 px-8 py-9 flex flex-wrap flex-col justify-between">

                <View className="rounded-lg bg-white px-3 py-5 pb-20 w-full h-full flex flex-wrap flex-row overflow-hidden">

                    <View className="w-full">

                        <Text className="text-base font-bold">Pesquisar</Text>
                        <TextInput className="w-full rounded-md bg-gray-300 px-2 py-1" placeholder="Ex: Maça" value={search} onChangeText={setSearch} />

                    </View>

                    <View className="w-full mt-2">
                        <SelectList
                            setSelected={(val) => setCategory(val)}
                            data={categories.map((item) => { return { key: item.id, value: item.name } })}
                            save="key"
                            placeholder="Selecione uma categoria"
                        />
                    </View>

                    <View className="w-full">
                        <TouchableOpacity className="rounded-lg px-3 py-2 bg-[#25a55f] flex flex-row flex-wrap justify-center items-center mt-2" onPress={() => handleAdd()}>
                            <Text className="text-base text-white font-bold">ADICIONAR NA DIETA</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="w-full h-[80%]">
                        <ScrollView
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                            className="w-full h-full mt-2"
                        >

                            <View className="w-full flex flex-wrap flex-row">
                                {
                                    foods.map((food: Food, i: number) => <ItemFood food={food} key={i} ref={ref => foodRefs.current[i] = ref} longPress={false} css="w-1/3" />)
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

                        </ScrollView>
                    </View>

                </View>

            </View>
        </Modal>
    );
};

export default ModalSelectFoods;