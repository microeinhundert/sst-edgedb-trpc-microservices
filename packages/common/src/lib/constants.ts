export const MIN_PASSWORD_LENGTH_LAX = 6 as const;

export const PASSWORD_POLICY_LAX = {
  minLength: MIN_PASSWORD_LENGTH_LAX,
  requireLowercase: false,
  requireUppercase: false,
  requireDigits: false,
  requireSymbols: false,
} as const;
