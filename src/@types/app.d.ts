/// <reference types="nativewind/types" />`

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

interface AuthContextData {
    signed: boolean;
    loading: boolean;
    user: User | null;
    signIn(username: string, password: string): Promise<void>;
    signOut(): void;
    register(values: RegisterForm): Promise<unknown>;
}

interface ForgetPasswordType {
    email: string;
}
