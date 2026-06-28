"use client";
import { authStore } from "../store/auth.store";
import { useEffect, useState } from "react";
import { useMe } from "../hooks/use-me";
import { usePathname } from "next/navigation";


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const setUser = authStore((state) => state.setUser);
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    const isPublicRoute = pathname === "/login" ||
                          pathname === "/register" ||
                          pathname?.startsWith("/verify-email") ||
                          pathname?.startsWith("/send-verify");
    const { data } = useMe(!isPublicRoute && isMounted);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (data) {
            setUser(data);
        }
    }, [data, setUser]);

    return <>
        {children}
    </>
}