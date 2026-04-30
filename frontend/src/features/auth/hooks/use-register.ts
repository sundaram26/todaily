import { useMutation, useQuery } from "@tanstack/react-query"
import { register } from "../api/auth.api"
import { RegisterType } from "../types"
import { toast } from "sonner"


export const useRegister = () => {
    return useMutation({
        mutationFn: (data: RegisterType) => register(data),
        onSuccess: (response) => {
            toast.success(response.message, {position: "top-center"})
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Registration failed!", { position: "top-center" })
        }
    })
}