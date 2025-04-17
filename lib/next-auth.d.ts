
type CredentialLogin ={
    email: string;
    password: string
}

type userType ={
    role: string;
    id: string,
    userId: string;
    collectionId?: string;
    isVerified: boolean;
    user:{
        name: string;
        image: string;
    }
}

export interface Session {
    user:{
        email: string;
        name: string;
        image?: string 
    };
    isVerified: boolean;
    role: string;
    collectionId?: string;
    userId: string;
}

export interface Token {
    user:{
        email: string;
        name: string;
        image?: string 
    };
    isVerified: boolean;
    role: string;
    collectionId?: string;
    userId: string;
}