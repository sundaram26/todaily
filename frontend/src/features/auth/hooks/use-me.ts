import { useQuery } from "@tanstack/react-query"
import { me } from "../api/auth.api"



export const useMe = (enabled: boolean = true) => {
    return (
        useQuery({
            queryKey: ["auth", "me"],
            queryFn: async () => {
                const res = await me();
                return res.data;
            },
            enabled,
            retry: false,
            refetchOnWindowFocus: false,
        })
    )
}