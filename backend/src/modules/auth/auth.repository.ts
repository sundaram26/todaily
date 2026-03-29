import { db } from "@/db"
import { userTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import { RegisterUser } from "./auth.schema"

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

    async createUser(data: RegisterUser) {
        const [user] = await db.insert(userTable).values(data).returning();
        return user;
    }
}