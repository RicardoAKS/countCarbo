import React, { useState, useEffect, useCallback, useRef } from "react";
import { TouchableOpacity, View, Modal, Text, TextInput, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { useAuth } from "../../contexts/auth";
import { FontAwesome5, Ionicons, MaterialIcons } from 'react-native-vector-icons';
import { ApiFoodResponse, Food } from "../../@types/app";
import api from "../../services/api";
import ItemFood from "../../components/ItemFood";
import { useFocusEffect } from "@react-navigation/native";
import ModalSelectFoods, { CategoriesType } from "../../components/ModalSelectFoods";
import { SelectList } from "react-native-dropdown-select-list";

var timeout;
const Diet: React.FC = () => {
    const [foods, setFoods] = useState<Food[]>([]);
    const [addFoodModal, setAddFoodModal] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(true);

    const [totalPage, setTotalPage] = useState<number>(1);

    const [search, setSearch] = useState<string>("");
    const [page, setPage] = useState<number>(1);

    const [loading2, setLoading2] = useState<boolean>(true);

    const [category, setCategory] = useState<number | null>();
    const [categoryOld, setCategoryOld] = useState<number | null>();
    const [categories, setCategories] = useState<CategoriesType[]>([]);

    const { user, setLoading, configCustomAlert } = useAuth();

    const foodRefs = useRef([]);

    const [showSearch, setShowSearch] = useState<boolean>(false);

    const getFoods = (searchString: string, pageNumber: number) => new Promise(async (resolve, reject) => {
        try {

            let data = {
                search: searchString,
                page: pageNumber
            }

            if(category > 0){
                data["categoryId"] = category;
            }

            console.log(data)

            let response = await api.post('/app/getDiet', data);

            if (response.data) {
                resolve(response.data);
            }

        } catch (error) {
            reject(error)
        }
    })

    const getAllCategories = () => new Promise(async (resolve, reject) => {
        try {
            let response = await api.post('/app/getCategoryFoods');

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

        getFoods("", 1)
            .then((res: ApiFoodResponse) => {

                setRefreshing(false);
                setTotalPage(res.total_pages);
                setFoods(res.foods)
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
                getFoods(search, page)
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

        if (!refreshing && page > 1 && page <= totalPage) {
            setLoading2(true);
            getFoods(search, page)
                .then((res: ApiFoodResponse) => {
                    setTotalPage(res.total_pages);
                    setFoods(state => [...state, ...res.foods])
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
        getFoods(search, page)
            .then((res: ApiFoodResponse) => {
                setTotalPage(res.total_pages);
                setFoods(state => res.foods)
                setLoading2(false);
            })
            .catch(err => {
                setLoading2(false);
                console.log(err)
            });

    }, [category]);

    useFocusEffect(useCallback(() => {

        if (refreshing) {
            setPage(1);
            setSearch("");

            setLoading2(true);
            getFoods("", 1)
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

    }, [refreshing]))

    useEffect(() => {

        getAllCategories()
            .then((categories: CategoriesType[]) => {
                setCategories(categories)
            })
            .catch((err) => console.log(err))

    }, [])

    const handleAdd = async () => {

        let foodIds = [];
        for (let foodRef of foodRefs.current) {

            if (foodRef) {
                let foodId = foodRef.returnData();
                if (foodId) {
                    foodIds.push(foodId);
                }
            }

        }

        if (foodIds.length > 0) {

            setLoading(true)
            api.post('/app/removeFoodDiet', {
                "foodsId": foodIds
            })
                .then(() => {
                    setLoading(false);
                    getFoods(search, page)
                        .then((res: ApiFoodResponse) => {

                            setTotalPage(res.total_pages);
                            setFoods(res.foods);
                            setLoading2(false);
                        })
                        .catch(err => {
                            setLoading2(false);
                            console.log(err)
                        });
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
        <View className="flex flex-wrap flex-row items-center justify-center bg-[#25a55f] w-full h-full pt-10 px-2">

            <View className="w-full flex flex-wrap flex-row items-center">

                <View className="w-full flex flex-wrap flex-row">
                    <TouchableOpacity className="rounded-md bg-[#fff] px-4 py-2 mt-3 flex flex-row justify-center items-center mx-2" onPress={() => setAddFoodModal(!addFoodModal)}>
                        <Ionicons name="add-outline" size={20} color={"#25a55f"} />
                        <FontAwesome5 name="utensils" size={25} color={"#25a55f"} />
                    </TouchableOpacity>
                </View>

                {
                    addFoodModal && (
                        <ModalSelectFoods
                            addFoodModal={addFoodModal}
                            onRequestClose={
                                () => {
                                    setAddFoodModal(false)
                                    setLoading2(true);
                                    getFoods(search, page)
                                        .then((res: ApiFoodResponse) => {

                                            setTotalPage(res.total_pages);
                                            setFoods(state => res.foods)
                                            setLoading2(false);
                                        })
                                        .catch(err => {
                                            setLoading2(false);
                                            console.log(err)
                                        });
                                }
                            }
                        />
                    )
                }

                <View className="w-full h-full pb-20">

                    <View className="w-full py-2">
                        <Text className="text-base text-white font-bold text-center pt-2 px-2">Clique no alimento para ter mais informações ou mantenha pressionado para marcar ou desmarcar</Text>
                    </View>

                    <View className="w-full flex flex-row flex-wrap bg-white rounded-lg px-2 py-2">

                        <TouchableOpacity className="w-full flex flex-wrap flex-row justify-between" onPress={() => setShowSearch(!showSearch)}>
                            <Text className="text-base font-bold">Pesquisar</Text>

                            {
                                showSearch 
                                ?
                                <MaterialIcons name="arrow-drop-up" size={24} color="black" />
                                :
                                <MaterialIcons name="arrow-drop-down" size={24} color="black" />
                            }
                        </TouchableOpacity>

                        {
                            showSearch && (
                                <>
                                    <View className="w-full mt-2">
                                        <TextInput className="w-full rounded-md bg-gray-300 px-2 py-1" placeholder="Ex: Maça" value={search} onChangeText={setSearch} />
                                    </View>

                                    <View className="w-full mt-2">
                                        <SelectList
                                            setSelected={(val) => setCategory(val)}
                                            data={[{ value: "Selecione uma categoria", key: 0 }, ...categories.map((item) => { return { key: item.id, value: item.name } })]}
                                            save="key"
                                            placeholder="Selecione uma categoria"
                                        />
                                    </View>
                                </>
                            )
                        }

                    </View>

                    <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        className="w-full h-full mt-2 bg-white rounded-lg"
                    >

                        <View className="w-full flex flex-wrap flex-row">
                            {
                                foods.map((food: Food, i: number) => <ItemFood food={food} key={i} ref={ref => foodRefs.current[i] = ref} longPress={true} css={"w-1/3"} />)
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

                    <View className="w-full">
                        <TouchableOpacity className="rounded-lg px-3 py-2 bg-red-600 flex flex-row flex-wrap justify-center items-center mt-2" onPress={() => handleAdd()}>
                            <Text className="text-base text-white font-bold">REMOVER DA DIETA</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>

        </View>
    );
};

export default Diet;