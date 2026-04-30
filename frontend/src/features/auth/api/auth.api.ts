import api from "@/lib/axios";
import { LoginType, RegisterType, SendOtpType, VerifyOtpType } from "../types";


export const register = async (register: RegisterType) => {
    const res = await api.post("/auth/register", register)

    return res.data;
}

export const sendOtp = async (sendOtp: SendOtpType) => {
    const res = await api.post("/auth/send-otp", sendOtp);

    return res.data;
}

export const verifyOtp = async (verifyOtp: VerifyOtpType) => {
    const res = await api.post("/auth/verify-otp", verifyOtp);

    return res.data;
}

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

    return res.data;
}