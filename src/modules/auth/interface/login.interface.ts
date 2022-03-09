export interface IUserLoginResponse {
    token: string;
}

export interface IUserLoginPayload {
    id: number;
    name: string;
    loginId: string;
    phone: string;
}
