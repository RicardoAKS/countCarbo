/// <reference types="nativewind/types" />`
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ModalProps, PressableProps, ViewStyle, TextStyle, StyleProp } from "react-native";

interface RegisterForm {
    name: string;
    lastName: string;
    email: string;
    password: string;
};

interface LoginForm {
    email: string;
    password: string;
}

interface User {
    name: string;
    email: string;
}

interface ForgetPasswordType {
    email: string;
}

interface CustomAlertButtonType extends PressableProps {
    styles?: TextStyle;
    text: string;
}

interface styleCustomAlertType {
    message?: TextStyle;
    container?: ViewStyle;
    title?: TextStyle;
}

interface CustomAlertProps extends ModalProps {
    styleCustomAlert: styleCustomAlertType,
    buttons: Array<CustomAlertButtonType>,
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    message: string;
}

interface AuthContextData {
    signed: boolean;
    loading: boolean;
    user: User | null;
    signIn(username: string, password: string): Promise<unknown>;
    signOut(): void;
    register(values: RegisterForm): Promise<unknown>;
}

interface CustomRouteType extends NativeStackHeaderProps {
    children?: React.ReactNode;
}