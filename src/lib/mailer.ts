import nodemailer from "nodemailer";
import { env } from "$env/dynamic/private";
import { type Attachment } from "nodemailer/lib/mailer";

type SendMail = {
  to: string;
  subject: string;
  html: string;
  attachments?: Attachment[];
};

export async function sendMail({ to, subject, html, attachments }: SendMail) {
  // Evaluate HTML first if it's TSX
  if (env.SMTP_EMAIL && env.SMTP_PASSWORD && env.SMTP_HOST) {
    // Create account for sending mail
    const account = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT ? parseInt(env.SMTP_PORT) : 465,
      auth: {
        user: env.SMTP_EMAIL,
        pass: env.SMTP_PASSWORD,
      },
    });

    // If HTML is JSX, evaluate it first
    await account.sendMail({
      from: `${env.SMTP_NAME} <${env.SMTP_EMAIL}>`,
      to,
      subject,
      html,
      attachments,
    });
  } else {
    console.log(`✉️  ${to}`);
    console.log(`📋 Subject: ${subject}`);
    console.log(`📝 HTML: ${html}`);
    if (attachments) console.log(`📎 Attachments: ${attachments.length}`);
  }
}
