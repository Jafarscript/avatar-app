export interface User {
    _id: string,
    userName: string,
    email: string,
    displayName: string,
    bio?:string,
    avatar?: string
}

export interface RegistrationForm{
    userName: string,
    email: string,
    password: string,
    displayName: string
}

export interface LoginForm {
    identifier: string;
    password: string
}

export interface ProfileForm{
    displayName: string,
    bio: string
}
