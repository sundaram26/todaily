import express from 'express';
import { connectDB } from './db';
import sysConfigRoute from './modules/system-config/system-config.route';
import authRoute from './modules/auth/auth.routes';
import oauthRoute from './modules/oauth/oauth.routes';
import cors from 'cors';
import { env } from './config/env';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import workspaceRoute from './modules/workspace/workspace.routes';

const app = express();

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173", env.FRONTEND_URL],
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: env.NODE_ENV === "PRODUCTION",
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
        sameSite: "lax"
    }
}))

app.use("/api/v1/config", sysConfigRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/oauth", oauthRoute);

app.use("/api/v1/workspace", workspaceRoute);

// Global error handler for unexpected errors only
app.use((err: any, _req: any, res: any, _next: any) => {
    console.error("Error:", err);

    if (err.status) {
        return res.status(err.status).json({
            success: false,
            message: err.message,
            code: err.code || "ERROR",
        });
    }

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        code: "INTERNAL_ERROR",
    });
});

app.listen(env.PORT || 4000, async () => {
    await connectDB();
    console.log(`app is running: http://localhost:${env.PORT || 4000}`)
})