export const emailExamples = {
  registrationEmail(code: string) {
    return `<div>
              <h1>Please confirm your email</h1>
              <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
            </div>`;
  },
  registrationConfirmationEmail(code: string) {
    return `<div>
              <h1>This is new confirmation code</h1>
              <a href='https://some-front.com/confirm-registration?code=${code}'>complete registration</a>
            </div>`;
  },
};
