import { db } from "@/db"
import { accountTable, otpTable, sessionTable, userTable } from "@/db/schema"
import { and, eq, lt, or } from "drizzle-orm"
import { Account, GoogleAuth, Otp, OtpType, ProviderType, RegisterUser, UpdateUser, UpdateUserSession, UserSession, VerifyOtp } from "./auth.schema"
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

    async createGoogleAuthUserWithAccount(userData: GoogleAuth, accountData: Account) {
        return await db.transaction(async (tx) => {
            const [user] = await tx.insert(userTable).values(userData).returning();

            if (!user) {
                throw new AppError("User creation failed");
            }

            const [account] = await tx.insert(accountTable).values({ user_id: user.id, ...accountData }).returning();

            if (!account) {
                tx.rollback();
                throw new AppError("Account creation failed!");
            }

            return user;
        })
    }

    async createAccount(user_id: string, data: Account) {
        const [account] = await db.insert(accountTable).values({ user_id, ...data }).returning();

        if (!account) {
            throw new AppError("Unable to find the provider!")
        }

        return account;
    }

    async findAccount(provider: ProviderType, user_id: string) {
        return db.query.accountTable.findFirst({
            where: and(
                eq(accountTable.provider, provider),
                eq(accountTable.user_id, user_id)
            )
        })
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
        const [otp] = await db.insert(otpTable)
            .values(data)
            .onConflictDoUpdate({
                target: otpTable.user_id,
                set: {
                    otp: data.otp,
                    otp_expiry: data.otp_expiry,
                    type: data.type,
                    updated_at: new Date()
                }
            })
            .returning();

        if (!otp) {
            throw new AppError("OTP creation failed");
        }

        const now = new Date();
        const timeSinceLastOtp = otp.updated_at
            ? now.getTime() - otp.updated_at.getTime()
            : Infinity;
        
        if (timeSinceLastOtp < 60 * 1000) {
            throw new BadRequestError("Please wait before requesting another otp!")
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
        const [updatedSession] = await db.update(sessionTable)
            .set(cleanData)
            .where(eq(sessionTable.refresh_token, refresh_token))
            .returning();

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