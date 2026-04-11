import bcrypt from "bcryptjs";

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);

    const hashed = await bcrypt.hash(password, salt);

    return hashed;
}

export const comparePassword = async (password: string, storedPassword: string): Promise<boolean> => {
    const result = await bcrypt.compare(password, storedPassword);

    return result;
}