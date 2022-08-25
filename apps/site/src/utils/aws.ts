export const awsConfig = {
  Auth: {
    region: import.meta.env.VITE_REGION,
    userPoolId: import.meta.env.VITE_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
    mandatorySignIn: false,
    signUpVerificationMethod: "code",
    cookieStorage: {
      domain: `.${import.meta.env.VITE_DOMAIN_NAME}`,
      path: "/",
      expires: 365,
      sameSite: "strict",
      secure: true,
    },
  },
};
