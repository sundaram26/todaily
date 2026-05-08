import { asyncHandler } from "@/utils/async-handler";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { ApiResponse } from "@/utils/api-response";
import { AppError, BadRequestError, NotFoundError } from "@/utils/app-error";
import { env } from "@/config/env";
import { getCookieMaxAge, getExpiryDate } from "./auth.util";
import { UAParser } from "ua-parser-js";

const authService = new AuthService(new AuthRepository());

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.register(req.body);

  return res.json(
    new ApiResponse({
      status: 201,
      message: "Successfully registered!",
      data: user,
    }),
  );
});

export const sendOrResendVerifyLink = asyncHandler(async (req: Request, res: Response) => {
  const sendEmail = await authService.sendVerifyLink(req.body);

  if (!sendEmail) {
    throw new AppError("Unable to send email!");
  }

  return res.json(
    new ApiResponse({
      status: 200,
      message: "Successfully sent verification link."
    })
  )
})

export const verifyToken = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.query;
  
  if (!token || typeof token !== "string") {
    throw new BadRequestError("Invalid or missing token!")
  }
  
  await authService.verifyToken(token);

  return res.json(
    new ApiResponse({
      status: 200,
      message: "Successfully verified user."
    })
  )
})

export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.sendOtp(req.body);

  if (!result) {
    throw new AppError("Unable to send otp! try resend opt.");
  }

  return res.json(
    new ApiResponse({
      status: 200,
      message: "Successfully sent otp to registered email.",
    }),
  );
});

export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.resendOtp(req.body);

  if (!result) {
    throw new AppError("Unable to send otp!");
  }

  return res.json(
    new ApiResponse({
      status: 200,
      message: "Successfully sent new otp to registered email.",
    }),
  );
});

// export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
//   const isVerified = await authService.verifyOtp(req.body);

//   if (!isVerified) {
//     throw new BadRequestError("Invalid or expired otp!");
//   }

//   return res.json(
//     new ApiResponse({
//       status: 200,
//       message: "Successfully verified email.",
//     }),
//   );
// });

export const login = asyncHandler(async (req: Request, res: Response) => {
  const loginData = {
    ...req.body,
    provider: "local",
    ip_address: req.ip || req.headers['x-forwarded-for'] as string || "",
    device_info: new UAParser(req.headers['user-agent'] || "").getResult()
  }

  const loggedin = await authService.login(loginData);

  if (!loggedin) {
    throw new AppError("Unable to login!");
  }

  res.cookie("access_token", loggedin.accessToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "PRODUCTION",
    maxAge: getCookieMaxAge(env.JWT_ACCESS_EXPIRY),
    sameSite: "lax",
  });

  res.cookie("refresh_token", loggedin.refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "PRODUCTION",
    maxAge: getCookieMaxAge(env.JWT_REFRESH_EXPIRY),
    sameSite: "lax",
  });

  res.json(
    new ApiResponse({
      status: 200,
      message: "User logged in.",
    }),
  );
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user_id = req.user?.user_id;
  if (!user_id) {
    throw new BadRequestError("User id is required!");
  }
  
  const user = await authService.findUser(user_id);

  if (!user) {
    throw new NotFoundError("User not found!");
  }

  return res.json(
    new ApiResponse({
      status: 200,
      message: "User fetched successfully!",
      data: user
    })
  );
});

export const refreshTokens = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      throw new BadRequestError("Refresh token is required!");
    }

    const tokens = await authService.refreshToken(refreshToken);

    res.cookie("access_token", tokens.accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "PRODUCTION",
      maxAge: getCookieMaxAge(env.JWT_ACCESS_EXPIRY),
      sameSite: "lax",
    });

    res.cookie("refresh_token", tokens.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "PRODUCTION",
      maxAge: getCookieMaxAge(env.JWT_REFRESH_EXPIRY),
      sameSite: "lax",
    });

    res.json(
      new ApiResponse({
        status: 200,
        message: "Tokens refreshed!",
      }),
    );
  },
);

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refresh_token;

  await authService.logout(refreshToken);

  res.clearCookie("access_token", {
    httpOnly: true,
    secure: env.NODE_ENV === "PRODUCTION",
    sameSite: "lax",
  });

  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: env.NODE_ENV === "PRODUCTION",
    sameSite: "lax",
  });

  return res.json(
    new ApiResponse({
      status: 200,
      message: "Successfully logged out!",
    }),
  );
});
