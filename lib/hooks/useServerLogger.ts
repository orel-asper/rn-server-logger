
//@ts-nocheck
import { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment';
import { LOG_TYPES, Log, LoggerState } from "../types/types";

const INITIAL_STATE = { REQUEST: [], RESPONSE: [], ERROR: [], PRINT: [] }

const useServerLogger = () => {
    const requestInterceptorRef = useRef();
    const responseInterceptorRef = useRef();
    const writeToLogHelperRef = useRef();
    const [isTrackingLogs, setIsTrackingLogs] = useState(true);
    const [{ REQUEST, RESPONSE, ERROR, PRINT }, setLogs] = useState(INITIAL_STATE);

    useEffect(() => {
        // Set up interceptors
        requestInterceptorRef.current = axios.interceptors.request.use(requestInterceptorHelper, (error) => Promise.reject(error));
        responseInterceptorRef.current = axios.interceptors.response.use(responseInterceptorHelper, responseErrorInterceptorHelper);

        // Remove interceptors on unmount
        return () => {
            axios.interceptors.request.eject(requestInterceptorRef.current);
            axios.interceptors.response.eject(responseInterceptorRef.current);
        };
    }, []);

    useEffect(() => {
        writeToLogHelperRef.current = ({ type, responseData, requestData, status, url, message }) => {
            const accessTokenIndex = url?.indexOf?.('?accessToken=');
            if (isTrackingLogs) {
                setLogs((prevState) => ({
                    ...prevState,
                    [type]: [...prevState[type], type === LOG_TYPES[3] ? {message, type, timestamp: moment().valueOf()} : {
                        type,
                        timestamp: moment().valueOf(),
                        url: accessTokenIndex > -1 ? url.substring(0, accessTokenIndex) : url,
                        requestData: typeof requestData === 'string' ? requestData : JSON.stringify(requestData || {}, null, 2),
                        responseData: JSON.stringify(responseData || {}, null, 2),
                        status,
                    }],
                }));
            }
        };
    }, [isTrackingLogs]);

    const requestInterceptorHelper = useCallback((config) => {
        writeToLogHelperRef.current({
            type: LOG_TYPES[0],
            url: `${config.baseURL || ''}${config.url || ''}`,
            requestData: config.data,
            status: 0,
        });
        return config;
    }, []);

    const responseInterceptorHelper = useCallback((response) => {
        writeToLogHelperRef.current({
            type: LOG_TYPES[1],
            url: (response.config && response.config.url) || '',
            requestData: response.config && response.config.data,
            responseData: response && response.data,
            status: response && response.status,
        });
        return response;
    }, []);

    const responseErrorInterceptorHelper = useCallback((error) => {
        writeToLogHelperRef.current({
            type: LOG_TYPES[2],
            url: error.config && error.config.url || '',
            requestData: error.config && error.config.data,
            responseData: error && error.data,
            status: error && error.status,
        });
        return Promise.reject(error);
    }, []);

    const printHelper = useCallback((message) => {
        writeToLogHelperRef.current({
            type: LOG_TYPES[3],
            message
        });
        return message;
    }, []);

    const toggleTracking = (value) => setIsTrackingLogs(value);

    const clearLogs = () => setLogs(INITIAL_STATE);

    return [{ REQUEST, RESPONSE, ERROR, PRINT }, isTrackingLogs, toggleTracking, clearLogs, printHelper]
};

export default useServerLogger;