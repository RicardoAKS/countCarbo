import { RegisterForm } from "../@types/app";

var Buffer = require('buffer/').Buffer;

interface Response {
    token: string;
    user: RegisterForm
}

export function signIn(): Promise<Response>{
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                token: Buffer.from('ricardoraks1003@gmail.com:7c4a8d09ca3762af61e59520943dc26494f8941b', 'binary').toString('base64'),
                user: {
                    name: "Ricardo",
                    lastName: "Alexandre",
                    email: "ricardoraks1003@gmail.com",
                    password: "7c4a8d09ca3762af61e59520943dc26494f8941b"
                }
            })
        }, 2000);
    })
}