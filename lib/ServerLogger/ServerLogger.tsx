//@ts-nocheck
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  Switch,
  Button,
  TouchableOpacity,
  VirtualizedList,
} from 'react-native';
import RNShake from 'react-native-shake';
import moment from 'moment';
import { useServerLogger, exportLogsToFileAndShare } from '../services/LoggerService';
import { LOG_TYPES } from '../types/types';

const ServerLogger = () => {
  const [logs, isTrackingLogs, toggleTracking, clearLogs] = useServerLogger();
  const [state, setState] = useState<{ showLogger: boolean; logType: string }>({
    showLogger: false,
    logType: 'REQUEST',
  });

  useEffect(() => {
    let subscription = RNShake.addListener(() => setState((prevState) => ({ ...prevState, showLogger: true })));
    return () => {
      subscription.remove();
    };
  }, []);

  const onExport = useCallback(() => {
    setState((prevState) => ({ ...prevState, showLogger: false }));
    setTimeout(
      () =>
        exportLogsToFileAndShare([
          ...logs.REQUEST,
          ...logs.RESPONSE,
          ...logs.ERROR,
        ]),
      300
    );
  }, [logs.REQUEST, logs.RESPONSE, logs.ERROR]);

  const onClear = useCallback(() => {
    clearLogs();
  }, [clearLogs]);

  const renderLogTypeButtons = useCallback(
    () =>
      LOG_TYPES.map((type) => (
        <TouchableOpacity
          key={type}
          onPress={() =>
            setState((prevState) => ({ ...prevState, logType: type }))
          }
        >
          <View style={styles.logTypeButtonContainer}>
            <Text
              numberOfLines={1}
              style={[
                styles.text,
                type === state.logType && { fontWeight: 'bold' },
              ]}
            >
              {type}
            </Text>
          </View>
        </TouchableOpacity>
      )),
    [state.logType]
  );

  const shouldDisableButtons = useMemo(
    () =>
      logs.REQUEST.length === 0 &&
      logs.RESPONSE.length === 0 &&
      logs.ERROR.length === 0,
    [logs]
  );

  const filteredLogs = useMemo(
    () =>
      logs[state.logType].map((log: any) => ({
        id: log.timestamp,
        message: log.url,
        type: log.type,
        timestamp: log.timestamp,
        requestData: log.requestData,
        responseData: log.responseData,
        status: log.status,
      })),
    [logs, state.logType]
  );

  return (
    <Modal
      visible={state.showLogger}
      transparent={false}
      animationType="slide"
      onRequestClose={() =>
        setState((prevState) => ({ ...prevState, showLogger: false }))
      }
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>SERVER LOGS</Text>
          <Button
            title="Close"
            onPress={() => setState((prevState) => ({ ...prevState, showLogger: false }))}
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
            {renderLogTypeButtons()}
          </View>
        </View>
        <View style={styles.logsContainer}>
          <VirtualizedList
            data={filteredLogs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }: any) => (
              <View style={styles.logContainer}>
                <View >
                  <Text style={styles.text}>
                    {moment(item.timestamp).format('HH:mm:ss')}
                  </Text>
                  <Text style={styles.text}>HTTP {item.type}</Text>
                </View>
                <Text style={styles.text}>URL: {item.message}</Text>
                <Text style={styles.text}>Status: {item.status}</Text>
                <Text style={styles.text}>Request Data: {item.requestData}</Text>
                <Text style={styles.text}>Response Data: {item.responseData}</Text>
              </View>
            )}
            getItemCount={(data) => data.length}
            getItem={(data, index) => data[index]}
            initialNumToRender={5}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flex: .05,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  logTypeButtonContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 5,
    marginHorizontal: 5
  },
  logsContainer: {
    flex: .87,
  },
  logContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 5,
    marginBottom: 10,
    marginHorizontal: 10
  },
  logTypeButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingBottom: 20
  },
  text: {
    fontSize: 10,
    color: '#444'
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});




export default ServerLogger;