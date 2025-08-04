import { Logger, LogLevel } from '@journeyapps-labs/common-logger';

export const createLogger = (name: string) => {
  return new Logger({
    name,
    level: LogLevel.DEBUG
  });
};
