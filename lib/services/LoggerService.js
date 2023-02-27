import { useEffect, useRef, useState } from 'react';
import Share from 'react-native-share';
import axios from 'axios';
import RNFS from 'react-native-fs';
import moment from 'moment';
import { LOG_TYPES } from "../types/types";

const useServerLogger = () => {
    const requestInterceptorRef = useRef();
    const responseInterceptorRef = useRef();
    const writeToLogHelperRef = useRef();
    const [isTrackingLogs, setIsTrackingLogs] = useState(true);
    const [{ REQUEST, RESPONSE, ERROR }, setLogs] = useState({ REQUEST: [], RESPONSE: [], ERROR: [] });

    useEffect(() => {
        requestInterceptorRef.current = axios.interceptors.request.use(requestInterceptorHelper, (error) => Promise.reject(error));
        responseInterceptorRef.current = axios.interceptors.response.use(responseInterceptorHelper, responseErrorInterceptorHelper);

        return () => {
            axios.interceptors.request.eject(requestInterceptorRef.current);
            axios.interceptors.response.eject(responseInterceptorRef.current);
        };
    }, []);

    useEffect(() => {
        writeToLogHelperRef.current = ({ type, responseData, requestData, status, url }) => {
            const accessTokenIndex = url.indexOf('?accessToken=');
            if (isTrackingLogs) {
                setLogs((prevState) => ({
                    ...prevState,
                    [type]: [...prevState[type], {
                        type,
                        timestamp: moment().valueOf(),
                        url: accessTokenIndex > -1 ? url.substring(0, accessTokenIndex) : url,
                        requestData: typeof requestData === 'string' ? requestData : JSON.stringify(requestData || {}),
                        responseData: JSON.stringify(responseData || {}),
                        status,
                    }],
                }));
            }
        };
    }, [isTrackingLogs]);

    const requestInterceptorHelper = (config) => {
        writeToLogHelperRef.current({
            type: LOG_TYPES[0],
            url: `${config.baseURL || ''}${config.url || ''}`,
            requestData: config.data,
            status: 0,
        });
        return config;
    };

    const responseInterceptorHelper = (response) => {
        writeToLogHelperRef.current({
            type: LOG_TYPES[1],
            url: (response.config && response.config.url) || '',
            requestData: response.config && response.config.data,
            responseData: response && response.data,
            status: response && response.status,
        });
        return response;
    };

    const responseErrorInterceptorHelper = (error) => {
        writeToLogHelperRef.current({
            type: LOG_TYPES[2],
            url: error.config && error.config.url || '',
            requestData: error.config && error.config.data,
            responseData: error && error.response.data,
            status: error && error.response.status,
        });
        return Promise.reject(error);
    };

    const toggleTracking = (value) => setIsTrackingLogs(value);

    const clearLogs = () => setLogs({ REQUEST: [], RESPONSE: [], ERROR: [] });

    return [{ REQUEST, RESPONSE, ERROR }, isTrackingLogs, toggleTracking, clearLogs];
};

const exportLogsToFileAndShare = async (logs) => {
    let txtFile = '';
    logs.sort((a, b) => b.timestamp - a.timestamp).forEach((point) => {
        const { type, timestamp, url, requestData, responseData, status } = point;
        txtFile += `
    TYPE: ${type}\n
    TIME: ${moment(timestamp).format('DD-MM-YY HH:mm:ss.SSS')}\n
    URL: ${url}\n
    REQUEST DATA: ${requestData}\n
    RESPONSE DATA: ${responseData}\n
    STATUS: ${status}\n
    ---------------------------------
    \n
    `;
    });

    const filename = 'logs.txt';
    const filepath = `${(RNFS.CachesDirectoryPath)}/${filename}`;
    await RNFS.writeFile(filepath, txtFile, 'utf8');
    await Share.open({ url: `file://${filepath}` });
};

export { useServerLogger, exportLogsToFileAndShare };

