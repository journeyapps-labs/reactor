type ENV = {
  RELEASE: string;
  USER_EMAIL: string;
  USER_ID: string;
  USER_NAME: string;
  USER_ORG: string;
  ADMIN_PORTAL_URL: string;
};

export const ENV: ENV = {
  ...((window as any).process.env as ENV)
};
