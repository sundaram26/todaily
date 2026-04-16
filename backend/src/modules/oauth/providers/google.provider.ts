import { env } from "@/config/env";
import { OAuthProvider } from "./provider.type";
import { google } from "googleapis";
import { createHmac, randomBytes } from "crypto";
import { AppError } from "@/utils/app-error";


const oauth2Client = new google.auth.OAuth2(
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
        const googleRedirectUrl = oauth2Client.generateAuthUrl({
            scope: ["openid", "email", "profile"],
            prompt: "select_account",
            include_granted_scopes: true,
            state: makeState()
        })

        return googleRedirectUrl;
    },

    async getTokens(code) {
        let { tokens } = await oauth2Client.getToken(code);

        oauth2Client.setCredentials(tokens);

        return tokens;
    },

    async getUserInfo(tokens: {
        access_token: string,
        id_token: string,
    }) {
        return ;
    }
}