import { LoginUser, RegisterUser, SendOtp, VerifyOtp } from "./auth.schema";
import { AppError, BadRequestError, NotFoundError, UnauthorizedError } from "@/utils/app-error";
import { AuthRepository, CreateUserInput } from "./auth.repository";
import { comparePassword, hashPassword } from "@/services/hash-password.service";
import { generateOtp } from "@/services/otp.service";
import { resendOtpEmail, sendOtpEmail } from "@/utils/emails";
import { SmtpType } from "../system-config/system-config.repository";

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
        const otpCode = generateOtp();

        if (!otpCode) {
            throw new AppError("Failed to generate Otp!")
        }

        const newOtp = await this.repo.addOtp({
            user_id: data.user_id,
            otp: otpCode.otp,
            otp_expiry: otpCode.otp_expiry,
            type: data.otp_type
        })

        const user = await this.repo.findUserById(data.user_id);

        if (!user) {
            throw new NotFoundError("User not found!");
        }

        const sendOtpParam = {
            toEmail: user.email,
            otp: newOtp.otp,
            expiryMinutes: 5,
            userName: user.username,
            smtpType: "auth" as SmtpType
        }

        const result = await sendOtpEmail(sendOtpParam);

        if (!result) {
            throw new AppError("Email not sent!")
        }

        return result;
    }

    async verifyOtp(data: VerifyOtp) {
        const userOtp = await this.repo.findOtpByUserIdAndType(data.user_id, data.type);

        if (!userOtp) {
          throw new AppError("User otp not found!");
        }

        const now = new Date();
        if (userOtp.otp_expiry < now) {
            await this.repo.deleteOtpById(userOtp.id);
            throw new AppError("OTP expired!");
        }

        if (userOtp.otp === data.otp) {
            await this.repo.deleteOtpById(userOtp.id);
          return true;
        }

        return false;
    }

    async resendOtp(data: SendOtp) {
        const existingOtp = await this.repo.findOtpByUserIdAndType(data.user_id, data.otp_type);

        if (!existingOtp) {
            return await this.sendOtp(data);
        }

        const user = await this.repo.findUserById(data.user_id);

        if (!user) {
          throw new NotFoundError("User not found!");
        }

        const sendOtpParam = {
          toEmail: user.email,
          otp: existingOtp.otp,
          expiryMinutes: 5,
          userName: user.username,
          smtpType: "auth" as SmtpType,
        };

        const result = await resendOtpEmail(sendOtpParam);

        if (!result) {
          throw new AppError("Email not sent!");
        }

        return result;
    }

    async login(data: LoginUser) {
        const existingUser = await this.repo.findUserByEmail(data.email);

        if (!existingUser) {
            throw new NotFoundError("User not found!");
        }

        const matchPassword = comparePassword(data.password, existingUser.password);

        if (!matchPassword) {
            throw new UnauthorizedError("Invalid credentials!");
        }

        
    }
}
