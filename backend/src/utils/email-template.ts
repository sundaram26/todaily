export interface EmailTemplateParams {
  subject: string;
  heading?: string;
  previewText?: string;
  content: string;
  buttonLabel?: string;
  buttonUrl?: string;
  footerText?: string;
  brandName?: string;
  logoUrl?: string;
  brandColor?: string;
}

const ASSET_BASE_URL = process.env.EMAIL_ASSET_BASE_URL || "";
const DEFAULT_BRAND_COLOR = "#2563eb";
const DEFAULT_BRAND_NAME = "Todaily";

export const generateEmailTemplate = (params: EmailTemplateParams): string => {
  const {
    subject,
    heading,
    previewText,
    content,
    buttonLabel,
    buttonUrl,
    footerText,
    brandName = DEFAULT_BRAND_NAME,
    logoUrl,
    brandColor = DEFAULT_BRAND_COLOR,
  } = params;

  const logoSrc = logoUrl || `${ASSET_BASE_URL}/logo.png`;
  const displayHeading = heading || subject;
  const displayPreview = previewText || subject;

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${escapeHtml(subject)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body, p, div { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    td { word-break: break-word; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .email-padding { padding: 20px !important; }
      .email-content { padding: 30px 20px !important; }
      .stack-column { display: block !important; width: 100% !important; }
    }
    @media (prefers-color-scheme: dark) {
      .email-wrapper { background-color: #1a1a1a !important; }
      .email-card { background-color: #2d2d2d !important; }
      .email-text { color: #e5e5e5 !important; }
      .email-heading { color: #ffffff !important; }
      .email-footer-text { color: #a3a3a3 !important; }
      .email-border { border-color: #404040 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; word-spacing: normal; background-color: #f3f4f6;">
  <div style="display: none; max-height: 0; overflow: hidden;">
    ${escapeHtml(displayPreview)}
    &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3f4f6;" class="email-wrapper">
    <tr>
      <td style="padding: 40px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" align="center" style="margin: 0 auto;" class="email-container">
          <tr>
            <td style="text-align: center; padding-bottom: 24px;">
              <img src="${escapeHtml(logoSrc)}" alt="${escapeHtml(brandName)}" width="48" height="48" style="display: inline-block; width: 48px; max-width: 100%; height: 48px;" />
            </td>
          </tr>
          <tr>
            <td style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;" class="email-card">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td height="6" style="background-color: ${escapeHtml(brandColor)}; line-height: 6px; font-size: 6px;">&nbsp;</td>
                </tr>
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: 48px 40px;" class="email-content email-padding">
                    <h1 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 600; color: #111827; line-height: 1.3;" class="email-heading">
                      ${escapeHtml(displayHeading)}
                    </h1>
                    <div style="margin-bottom: 32px; font-size: 16px; line-height: 1.6; color: #4b5563;" class="email-text">
                      ${content}
                    </div>
                    ${buttonLabel && buttonUrl ? `
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding-top: 8px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="background-color: ${escapeHtml(brandColor)}; border-radius: 8px;">
                                <a href="${escapeHtml(buttonUrl)}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: 500; color: #ffffff; text-decoration: none; border-radius: 8px;">
                                  ${escapeHtml(buttonLabel)}
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    <p style="margin: 32px 0 0 0; font-size: 14px; line-height: 1.5; color: #9ca3af;" class="email-footer-text">
                      If you didn't request this email, you can safely ignore it.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 20px 20px; text-align: center; font-size: 13px; line-height: 1.5; color: #9ca3af;" class="email-footer-text">
              <p style="margin: 0 0 8px 0;">
                &copy; ${new Date().getFullYear()} ${escapeHtml(brandName)}. All rights reserved.
              </p>
              ${footerText ? `<p style="margin: 0;">${escapeHtml(footerText)}</p>` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char] ?? char);
};

export interface OtpCardParams {
  otp: string;
  expiryTime?: string;
}

export const generateOtpCard = (params: OtpCardParams): string => {
  const { otp, expiryTime } = params;

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; text-align: center;">
          <p style="margin: 0 0 16px 0; font-size: 14px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">
            Your Verification Code
          </p>
          <p style="margin: 0; font-size: 32px; font-weight: 700; color: #111827; letter-spacing: 8px; font-family: 'Courier New', monospace;">
            ${escapeHtml(otp)}
          </p>
          ${expiryTime ? `
            <p style="margin: 16px 0 0 0; font-size: 14px; color: #6b7280;">
              This code will expire in <strong>${escapeHtml(expiryTime)}</strong>
            </p>
          ` : ''}
        </td>
      </tr>
    </table>
    <p style="margin: 16px 0 0 0; font-size: 14px; color: #6b7280;">
      Enter this code on the verification page to complete your request.
    </p>
  `;
};

export interface InfoListParams {
  items: Array<{
    label: string;
    value: string;
  }>;
}

export const generateInfoList = (params: InfoListParams): string => {
  const { items } = params;

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0; border-collapse: separate; border-spacing: 0;">
      ${items.map((item) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px 0; font-size: 14px; font-weight: 500; color: #6b7280; width: 40%;">
            ${escapeHtml(item.label)}
          </td>
          <td style="padding: 12px 0; font-size: 14px; color: #111827;">
            ${escapeHtml(item.value)}
          </td>
        </tr>
      `).join('')}
    </table>
  `;
};

export const generateWarningAlert = (message: string): string => {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0;">
      <tr>
        <td style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #92400e;">
            <strong>⚠️ Important:</strong> ${escapeHtml(message)}
          </p>
        </td>
      </tr>
    </table>
  `;
};

export const generateSuccessAlert = (message: string): string => {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0;">
      <tr>
        <td style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 16px; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #065f46;">
            <strong>✓ Success:</strong> ${escapeHtml(message)}
          </p>
        </td>
      </tr>
    </table>
  `;
};

export const generatePlainText = (params: {
  subject: string;
  heading: string;
  content: string;
  buttonLabel?: string;
  buttonUrl?: string;
  brandName?: string;
}): string => {
  const { subject, heading, content, buttonLabel, buttonUrl, brandName = DEFAULT_BRAND_NAME } = params;

  let text = `${heading}\n${'='.repeat(heading.length)}\n\n`;
  text += stripHtml(content).trim() + '\n\n';

  if (buttonLabel && buttonUrl) {
    text += `${buttonLabel}: ${buttonUrl}\n\n`;
  }

  text += `---\n`;
  text += `© ${new Date().getFullYear()} ${brandName}. All rights reserved.\n`;
  text += `If you didn't request this email, you can safely ignore it.`;

  return text;
};

const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
};
