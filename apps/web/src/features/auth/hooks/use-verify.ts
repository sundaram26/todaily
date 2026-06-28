import { useQuery } from "@tanstack/react-query"
import { verifyLink } from "../api/auth.api"


export const useVerifyLink = (token: string) => {
    return useQuery({
        queryKey: ["verify", token],
        queryFn: () => verifyLink(token),
        enabled: !!token
    })
}