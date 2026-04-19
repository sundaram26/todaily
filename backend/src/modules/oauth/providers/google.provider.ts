import { env } from "@/config/env";
import { OAuthProvider } from "./provider.type";
import { google } from "googleapis";
import { createHmac, randomBytes } from "crypto";
import { AppError, BadRequestError } from "@/utils/app-error";


const googleClient = new google.auth.OAuth2(
    env.GOOGLE_ID,
    env.GOOGLE_SECRET,
    env.GOOGLE_REDIRECT_URL
);

function makeState(): string {
    const payload = {
        nonce: randomBytes(16).toString("hex"),
        iat: Date.now(),
    };

    const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");

    const sig = createHmac("sha256", env.GOOGLE_STATE_SECRET)
    .update(encoded)
    .digest("base64url");

    return `${encoded}.${sig}`;
}

export const googleProvider: OAuthProvider = {
    getAuthUrl() {
        const googleRedirectUrl = googleClient.generateAuthUrl({
            scope: ["openid", "email", "profile"],
            prompt: "select_account",
            include_granted_scopes: true,
            state: makeState()
        })

        return googleRedirectUrl;
    },

    async getTokens(code) {
        let { tokens } = await googleClient.getToken(code);

        if (!tokens) {
            throw new AppError("Token not found!")
        }

        // googleClient.setCredentials(tokens);

        return tokens;
    },

    async getUserInfo(tokens: {
        access_token?: string,
        id_token?: string,
    }) {
        if (!tokens.id_token) {
            throw new BadRequestError("Missing google id_token!");
        }

        const client = new google.auth.OAuth2(
            env.GOOGLE_ID,
            env.GOOGLE_SECRET,
            env.GOOGLE_REDIRECT_URL
        )

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: env.GOOGLE_ID
        })

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            throw new AppError("Invalid google token!")
        }

        return {
            id: payload.sub,
            email: payload.email,
            name: payload.name ?? "",
            firstname: payload.given_name ?? "",
            lastname: payload.family_name ?? "",
            profile: payload.picture ?? "",
            provider: "google"
        };
    }
}