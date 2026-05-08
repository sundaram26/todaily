import { useMutation } from "@tanstack/react-query"
import { SendVerifyLinkType } from "../types"
import { sendVerifyLink } from "../api/auth.api"
import { toast } from "sonner"



export const useSendVerify = () => {
    return useMutation({
        mutationFn: (data: SendVerifyLinkType) => sendVerifyLink(data),
        onSuccess: (res) => {
            toast.success(res.message, { position: "top-center" })
        },
        onError: (error: any) => {
            toast.error(error.res?.data?.message || "Error while sending email!", { position: "top-center" })
        }
    })
}