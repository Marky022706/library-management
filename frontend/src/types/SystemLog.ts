export type LogLevel = 'INFO' | 'WARNING' | 'ERROR';

export interface SystemLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
}
