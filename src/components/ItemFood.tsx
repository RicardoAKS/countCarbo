import { ImageBackground, TouchableOpacity, Text, View } from "react-native";
import { Feather } from 'react-native-vector-icons';
import React, { useImperativeHandle, useState } from 'react';
import { Food } from "../@types/app";
import api from "../services/api";
import { ModalFood } from "./ModalFood";

interface ItemFoodProps {
    food: Food;
    longPress: boolean;
    css?: string;
}

const ItemFood: React.ForwardRefExoticComponent<ItemFoodProps & React.RefAttributes<unknown>> = React.forwardRef(({ food, css, longPress = false }, ref) => {
    const [selected, setSelected] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
        returnData() {
            return selected ? food.id : null;
        }
    }))

    return (
        <View className={`p-1 ${css}`}>

            <ImageBackground source={{ uri: `${api.defaults.baseURL}/assets/img/food/${food.id}/${food.images[0].name}` }} imageStyle={{ width: "100%", height: "100%", resizeMode: "cover" }} className="w-full aspect-square z-10 rounded-lg overflow-hidden flex flex-row flex-wrap relative">

                <TouchableOpacity activeOpacity={0.5} className="w-full h-full bg-[#00000086] flex flex-row flex-wrap items-end px-1" onLongPress={() => longPress ? setSelected(!selected) : setModalVisible(true)} onPress={() => !longPress ? setSelected(!selected) : setModalVisible(true)}>

                    {
                        selected && (
                            <View className="absolute bottom-0 top-0 left-0 right-0 bg-[#00000086] flex flex-wrap flex-row justify-center items-center">
                                <Feather name="check" size={30} color="white" className="absolute m-auto" />
                            </View>
                        )
                    }
                </TouchableOpacity>

            </ImageBackground>
            <Text className="text-sm text-black font-bold">{food.name}</Text>

            {
                modalVisible && (
                    <ModalFood
                        food={food}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(false);
                        }}
                    />
                )
            }
        </View>
    )
})

export default ItemFood;

function returnData() {
    throw new Error("Function not implemented.");
}
