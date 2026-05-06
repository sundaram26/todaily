import { Router } from "express";
import { login, logout, me, refreshTokens, register, resendOtp, sendOrResendVerifyLink, sendOtp, verifyToken } from "./auth.controller";
import { validateSchema } from "@/middlewares/validate-schema.middleware";
import { LoginUserSchema, LogoutUserSchema, OtpSchema, RegisterUserSchema, SendVerifyLinkSchema } from "./auth.schema";
import { isAuthenticated } from "@/middlewares/authorize.middleware";


const authRoute:Router = Router();

authRoute.post("/register", validateSchema(RegisterUserSchema), register);
authRoute.post("/send-verify", validateSchema(SendVerifyLinkSchema), sendOrResendVerifyLink);
authRoute.get("/verify-email", verifyToken)
// authRoute.post("/send-otp", validateSchema(OtpSchema), sendOtp);
// authRoute.post("/resend-otp", validateSchema(OtpSchema), resendOtp);
// authRoute.post("/verify-otp", verifyOtp);
authRoute.post("/login", validateSchema(LoginUserSchema), login);
authRoute.post("/refresh-token", refreshTokens);
authRoute.get("/me", isAuthenticated, me)
authRoute.post("/logout", validateSchema(LogoutUserSchema), logout);

export default authRoute;