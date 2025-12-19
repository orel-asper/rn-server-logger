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
  FlatList,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Clipboard,
  Alert,
} from 'react-native';
import { formatTime } from '../utils/dateUtils';
import { escapeRegex } from '../utils/sanitization';
import { startShakeListener, stopShakeListener } from '../utils/shakeDetection';
import useServerLogger from '../hooks/useServerLogger';
import exportLogsToFileAndShare from '../services/exportLogsToFileAndShare';
import { useStyles } from './styles';
import LogTypeButtonGroup from './LogTypeButtons';
import { LogType, Log, NetworkLog, PrintLog } from '../types/types';

export interface ServerLoggerRef {
  printHelper: (message: string | object) => void;
}

const ServerLogger = forwardRef<ServerLoggerRef>((_, ref) => {
  const { logs, isTrackingLogs, toggleTracking, clearLogs, printHelper } = useServerLogger({
    maxLogs: 1000,
    enableTracking: true,
  });

  const [logType, setLogType] = useState<LogType>('REQUEST');
  const [showLogger, setShowLogger] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const styles = useStyles();

  const onDismiss = useCallback(() => {
    setShowLogger(false);
  }, []);

  const onShake = useCallback(() => {
    setShowLogger(true);
  }, []);

  const onClear = useCallback(() => {
    clearLogs();
  }, [clearLogs]);

  useEffect(() => {
    startShakeListener(onShake);
    return () => {
      stopShakeListener();
    };
  }, [onShake]);

  const onExport = useCallback(async () => {
    setIsExporting(true);
    try {
      const allLogs: Log[] = [...logs.REQUEST, ...logs.RESPONSE, ...logs.ERROR, ...logs.PRINT];

      await exportLogsToFileAndShare(allLogs, { format: 'txt' });
    } catch (error) {
      Alert.alert('Export Failed', 'Failed to export logs. Please try again.');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  }, [logs]);

  const shouldDisableButtons = useMemo(
    () =>
      logs.REQUEST.length === 0 &&
      logs.RESPONSE.length === 0 &&
      logs.ERROR.length === 0 &&
      logs.PRINT.length === 0,
    [logs]
  );

  const filteredLogs = useMemo(() => {
    const escapedSearchText = escapeRegex(searchText);
    const searchRegExp = new RegExp(escapedSearchText, 'i');
    const logTypeLogs = logs[logType] || [];

    return logTypeLogs.filter(log => {
      if (log.type === 'PRINT') {
        return searchRegExp.test(log.message || '');
      } else {
        const networkLog = log as NetworkLog;
        return (
          searchRegExp.test(networkLog.url || '') ||
          searchRegExp.test(networkLog.requestData || '') ||
          searchRegExp.test(networkLog.responseData || '')
        );
      }
    });
  }, [logs, logType, searchText]);

  const highlightedText = useCallback(
    (text: string | number | undefined, match: string) => {
      const textStr = String(text || '');
      const matchStr = String(match || '');

      if (!matchStr) {
        return <Text style={styles.text}>{textStr}</Text>;
      }

      const escapedMatch = escapeRegex(matchStr);
      const regex = new RegExp(escapedMatch, 'gi');
      const parts = textStr.split(regex);
      const matches = textStr.match(regex);

      const result = parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {matches && matches[i] && <Text style={styles.highlightedText}>{matches[i]}</Text>}
        </React.Fragment>
      ));

      return <Text style={styles.text}>{result}</Text>;
    },
    [styles.highlightedText, styles.text]
  );

  const copyToClipboard = useCallback((text: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied', 'Log content copied to clipboard');
  }, []);

  const renderLogItem = useCallback(
    ({ item }: { item: Log }) => {
      const isPrintLog = item.type === 'PRINT';
      const printLog = item as PrintLog;
      const networkLog = item as NetworkLog;

      return (
        <TouchableOpacity
          onLongPress={() =>
            copyToClipboard(
              isPrintLog
                ? printLog.message
                : `${networkLog.url}\n${networkLog.requestData}\n${networkLog.responseData}`
            )
          }
          accessibilityLabel={`Log entry from ${formatTime(item.timestamp)}`}
          accessibilityHint="Long press to copy to clipboard">
          <View style={styles.logContainer}>
            <View>
              <Text style={styles.text}>{formatTime(item.timestamp)}</Text>
              {!isPrintLog && <Text style={styles.text}>HTTP {item.type}</Text>}
            </View>
            <Text style={styles.text}>
              Message: {highlightedText(isPrintLog ? printLog.message : networkLog.url, searchText)}
            </Text>
            {!isPrintLog && networkLog.status > 0 && (
              <Text style={styles.text}>
                Status: {highlightedText(networkLog.status, searchText)}
              </Text>
            )}
            {!isPrintLog && networkLog.requestData && (
              <Text style={styles.text} numberOfLines={3}>
                Request Data: {highlightedText(networkLog.requestData, searchText)}
              </Text>
            )}
            {!isPrintLog && networkLog.responseData && (
              <Text style={styles.text} numberOfLines={3}>
                Response Data: {highlightedText(networkLog.responseData, searchText)}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [styles, searchText, highlightedText, copyToClipboard]
  );

  useImperativeHandle(
    ref,
    () => ({
      printHelper,
    }),
    [printHelper]
  );

  return (
    <Modal visible={showLogger} animationType="slide" onRequestClose={onDismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>SERVER LOGS</Text>
            <Button title="Close" onPress={onDismiss} accessibilityLabel="Close logger" />
            <Button
              title="Export"
              onPress={onExport}
              disabled={shouldDisableButtons || isExporting}
              accessibilityLabel="Export logs"
            />
            <Button
              title="Clear"
              onPress={onClear}
              disabled={shouldDisableButtons}
              accessibilityLabel="Clear all logs"
            />
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.textInput}
              onChangeText={setSearchText}
              value={searchText}
              placeholder="Search logs..."
              placeholderTextColor="#888"
              accessibilityLabel="Search logs"
            />
          </View>

          <View style={styles.logsContainer}>
            <FlatList
              data={filteredLogs}
              keyExtractor={(item, index) => `${item.timestamp}-${index}`}
              renderItem={renderLogItem}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={10}
              ListEmptyComponent={() => (
                <View style={styles.emptyListContainer}>
                  <Text style={styles.emptyText}>
                    {searchText ? 'No logs match your search' : `No ${logType} logs available`}
                  </Text>
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
                accessibilityLabel="Toggle log tracking"
              />
            </View>
            <View style={styles.logTypeButtonsContainer}>
              <LogTypeButtonGroup logType={logType} setLogType={setLogType} />
            </View>
          </View>

          {isExporting && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Exporting logs...</Text>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
});

ServerLogger.displayName = 'ServerLogger';

export default ServerLogger;
