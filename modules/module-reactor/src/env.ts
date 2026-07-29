type ENV = {
  REACTOR_LOG_LEVEL?: string;
};

export const ENV: ENV = {
  ...((window as any).process.env as ENV)
};
