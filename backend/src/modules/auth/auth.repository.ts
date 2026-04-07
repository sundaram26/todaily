import { db } from "@/db"
import { otpTable, userTable } from "@/db/schema"
import { eq, lt, or } from "drizzle-orm"
import { Otp, RegisterUser, UpdateUser, VerifyOtp } from "./auth.schema"
import { AppError } from "@/utils/app-error"
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
            Object.entries(data).filter((_, v) => v !== undefined)
        )
        const [updatedData] = await db.update(userTable).set(cleanData).where(eq(userTable.id, id)).returning()

        if (!updatedData) {
            throw new AppError("Failed to updated user!")
        }

        return updatedData;
    }

    async addOtp(data: Otp) {
        const existingOtp = await db.query.otpTable.findFirst({ where: eq(otpTable.user_id, data.user_id) });
        
        
        if (existingOtp) {
            const deleted = await db.delete(otpTable).where(eq(otpTable.user_id, data.user_id));

            if (!deleted) {
                throw new AppError("Error deleting old otps!")
            }
        }
        
        const date = new Date();
        const otp_expiry = new Date(date.getTime() + 5 * 60 * 1000);

        const [otp] = await db.insert(otpTable).values({
            ...data,
            otp_expiry
        }).returning();

        if (!otp) {
            throw new AppError("OTP creation failed");
        }

        return otp;
    }

    async deleteExpiredOtp() {
        const now = new Date();
        return await db.delete(otpTable).where(lt(otpTable.otp_expiry, now));
    }

    async verifyOtp(data: VerifyOtp) {
        const userOtp = await db.query.otpTable.findFirst({ where: eq(otpTable.user_id, data.user_id) });
        if (!userOtp) {
            throw new AppError("User otp not found!");
        }

        const now = new Date();
        if (userOtp.otp_expiry < now) {
            const isMatching: boolean = (userOtp.otp === data.otp);
            return isMatching;
        }
        
        return false;
    }
}