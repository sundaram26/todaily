import { mailTransporter } from "@/config/nodemailer";
import { SystemConfigRepository } from "@/modules/system-config/system-config.repository";
import { SendEmail } from "@/modules/system-config/system-config.schema";
import { SystemConfigService } from "@/modules/system-config/system-config.service";
import { AppError } from "@/utils/app-error";

const systemConfigService = new SystemConfigService(new SystemConfigRepository())

export const sendEmail = async (data: SendEmail) => {
    try {
        const smtpConfig = await systemConfigService.getNodemailerConfig(data.smtp_type);
        
        const transporter = await mailTransporter(smtpConfig);

        const result = await transporter.sendMail({
            from: smtpConfig.from_email,
            to: data.to_email,
            subject: data.subject,
            text: data.text,
            html: data.html
        })

        return result;
    } catch (err: unknown) {
        throw new AppError("Unable to send email!", {
            details: err
        })
    }
}