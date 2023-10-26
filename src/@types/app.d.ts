/// <reference types="nativewind/types" />`
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ModalProps, PressableProps, ViewStyle, TextStyle, StyleProp } from "react-native";

interface RegisterForm {
    name: string;
    last_name: string;
    email: string;
    password: string;
};

interface LoginForm {
    email: string;
    password: string;
}

interface User {
    name: string;
    last_name: string;
    email: string;
    create_date: string;
    status: number;
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
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    configCustomAlert(title: string|null, message: string|null, buttons: Array<CustomAlertButtonType>, styleCustomAlert?: styleCustomAlertType): void;
}

interface CustomRouteType extends NativeStackHeaderProps {
    children?: React.ReactNode;
}

interface HourCadastre {
    id?: string|number;
    hour: string;
    min_carbohydrate?: number;
    max_carbohydrate?: number;
    description?: string;
    notification: boolean|number|string;
}

interface Hour extends HourCadastre {
    id: number|string;
}
