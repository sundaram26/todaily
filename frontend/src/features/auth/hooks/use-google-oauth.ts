import { googleOAuth } from "../api/auth.api"



export const useGoogleOAuth = () => {
    const login = () => {
        googleOAuth();
    }

    return {
        login
    }
}