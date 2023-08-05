import React, { useContext } from "react";
import { View, Button } from "react-native";
import { useAuth } from "../../contexts/auth";

const SignIn: React.FC = () => {
    const { signed, signIn } = useAuth();

    async function handleSignIn() {
        signIn();
    }

    return (
        <View className="flex-1 items-center justify-center">
            <Button title="Sign In" onPress={handleSignIn} />
        </View>
    );
};

export default SignIn;