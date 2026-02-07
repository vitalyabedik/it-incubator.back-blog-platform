export const emailExamples = {
  registrationEmail(code: string) {
    return `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
        </p>`;
  },
  registrationConfirmationEmail(code: string) {
    return `<h1>New confirmation code</h1>
        <p>To finish confirmation email please follow the link below:
            <a href='https://somesite.com/confirm-registration?code=${code}'>complete confirmation</a>
        </p>`;
  },
};
