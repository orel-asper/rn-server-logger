declare const LOG_TYPES: LogType[];
declare type LogType = 'REQUEST' | 'RESPONSE' | 'ERROR';
interface WriteToLogHelperPayload {
    type: LogType;
    url: string;
    requestData: any;
    responseData: any;
    status: number;
}

interface Log {
    type: LogType;
    url: string;
    timestamp: number;
    requestData: string;
    responseData: string;
    status: string;
}

interface Logger {
    info: (message: string, data?: any) => void;
    warn: (message: string, data?: any) => void;
    error: (message: string, error?: Error, data?: any) => void;
}

interface LoggerState {
    logs: {
        REQUEST: Log[];
        RESPONSE: Log[];
        ERROR: Log[];
    };
    isTrackingLogs: boolean;
    toggleTracking: () => void;
}

interface ExportOptions {
    fileName: string;
    fileType: string;
    subject: string;
}

export { LOG_TYPES, LogType, WriteToLogHelperPayload, Log, Logger, LoggerState, ExportOptions };