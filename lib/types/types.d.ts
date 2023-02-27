export declare type LogType = 'REQUEST' | 'RESPONSE' | 'ERROR';
export interface WriteToLogHelperPayload {
    type: LogType;
    url: string;
    requestData: any;
    responseData: any;
    status: number;
}
export interface Log extends WriteToLogHelperPayload {
    timestamp: number;
}
export declare const LOG_TYPES: LogType[];
