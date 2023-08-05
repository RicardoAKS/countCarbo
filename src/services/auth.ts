var Buffer = require('buffer/').Buffer;

interface Response {
    token: string;
    user: {
        name: string;
        email: string;
    }
}

export function signIn(): Promise<Response>{
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                token: Buffer.from('ricardo:123456', 'binary').toString('base64'),
                user: {
                    name: "Ricardo",
                    email: "ricardoraks1003@gmail.com"
                }
            })
        }, 2000);
    })
}