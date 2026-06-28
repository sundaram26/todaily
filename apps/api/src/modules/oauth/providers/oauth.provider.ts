import { googleProvider } from "./google.provider";

export const providers = {
    google: googleProvider
}

export type providerName = keyof typeof providers;