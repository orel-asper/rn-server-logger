export const LOG_TYPES = ['REQUEST', 'RESPONSE', 'ERROR', 'PRINT'] as const;

export type LogType = typeof LOG_TYPES[number];

export interface BaseLog {
  type: LogType;
  timestamp: number;
}

export interface NetworkLog extends BaseLog {
  type: 'REQUEST' | 'RESPONSE' | 'ERROR';
  url: string;
  requestData: string;
  responseData: string;
  status: number;
}

export interface PrintLog extends BaseLog {
  type: 'PRINT';
  message: string;
}

export type Log = NetworkLog | PrintLog;

export interface LoggerState {
  REQUEST: NetworkLog[];
  RESPONSE: NetworkLog[];
  ERROR: NetworkLog[];
  PRINT: PrintLog[];
}

export interface UseServerLoggerOptions {
  maxLogs?: number;
  enableTracking?: boolean;
  maskSensitiveData?: boolean;
  customSensitiveParams?: string[];
}

export interface UseServerLoggerReturn {
  logs: LoggerState;
  isTrackingLogs: boolean;
  toggleTracking: (value: boolean) => void;
  clearLogs: () => void;
  printHelper: (message: string | object) => void;
}

export interface ExportOptions {
  format?: 'txt' | 'json' | 'csv';
  includeTypes?: LogType[];
  fileName?: string;
}
