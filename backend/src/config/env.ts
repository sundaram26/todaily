import dotenv from 'dotenv'

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` })

export const {
    DATABASE_URL,
} = process.env

console.log(
    DATABASE_URL
)