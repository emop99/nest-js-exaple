export interface IUserLoginPayload {
    id: number;
    name: string;
    loginId: string;
    phone: string;
}

export interface IUserLoginInterface {
    userInfo: IUserLoginPayload;
    access_token: string;
}
