import { useEffect, useRef, useState, useCallback } from 'react';
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import axios from 'axios';
import { getCurrentTimestamp } from '../utils/dateUtils';
import { sanitizeUrl } from '../utils/sanitization';
import {
  LOG_TYPES,
  LoggerState,
  NetworkLog,
  PrintLog,
  UseServerLoggerOptions,
  UseServerLoggerReturn,
} from '../types/types';

const INITIAL_STATE: LoggerState = { REQUEST: [], RESPONSE: [], ERROR: [], PRINT: [] };
const DEFAULT_MAX_LOGS = 1000;

interface WriteToLogPayload {
  type: (typeof LOG_TYPES)[number];
  url?: string;
  requestData?: any;
  responseData?: any;
  status?: number;
  message?: string;
}

const useServerLogger = (options: UseServerLoggerOptions = {}): UseServerLoggerReturn => {
  const {
    maxLogs = DEFAULT_MAX_LOGS,
    enableTracking = true,
    // maskSensitiveData is available for future use
    // maskSensitiveData = false,
  } = options;

  const requestInterceptorRef = useRef<number | undefined>();
  const responseInterceptorRef = useRef<number | undefined>();
  const writeToLogHelperRef = useRef<(payload: WriteToLogPayload) => void>();
  const [isTrackingLogs, setIsTrackingLogs] = useState(enableTracking);
  const [logs, setLogs] = useState<LoggerState>(INITIAL_STATE);

  const writeToLogHelper = useCallback(
    (payload: WriteToLogPayload) => {
      const { type, responseData, requestData, status, url, message } = payload;

      if (!isTrackingLogs) return;

      setLogs(prevState => {
        const newState = { ...prevState };
        const timestamp = getCurrentTimestamp();

        if (type === 'PRINT') {
          const printLog: PrintLog = {
            message: message || '',
            type: 'PRINT',
            timestamp,
          };

          // Apply max log limit with rotation
          const updatedPrintLogs = [...prevState.PRINT, printLog];
          newState.PRINT =
            updatedPrintLogs.length > maxLogs ? updatedPrintLogs.slice(-maxLogs) : updatedPrintLogs;
        } else {
          const networkLog: NetworkLog = {
            type: type as 'REQUEST' | 'RESPONSE' | 'ERROR',
            timestamp,
            url: url ? sanitizeUrl(url) : '',
            requestData:
              typeof requestData === 'string'
                ? requestData
                : JSON.stringify(requestData || {}, null, 2),
            responseData: JSON.stringify(responseData || {}, null, 2),
            status: status || 0,
          };

          const logType = type as 'REQUEST' | 'RESPONSE' | 'ERROR';
          const updatedLogs = [...prevState[logType], networkLog];
          newState[logType] =
            updatedLogs.length > maxLogs ? updatedLogs.slice(-maxLogs) : updatedLogs;
        }

        return newState;
      });
    },
    [isTrackingLogs, maxLogs]
  );

  // Update ref when writeToLogHelper changes
  useEffect(() => {
    writeToLogHelperRef.current = writeToLogHelper;
  }, [writeToLogHelper]);

  const requestInterceptorHelper = useCallback((config: InternalAxiosRequestConfig) => {
    writeToLogHelperRef.current?.({
      type: 'REQUEST',
      url: `${config.baseURL || ''}${config.url || ''}`,
      requestData: config.data,
      status: 0,
    });
    return config;
  }, []);

  const responseInterceptorHelper = useCallback((response: AxiosResponse) => {
    writeToLogHelperRef.current?.({
      type: 'RESPONSE',
      url: response.config?.url || '',
      requestData: response.config?.data,
      responseData: response?.data,
      status: response?.status,
    });
    return response;
  }, []);

  const responseErrorInterceptorHelper = useCallback((error: AxiosError) => {
    writeToLogHelperRef.current?.({
      type: 'ERROR',
      url: error.config?.url || '',
      requestData: error.config?.data,
      responseData: (error.response as any)?.data,
      status: error.response?.status,
    });
    return Promise.reject(error);
  }, []);

  const printHelper = useCallback((message: string | object) => {
    const messageStr = typeof message === 'string' ? message : JSON.stringify(message, null, 4);
    writeToLogHelperRef.current?.({
      type: 'PRINT',
      message: messageStr,
    });
  }, []);

  useEffect(() => {
    // Set up interceptors
    requestInterceptorRef.current = axios.interceptors.request.use(
      requestInterceptorHelper,
      error => Promise.reject(error)
    );
    responseInterceptorRef.current = axios.interceptors.response.use(
      responseInterceptorHelper,
      responseErrorInterceptorHelper
    );

    // Remove interceptors on unmount
    return () => {
      if (requestInterceptorRef.current !== undefined) {
        axios.interceptors.request.eject(requestInterceptorRef.current);
      }
      if (responseInterceptorRef.current !== undefined) {
        axios.interceptors.response.eject(responseInterceptorRef.current);
      }
    };
  }, [requestInterceptorHelper, responseInterceptorHelper, responseErrorInterceptorHelper]);

  const toggleTracking = useCallback((value: boolean) => {
    setIsTrackingLogs(value);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs(INITIAL_STATE);
  }, []);

  return {
    logs,
    isTrackingLogs,
    toggleTracking,
    clearLogs,
    printHelper,
  };
};

export default useServerLogger;
