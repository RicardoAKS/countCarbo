import { View, Modal, TouchableOpacity, Image, ScrollView, Text, Dimensions } from 'react-native';
import { Food } from '../@types/app';
import api from '../services/api';
import RenderHTML from 'react-native-render-html';

interface ModalFoodProps {
    visible: boolean;
    onRequestClose: () => void;
    food: Food;
}

const ModalFood: React.FC<ModalFoodProps> = ({ visible, onRequestClose, food }) => {

    return <Modal
        animationType="fade"
        visible={visible}
        onRequestClose={() => onRequestClose()}
        transparent={true}
    >

        <TouchableOpacity activeOpacity={1} onPress={() => onRequestClose()} className="absolute bottom-0 top-0 left-0 right-0 z-0 bg-[#00000070]"></TouchableOpacity>

        <View className="w-full flex-1 px-8 py-9 flex flex-wrap flex-col justify-between">

            <ScrollView className='w-full h-full bg-white rounded-lg'>

                <View className='w-full flex flex-row flex-wrap justify-center items-center mt-4'>

                    <View className='w-1/2 aspect-square rounded-lg border my-2'>
                        <Image source={{ uri: `${api.defaults.baseURL}/assets/img/food/${food.id}/${food.images[0].name}` }} style={{ height: "100%" }} className='w-full aspect-square rounded-lg border' />
                    </View>

                </View>

                <View className='w-full flex flex-row flex-wrap px-2'>

                    <View className='w-full flex flex-row flex-wrap'>
                        <Text className="text-lg font-bold">Nome:</Text>
                        <Text className="text-base w-full bg-gray-300 rounded-lg p-2 h-full">{food.name}</Text>
                    </View>

                    <View className='w-full flex flex-row flex-wrap items-center mt-2'>
                        <Text className="text-lg font-bold w-full">Medida:</Text>
                        <Text className="text-base bg-gray-300 rounded-lg p-2 w-full">{food.measure}</Text>
                    </View>

                    <View className='w-1/3 flex flex-row flex-wrap items-center pr-1 mt-2'>
                        <Text className="text-lg font-bold w-full">Peso:</Text>
                        <Text className="text-base bg-gray-300 rounded-lg p-2 w-full">{food.weight} {food.weight_measure}</Text>
                    </View>

                    <View className='w-1/3 flex flex-row flex-wrap items-center pl-1 mt-2'>
                        <Text className="text-lg font-bold w-full">Kcal</Text>
                        <Text className="text-base bg-gray-300 rounded-lg p-2 w-full">{food.kcal}</Text>
                    </View>

                    <View className='w-1/3 flex flex-row flex-wrap items-center pl-1 mt-2'>
                        <Text className="text-lg font-bold w-full">Carb.</Text>
                        <Text className="text-base bg-gray-300 rounded-lg p-2 w-full">{food.carbohydrate} G</Text>
                    </View>

                    <View className='w-full mt-2 pb-5'>
                        <Text className="text-lg font-bold w-full">Descrição</Text>
                        <View className='w-full border p-2 rounded-lg'>

                            {
                                food.description && (
                                    <RenderHTML
                                        contentWidth={Dimensions.get('screen').width - 100}
                                        source={{
                                            html: `<div>${food.description}</div>`
                                        }}
                                    />
                                )
                            }

                        </View>
                    </View>

                </View>

            </ScrollView>

        </View>

    </Modal>
}

export { ModalFood };