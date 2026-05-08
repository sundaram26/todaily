import { Nodemailer } from "@/modules/system-config/system-config.schema";
import nodemailer from "nodemailer";


export const mailTransporter = async ( data: Nodemailer) => {
    const transporter = nodemailer.createTransport({
        host: data.host,
        port: parseInt(data.port),
        secure: data.secure,
        auth: {
            user: data.username,
            pass: data.password
        }
    })

    try {
        await transporter.verify();
        console.log("Smtp server is ready!")
    } catch (err: unknown) {
        console.error("Verification failed: ", err)
    }

    return transporter;
}

