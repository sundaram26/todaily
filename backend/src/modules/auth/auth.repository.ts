import { db } from "@/db"
import { userTable } from "@/db/schema"
import { eq, or } from "drizzle-orm"
import { RegisterUser } from "./auth.schema"
import { AppError } from "@/utils/app-error"

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

    async createUser(data: CreateUserInput) {
        const [user] = await db.insert(userTable).values(data).returning();
        
        if (!user) {
            throw new AppError("User creation failed");
        }
        return user;
    }
}