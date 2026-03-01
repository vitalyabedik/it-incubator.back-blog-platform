export const registrationExamples = {
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

  recoveryPassword(code: string) {
    return `<div>
              <h1>Password recovery</h1>
                <p>To finish password recovery please follow the link below:
                  <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
                </p>
            </div>`;
  },
};
