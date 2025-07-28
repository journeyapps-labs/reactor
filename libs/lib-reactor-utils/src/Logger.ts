export enum LogLevel {
  INFO = 'info',
  DEBUG = 'debug',
  ERROR = 'error',
  WARN = 'warn'
}

export class Logger {
  constructor(public name: string) {}

  protected log(level: LogLevel, d: any[]) {
    let payload = [`[${this.name}]`, ...d];
    if (level === LogLevel.DEBUG) {
      console.debug(...payload);
    } else if (level === LogLevel.ERROR) {
      console.error(...payload);
    } else if (level === LogLevel.WARN) {
      console.warn(...payload);
    } else {
      console.log(...payload);
    }
  }

  debug(...args: any) {
    this.log(LogLevel.DEBUG, args);
  }

  info(...args: any) {
    this.log(LogLevel.INFO, args);
  }

  error(...args: any) {
    this.log(LogLevel.ERROR, args);
  }

  warn(...args: any) {
    this.log(LogLevel.WARN, args);
  }
}

export const createLogger: (name: string) => Logger = (name: string) => {
  return new Logger(name);
};
