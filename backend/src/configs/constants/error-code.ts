export const USER_ERRORS = {
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'User not found',
  },
  WRONG_PASSWORD: {
    code: 'WRONG_PASSWORD',
    message: 'Wrong password',
  },
};

export const REGISTER_ERRORS = {
  USERNAME_ALREADY_IN_USE: {
    code: 'USERNAME_ALREADY_IN_USE',
    message: 'usename already in use',
  },

  FIELD_PASSWORD_LENGTH_MUST_6: {
    message: '"password" length must be at least 6 characters long',
  },

  FIELD_NOT_VALID_EMAIL: {
    message: '"email" must be a valid email',
  },

  FIELD_CONFIRM_PASSWORD_MUST_MATCH: {
    message: 'Confirm password must match',
  },
};

export const AUTHENTICATION_ERRORS = {
  TOKEN_INVALID: {
    code: 'TOKEN_INVALID',
    message: 'Access is denied due to invalid credentials',
  },
  USER_NOT_EXISTS: {
    code: 'USER_NOT_EXISTS',
    message: 'User is not existed',
  },
  TOKEN_EXPIRED: {
    code: 'TOKEN_EXPIRED',
    message: 'Token is expired',
  },
  INVALID_ACCOUNT: {
    code: 'INVALID_ACCOUNT',
    message: 'Invalid account',
  },
};
