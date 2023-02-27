// @ts-nocheck
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, StyleSheet, View, Text, Platform, Switch, Button, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import RNShake from 'react-native-shake';
import moment from 'moment';
import { useServerLogger, exportLogsToFileAndShare } from '../services/LoggerService';
import { LOG_TYPES } from "../types/types";

function useAsync<DataType>(
  asyncFn: () => Promise<DataType>,
  onSuccess: (data: DataType) => void
) {
  useEffect(() => {
    let isActive = true;
    asyncFn().then(data => {
      if (isActive) onSuccess(data);
    });
    return () => { isActive = false };
  }, [asyncFn, onSuccess]);
}

const SCREEN_WIDTH = Dimensions.get('window').width;

interface State {
  showLogger: boolean;
  logType: string;
}

const ServerLogger = () => {
  const [logs, isTrackingLogs, toggleTracking, clearLogs] = useServerLogger();
  const [state, setState] = useState({ showLogger: true, logType: 'REQUEST' });                             // adjust dependencies to your needs

  useAsync(async () => {
    const isTracking = await RNShake.isShakeDetectionSupported();
    return isTracking;
  }, (isTracking) => {
    if (isTracking) {
      RNShake.addEventListener('ShakeEvent', () => {
        setState(prevState => ({ ...prevState, showLogger: true }));
      });
    }
  });

  const onExport = useCallback(() => {
    setState(prevState => ({ ...prevState, showLogger: false }));
    setTimeout(() => exportLogsToFileAndShare([...logs.REQUEST, ...logs.RESPONSE, ...logs.ERROR]), 300);
  }, [logs.REQUEST, logs.RESPONSE, logs.ERROR]);

  const onClear = useCallback(() => {
    clearLogs();
  }, [clearLogs]);

  const renderLogTypeButtons = useCallback(() => LOG_TYPES.map(type => (
    <TouchableOpacity key={type} onPress={() => setState(prevState => ({ ...prevState, logType: type }))}>
      <View style={styles.logTypeButtonContainer}>
        <Text style={[styles.text, type === state.logType && { fontWeight: 'bold' }]}>{type}</Text>
      </View>
    </TouchableOpacity>
  )), [state.logType]);

  const shouldDisableButtons = useMemo(() => logs.REQUEST.length === 0 && logs.RESPONSE.length === 0 && logs.ERROR.length === 0, [logs]);

  const filteredLogs = useMemo(() => logs[state.logType]
    .filter((log: ILog) => moment(log.timestamp).isAfter(moment().subtract(1, 'minute')))
    .sort((a: ILog, b: ILog) => b.timestamp - a.timestamp), [logs, state.logType]);

  return (
    <Modal visible={state.showLogger} transparent={false} animationType="slide" onRequestClose={() => setState(prevState => ({ ...prevState, showLogger: false }))}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>SERVER LOGS</Text>
          <Button title="Close" onPress={() => setState(prevState => ({ ...prevState, showLogger: false }))} />
        </View>
        <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, justifyContent: 'space-around' }}>
          {renderLogTypeButtons()}
        </View>
        <FlatList data={filteredLogs} keyExtractor={(_, index) => index.toString()} renderItem={({ item }) => (
          <View style={styles.logContainer}>
            <View style={styles.logHeaderContainer}>
              <Text style={styles.text}>{item.type}</Text>
              {state.logType !== LOG_TYPES[0] && <Text style={styles.text}>{`STATUS: ${item.status}`}</Text>}
              <Text style={styles.text}>{moment(item.timestamp).format('DD-MM-YY HH:mm:ss.SSS')}</Text>
            </View>
            <Text style={[styles.text, { paddingVertical: 5 }]}>{`URL: ${item.url}`}</Text>
            <Text style={[styles.text, { paddingVertical: 5 }]}>{`REQUEST DATA: ${item.requestData}`}</Text>
            {state.logType !== LOG_TYPES[0] && <Text style={[styles.text, { paddingVertical: 5 }]}>{`RESPONSE DATA: ${item.responseData}`}</Text>}
          </View>
        )} ListEmptyComponent={() => (<View style={styles.emptyListContainer}>
          <Text style={styles.title}>{'No logs in the\npast 60 seconds'}</Text>
        </View>)} />

        <View style={styles.footerContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.text, { marginRight: 5 }]}>Track</Text>
            <Switch value={isTrackingLogs} onValueChange={toggleTracking} />
          </View>

          <Button title="Export" onPress={onExport} disabled={shouldDisableButtons} />
          <Button title="Clear" onPress={onClear} color="red" disabled={shouldDisableButtons} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 30 : 0,
    backgroundColor: '#fff'
  },
  headerContainer: {
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  title: {
    fontSize: 12,
    paddingVertical: 5,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  footerContainer: {
    flexDirection: 'row',
    width: SCREEN_WIDTH,
    paddingVertical: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1
  },
  logContainer: {
    width: SCREEN_WIDTH,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1
  },
  logHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  text: {
    fontSize: 11
  },
  logTypeButtonContainer: {
    width: SCREEN_WIDTH / 3,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyListContainer: {
    width: SCREEN_WIDTH,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center'
  }
});


export default ServerLogger;
