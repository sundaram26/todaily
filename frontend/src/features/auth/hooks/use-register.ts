import { useMutation } from "@tanstack/react-query"
import { register } from "../api/auth.api"
import { RegisterType } from "../types"
import { toast } from "sonner"


type UseRegisterOptions = {
    onSuccess?: () => void;
}

export const useRegister = (options?: UseRegisterOptions) => {
    return useMutation({
        mutationFn: (data: RegisterType) => register(data),
        onSuccess: (res) => {
            toast.success(res.message, {position: "top-center"})
            options?.onSuccess?.()
        },
        onError: (error: any) => {
            const message = error.response?.data?.message;

            // Try to parse JSON error array
            if (message) {
                try {
                    const errors = JSON.parse(message);
                    if (Array.isArray(errors)) {
                        errors.forEach((err) => {
                            toast.error(`${err.field}: ${err.message}`, { position: "top-center" });
                        });
                        return;
                    }
                } catch {
                    toast.error(message || "Registration failed!", { position: "top-center" })
                }
            }
        }
    })
}