import { Router } from "express";
import { login, logout, refreshTokens, register, resendOtp, sendOtp, verifyOtp } from "./auth.controller";


const authRoute:Router = Router();

authRoute.post("/register", register);
authRoute.post("/send-otp", sendOtp);
authRoute.post("/resend-otp", resendOtp);
authRoute.post("/verify-otp", verifyOtp);
authRoute.post("/login", login);
authRoute.post("/refresh-token", refreshTokens);
authRoute.post("/logout", logout);

export default authRoute;