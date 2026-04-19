type UserInfo = {
    id: string,
    email: string,
    name?: string,
    firstname?: string,
    lastname?: string,
    profile?: string,
    provider: "google"
}


export type OAuthProvider = {
    getAuthUrl(): string;

    getTokens(code: string): Promise<unknown>;

    getUserInfo(token: {
        access_token?: string,
        id_token?: string
    }): Promise<UserInfo>
}