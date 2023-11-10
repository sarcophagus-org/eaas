import sgMail, { MailDataRequired } from "@sendgrid/mail";
import { envConfig } from "../../../src/config/env.config";
import { inviteEmailTemplate } from "../utils/templates/inviteEmail";
import { EaasUser } from "../../../src/types/EaasUser";

sgMail.setApiKey(envConfig.sendGrid.apiKey);

const sendResetPasswordEmail = async (to: string, token: string) => {
  const subject = "Reset password";
  // TODO: Make this url production friendly
  const resetPasswordUrl = `${envConfig.client.url}/reset-password?token=${token}`;
  const html = `<p>Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.</p>`;
  const msg: MailDataRequired = {
    to,
    from: envConfig.sendGrid.fromEmail,
    subject,
    html,
  };
  await sgMail.send(msg);
};

const sendVerificationEmail = async (to: string, token: string) => {
  const subject = "Email Verification";
  // TODO: Make this url production friendly
  const verificationEmailUrl = `${envConfig.client.url}/auth/verify-email?token=${token}`;
  const html = `<p>Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.</p>`;
  const msg: MailDataRequired = {
    to,
    from: envConfig.sendGrid.fromEmail,
    subject,
    html,
  };
  await sgMail.send(msg);
};

const sendNewUserInviteEmail = async (params: { to: string; token: string; sender: EaasUser }) => {
  try {
    const { to, token, sender } = params;

    const subject = "Create an Account";
    const acceptInvitationUrl = `${envConfig.client.url}/onboard?token=${token}`;

    const msg: MailDataRequired = {
      to,
      from: envConfig.sendGrid.fromEmail,
      subject,
      html: inviteEmailTemplate({
        url: acceptInvitationUrl,
        sender,
      }),
    };
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export const emailService = {
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendNewUserInviteEmail,
};
