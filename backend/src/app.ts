import express from 'express';
import { connectDB } from './db';
import sysConfigRoute from './modules/system-config/system-config.route';
import authRoute from './modules/auth/auth.routes';
import oauthRoute from './modules/oauth/oauth.routes';
import cors from 'cors';
import { env } from './config/env';
import session from 'express-session';

const app = express();

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173", env.FRONTEND_URL],
    credentials: true
}))
app.use(express.json());

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

// Global error handler ---> for schema validator
app.use((err: any, _req: any, res: any, _next: any) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({
        success: false,
        message,
        code: err.code || "INTERNAL_ERROR",
        details: err.details || null
    });
});

app.listen(env.PORT || 4000, async () => {
    await connectDB();
    console.log(`app is running: http://localhost:${env.PORT || 4000}`)
})