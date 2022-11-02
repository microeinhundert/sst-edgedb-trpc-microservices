/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_REGION: string;
  readonly VITE_DOMAIN_NAME: string;
  readonly VITE_SESSION_SECRET: string;
  readonly VITE_COGNITO_USER_POOL_ID: string;
  readonly VITE_COGNITO_USER_POOL_CLIENT_ID: string;
  readonly VITE_COGNITO_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
