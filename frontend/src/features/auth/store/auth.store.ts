import { create } from "zustand"
import { RegisterType } from "../types"

type User = {
    id: string,
    email: string,
    username: string,
    first_name?: string,
    last_name?: string,
    profile?: string,
    is_verified: boolean,
    is_active: boolean
}

type AuthState = {
    user: User | null,
    isAuthenticated: boolean,
    isLoading: boolean,
}

type AuthAction = {
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const authStore = create<AuthState & AuthAction>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    setUser: (user: User | null) => set({ user, isAuthenticated: !!user, isLoading: false }),
    setLoading: (loading: boolean) => set({ isLoading: loading }),
    logout: () => set({ user: null, isAuthenticated: false, isLoading: false })
}));