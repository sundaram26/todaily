import { useMutation } from "@tanstack/react-query"
import { logout } from "../api/auth.api"
import { authStore } from "../store/auth.store"




export const useLogout = () => {
    const storeLogout = authStore((state) => state.logout);

    return useMutation({
        mutationFn: () => logout(),
        onSuccess: () => {
            storeLogout();
        }
    })   
}