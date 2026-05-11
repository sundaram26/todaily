import { useMutation } from "@tanstack/react-query"
import { logout } from "../api/auth.api"
import { authStore } from "../store/auth.store"
import { toast } from "sonner";
import { useRouter } from "next/navigation";




export const useLogout = () => {
    const storeLogout = authStore((state) => state.logout);
    const router = useRouter()
    return useMutation({
        mutationFn: () => logout(),
        onSuccess: (res) => {
            toast.success(res.message || "user logged out", { position: "top-center" })
            storeLogout();
            router.push("/login")
        }
    })   
}