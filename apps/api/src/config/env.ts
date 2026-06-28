import dotenv from 'dotenv'
import { EnvSchema, EnvType } from './config.schema';

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` })

const parsedEnv = EnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("Invalid enviroment variable!");
    console.error(parsedEnv.error.format());
    process.exit(1);
}

export const env: EnvType = parsedEnv.data;