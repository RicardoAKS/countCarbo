import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { View } from "react-native";
import { useAuth } from "../../contexts/auth";
import { useEffect } from "react";

const Logout: React.FC<NativeStackHeaderProps> = ({ navigation }) => {
    const { signOut } = useAuth();

    useEffect(() => {
        signOut();
    }, [])

    return (
        <View />
    )
};

export default Logout;