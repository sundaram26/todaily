import { RegisterUser, SendOtp } from "./auth.schema";
import { BadRequestError } from "@/utils/app-error";
import { AuthRepository, CreateUserInput } from "./auth.repository";
import { hashPassword } from "@/services/hash-password.service";

export class AuthService {
    constructor(private repo: AuthRepository) { }

    async register(data: RegisterUser) {
        const existingUser = await this.repo.findByEmailOrUsername(data.email, data.username);

        if (existingUser?.email === data.email) {
            throw new BadRequestError("Email already in use");
        }

        if (existingUser?.username === data.username) {
            throw new BadRequestError("Username already taken")
        }


        const hashedPassword = await hashPassword(data.password);
        const newData: CreateUserInput = {
            ...data,
            password: hashedPassword,
            is_verified: false,
        }

        const user = await this.repo.createUser(newData);

        return {
            id: user.id,
            email: user.email,
            username: user.username
        };
    }

    async sendOtp(data: SendOtp) {

    }
}
