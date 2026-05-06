import { useMutation } from "@tanstack/react-query"
import { login } from "../api/auth.api"
import { LoginType } from "../types"
import { toast } from "sonner";

type UseLoginOptions = {
    onSuccess?: () => void;
    onError?: () => void;
}  

export const useLogin = (options?: UseLoginOptions) => {
    return (
        useMutation({
            mutationFn: (data: LoginType) => login(data),
            onSuccess: (res) => {
                toast.success(res.message, { position: "top-center" });
                options?.onSuccess?.();
            },
            onError: (error: any) => {
                const message = error?.response?.data?.message
                toast.error(message || "Login failed!", { position: "top-center" });
            }
        })
    )
}