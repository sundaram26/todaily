
type UserInfo = {
    email: string,
    username: string,
    firstname?: string,
    lastname?: string,
    profile?: string,
}

export type OAuthProvider = {


    getAuthUrl(): string;

    getTokens(code: string): Promise<unknown>;

    getUserInfo(token: {
        access_token?: string,
        id_token?: string
    }): Promise<UserInfo>
}