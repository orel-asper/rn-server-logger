//@ts-nocheck
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  Modal,
  View,
  Text,
  Switch,
  Button,
  VirtualizedList,
  TextInput,
} from 'react-native';
import RNShake from 'react-native-shake';
import moment from 'moment';
import useServerLogger from '../hooks/useServerLogger';
import exportLogsToFileAndShare from '../services/exportLogsToFileAndShare';
import styles from './styles';
import LogTypeButtonGroup from './LogTypeButtons';
import { LOG_TYPES } from '../types/types';

const ServerLogger = forwardRef((_, ref) => {
  const [logs, isTrackingLogs, toggleTracking, clearLogs, printHelper] = useServerLogger();
  const [logType, setLogType] = useState<string>('REQUEST');
  const [showLogger, setShowLogger] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');

  const onDismiss = () => setShowLogger(false);
  const onShake = () => setShowLogger(true);

  const onClear = useCallback(() => {
    clearLogs();
  }, [clearLogs]);

  useEffect(() => {
    let subscription = RNShake.addListener(() => onShake());
    return () => {
      subscription.remove();
    };
  }, []);

  const onExport = useCallback(() => {
    onDismiss();
    setTimeout(
      () =>
        exportLogsToFileAndShare([
          ...logs.REQUEST,
          ...logs.RESPONSE,
          ...logs.ERROR,
          ...logs.PRINT,
        ]),
      300
    );
  }, [logs.REQUEST, logs.RESPONSE, logs.ERROR, logs.PRINT]);

  const shouldDisableButtons = useMemo(
    () =>
      logs.REQUEST.length === 0 &&
      logs.RESPONSE.length === 0 &&
      logs.ERROR.length === 0 &&
      logs.PRINT.length === 0,
    [logs]
  );

  const filteredLogs = useMemo(() => {
    const searchRegExp = new RegExp(searchText, 'i');
    const logTypeLogs = logs[logType] || [];

    return logTypeLogs.filter(log => {
      return (
        searchRegExp.test(log.url) ||
        searchRegExp.test(log.requestData) ||
        searchRegExp.test(log.responseData) ||
        searchRegExp.test(log.message)
      );
    }).map(log => (log.type === LOG_TYPES[3] ? log : {
      id: log.timestamp,
      message: log.url,
      type: log.type,
      timestamp: log.timestamp,
      requestData: log.requestData,
      responseData: log.responseData,
      status: log.status,
    }));
  }, [logs, logType, searchText]);

  const highlightedText = useCallback(
    (text: string | object, match: string) => {
      text = String(text);
      match = String(match);

      if (!match) {
        return <Text style={styles.text}>{text}</Text>;
      }

      if (typeof text !== 'string' || typeof match !== 'string') {
        return <Text style={styles.text}>Invalid input</Text>;
      }

      const regex = new RegExp(match, 'gi');
      const parts = text.split(regex);
      const matches = text.match(regex);
      const result = parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {matches && matches[i] && (
            <Text style={styles.highlightedText}>{matches[i]}</Text>
          )}
        </React.Fragment>
      ));

      return <Text style={styles.text}>{result}</Text>;
    },
    [styles.highlightedText, styles.text]
  );

  useImperativeHandle(
    ref,
    () => {
      return { printHelper };
    },
    []
  );
  

  return (
    <Modal
      ref={ref}
      visible={showLogger}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>SERVER LOGS</Text>
          <Button
            title="Close"
            onPress={onDismiss}
          />
          <Button
            title="Export"
            onPress={onExport}
            disabled={shouldDisableButtons}
          />
          <Button
            title="Clear"
            onPress={onClear}
            disabled={shouldDisableButtons}
          />
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.TextInput}
            onChangeText={text => setSearchText(text)}
            value={searchText}
            placeholder="Search"
          />
        </View>
        <View style={styles.logsContainer}>
          <VirtualizedList
            data={filteredLogs}
            keyExtractor={(item: any, index: number) => index.toString()}
            renderItem={({ item }: any) => (
              <View style={styles.logContainer}>
                <View>
                  <Text style={styles.text}>
                    {moment(item.timestamp).format('HH:mm:ss')}
                  </Text>
                  {item?.type !== LOG_TYPES[3] && <Text style={styles.text}>HTTP {item?.type}</Text>}
                </View>
                <Text style={styles.text}>
                  Message: {highlightedText(item?.message, searchText)}
                </Text>
                {!!item?.status && <Text style={styles.text}>
                  Status: {highlightedText(item?.status, searchText)}
                </Text>}
                {!!item?.requestData && <Text style={styles.text}>
                  Request Data: {highlightedText(item?.requestData, searchText)}
                </Text>}
                {!!item?.responseData && <Text style={styles.text}>
                  Response Data:{" "}
                  {highlightedText(item?.responseData, searchText)}
                </Text>}
              </View>
            )}
            getItemCount={(data) => data.length}
            getItem={(data, index) => data[index]}
            initialNumToRender={5}
            ListEmptyComponent={() => (
              <View style={styles.emptyListContainer}>
                <Text style={styles.title}>{'No logs in the\npast 60 seconds'}</Text>
              </View>
            )}
          />
        </View>
        <View style={styles.footerContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.text}>Tracking</Text>
            <Switch
              value={isTrackingLogs}
              onValueChange={toggleTracking}
              style={{ marginLeft: 5 }}
            />
          </View>
          <View style={styles.logTypeButtonsContainer}>
            <LogTypeButtonGroup logType={logType} setLogType={setLogType} />
          </View>
        </View>
      </View>
    </Modal>
  );
});

export default ServerLogger;