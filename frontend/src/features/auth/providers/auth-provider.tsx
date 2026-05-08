"use client";
import { useRouter } from "next/navigation";
import { authStore } from "../store/auth.store";
import { useEffect } from "react";
import { useMe } from "../hooks/use-me";
import { useLogout } from "../hooks/use-logout";


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const setUser = authStore((state) => state.setUser);

    const { data, isError } = useMe(true);
    const { mutate: logout } = useLogout();

    useEffect(() => {
        if (data?.data) {
            setUser(data.data);
        }
    }, [data, setUser]);

    useEffect(() => {
        if (isError) {
            logout;
            router.push("/login")
        }
    }, [isError, logout, router])

    return <>
        {children}
    </>
}