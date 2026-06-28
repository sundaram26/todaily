import api, { API_URL } from "@/lib/axios";
import { LoginType, RegisterType, SendVerifyLinkType } from "../types";


export const register = async (register: RegisterType) => {
    const res = await api.post("/auth/register", register)
    return res.data;
}

export const sendVerifyLink = async (data: SendVerifyLinkType) => {
    const res = await api.post("/auth/send-verify", data);

    return res.data
}

export const verifyLink = async (token: string) => {
    const res = await api.get(`auth/verify-email?token=${token}`);

    return res.data;
}

// export const sendOtp = async (sendOtp: SendOtpType) => {
//     const res = await api.post("/auth/send-otp", sendOtp);

//     return res.data;
// }

// export const verifyOtp = async (verifyOtp: VerifyOtpType) => {
//     const res = await api.post("/auth/verify-otp", verifyOtp);

//     return res.data;
// }

export const login = async (login: LoginType) => {
    const res = await api.post("/auth/login", login, {
        withCredentials: true
    })

    return res.data;
}

export const me = async () => {
    const res = await api.get("/auth/me", {
        withCredentials: true
    })
    console.log("response of me: ", res)
    return res.data;
}

export const logout = async () => {
    const res = await api.post("auth/logout", {}, {
        withCredentials: true
    })

    return res.data;
}

export const googleOAuth = () => {
    window.location.href = `${API_URL}/oauth/redirect/google`;
}

export const googleOAuthCallback = async (code: string, state: string) => {
    const res = await api.post(`/oauth/callback/google?state=${state}&code=${code}`, {  }, {
        withCredentials: true
    })

    return res.data;
}