import { AppError, BadRequestError } from "@/utils/app-error";
import { SmtpType, SystemConfigRepository } from "./system-config.repository";
import { RegisterSmtp, UpdateSmtp } from "./system-config.schema";


export class SystemConfigService {
  constructor(private configRepo: SystemConfigRepository) {}

  async addSmtp(data: RegisterSmtp) {
    if (data.is_active) {
      await this.configRepo.deactivateSmtpByType(data.smtp_type);
    }

    const smtp = await this.configRepo.addSmtp(data);

    return smtp;
  }

  async updateSmtp(smtp_id: string, data: UpdateSmtp) {
    const smtpId = parseInt(smtp_id);

    if (isNaN(smtpId)) {
      throw new BadRequestError("Invalid smtp Id!");
    }

    const smtp = await this.configRepo.findSmtpById(smtpId);

    if (!smtp) {
      throw new AppError("Unable to found smtp config!");
    }

    if (data.is_active) {
      await this.configRepo.deactivateSmtpByType(
        data.smtp_type || smtp.smtp_type,
      );
    }

    const updatedSmtp = await this.configRepo.updateSmtp(smtpId, data);

    return updatedSmtp;
  }

  async getAllSmtp() {
    const smtp = await this.configRepo.findAllSmtp();

    return smtp;
  }

  async deleteSmtp(smtp_id: string) {
    const smtpId = parseInt(smtp_id);

    if (isNaN(smtpId)) {
      throw new BadRequestError("Invalid smtp Id!");
    }

    const deletedSmtp = await this.configRepo.deleteSmtp(smtpId);

    return deletedSmtp;
  }

    async getNodemailerConfig(smtpType: SmtpType) {
        const smtp = await this.configRepo.findSmtpByType(smtpType);

        if (!smtp) {
            throw new AppError("No SMTP configuration found for this type!");
        }

        return {
            host: smtp.host,
            port: smtp.port,
            secure: smtp.port === "465",
            username: smtp.username,
            password: smtp.password,
            from_email: smtp.from_email
        };
    }
}