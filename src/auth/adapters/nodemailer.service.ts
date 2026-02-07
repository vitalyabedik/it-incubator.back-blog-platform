import nodemailer from 'nodemailer';
import { SETTINGS } from '../../core/settings';

type TArgs = {
  email: string;
  code: string;
  template: (code: string) => string;
};

const POST_SERVICE = 'gmail';

export const nodemailerService = {
  async sendEmail({ email, code, template }: TArgs): Promise<boolean> {
    const transporter = nodemailer.createTransport({
      service: POST_SERVICE,
      auth: {
        user: SETTINGS.EMAIL,
        pass: SETTINGS.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: 'Registration <codeSender>',
      to: email,
      subject: 'register',
      html: template(code),
    });

    return Boolean(info);
  },
};
