import { LogLevel, Logger, NodeConsoleLoggerTransport } from '@journeyapps-labs/common-logger';

export const reactorServerLogger = new Logger({
  name: 'Reactor server',
  level: LogLevel.INFO,
  transport: new NodeConsoleLoggerTransport()
});
