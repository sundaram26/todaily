import { db } from "@/db"
import { otpTable, sessionTable, userTable } from "@/db/schema"
import { and, eq, lt, or } from "drizzle-orm"
import { Otp, OtpType, RegisterUser, UpdateUser, UpdateUserSession, UserSession, VerifyOtp } from "./auth.schema"
import { AppError, BadRequestError } from "@/utils/app-error"
import z from "zod"

export type CreateUserInput = Omit<RegisterUser, "password"> & {
    password: string;
    is_verified: boolean;
};

export class AuthRepository {
    async findUserByUsername(username: string) {
        return db.query.userTable.findFirst({
            where: eq(userTable.username, username)
        })
    } 

    async findUserByEmail(email: string) {
        return db.query.userTable.findFirst({
            where: eq(userTable.email, email)
        })
    }

    async findByEmailOrUsername(email: string, username: string) {
        return db.query.userTable.findFirst({
            where: or(
                eq(userTable.email, email),
                eq(userTable.username, username)
            )
        })
    }

    async findUserById(id: string) {
        return await db.query.userTable.findFirst({ where: eq(userTable.id, id) });
    }

    async createUser(data: CreateUserInput) {
        const [user] = await db.insert(userTable).values(data).returning();
        
        if (!user) {
            throw new AppError("User creation failed");
        }
        return user;
    }

    async updateUser(id: string, data: UpdateUser) {
        const cleanData = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v !== undefined)
        )
        const [updatedData] = await db.update(userTable).set(cleanData).where(eq(userTable.id, id)).returning()

        if (!updatedData) {
            throw new AppError("Failed to updated user!")
        }

        return updatedData;
    }

    async addOtp(data: Otp) {
        const existingOtp = await db.query.otpTable.findFirst({ where: eq(otpTable.user_id, data.user_id) });
        
        const now = new Date();
        
        if ((existingOtp && existingOtp.otp_expiry > now)) {
            throw new BadRequestError("Otp already sent. Please wait.");
        }
        if (existingOtp) {
            await db.delete(otpTable).where(eq(otpTable.user_id, data.user_id));
        }
        
        const [otp] = await db.insert(otpTable).values(data).returning();

        if (!otp) {
            throw new AppError("OTP creation failed");
        }

        return otp;
    }

    async deleteExpiredOtp() {
        const now = new Date();
        return await db.delete(otpTable).where(lt(otpTable.otp_expiry, now));
    }

    async findOtpByUserIdAndType(user_id: string, otp_type: OtpType) {
        return await db.query.otpTable.findFirst({
            where: and(
                eq(otpTable.user_id, user_id),
                eq(otpTable.type, otp_type)
            )
        })
    }    

    async deleteOtpById(id: string) {
        return await db.delete(otpTable).where(eq(otpTable.id, id));
    }

    async createUserSession(data: UserSession) {
        const [session] = await db.insert(sessionTable).values(data).returning();

        if (!session) {
            throw new AppError("Unable to create user session!");
        }

        return session;
    }

    async updateUserSession(refresh_token: string, data: UpdateUserSession) {
        const cleanData = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v !== undefined)
        )
        const updatedSession = await db.update(sessionTable).set(cleanData).where(eq(sessionTable.refresh_token, refresh_token)).returning();

        if (!updatedSession) {
            throw new AppError("Unable to update the user session!");
        }

        return updatedSession;
    }

    async findSessionByRefreshToken(token: string) {
        return db.query.sessionTable.findFirst({ where: eq(sessionTable.refresh_token, token) });
    }

    async deleteSessionByRefreshToken(token: string) {
        return db.delete(sessionTable).where(eq(sessionTable.refresh_token, token));
    }
}