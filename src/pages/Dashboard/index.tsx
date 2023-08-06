import React, { useContext } from "react";
import { View, Button, Text } from "react-native";
import { useAuth } from "../../contexts/auth";

const Dashboard: React.FC = () => {
    const { signOut, user } = useAuth();

    async function handleSignOut() {
        signOut();
    }

    return (
        <View className="flex-1 items-center justify-center bg-[#25a55f]">
            <Text className="mb-1">{!!user ? 'Olá ' : ''}{user?.name}</Text>
            <Button title="Sign Out" onPress={handleSignOut} />
        </View>
    );
};

export default Dashboard;