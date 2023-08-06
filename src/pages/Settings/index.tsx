import React from "react";
import { View } from "react-native";
import { useAuth } from "../../contexts/auth";

const Settings: React.FC = () => {
    const { user } = useAuth();

    return (
        <View className="flex-1 items-center justify-center bg-[#25a55f]">
        </View>
    );
};

export default Settings;