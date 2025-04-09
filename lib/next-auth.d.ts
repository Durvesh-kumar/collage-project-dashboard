
type credentialLogin ={
    email: string,
    password: string
}

type userType ={
    role: string;
    id: string,
    collectionId?: string;
    isVerified: boolean;
}