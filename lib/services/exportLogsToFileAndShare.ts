import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import { formatDateTime, formatDateTimeForFilename, getCurrentTimestamp } from '../utils/dateUtils';
import { Log, ExportOptions } from '../types/types';

/**
 * Export logs to file and share
 */
const exportLogsToFileAndShare = async (
  logs: Log[],
  options: ExportOptions = {}
): Promise<void> => {
  const { format = 'txt', fileName } = options;

  try {
    if (!logs || logs.length === 0) {
      throw new Error('No logs to export');
    }

    // Sort logs by timestamp (newest first)
    const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);

    // Generate content based on format
    let fileContent: string;
    let fileExtension: string;

    switch (format) {
      case 'json':
        fileContent = JSON.stringify(sortedLogs, null, 2);
        fileExtension = 'json';
        break;

      case 'csv':
        fileContent = convertToCSV(sortedLogs);
        fileExtension = 'csv';
        break;

      case 'txt':
      default:
        fileContent = convertToTXT(sortedLogs);
        fileExtension = 'txt';
        break;
    }

    // Generate filename with timestamp
    const timestamp = formatDateTimeForFilename(getCurrentTimestamp());
    const defaultFileName = `server-logs_${timestamp}.${fileExtension}`;
    const finalFileName = fileName || defaultFileName;

    // Determine file path based on platform
    const directory =
      Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.CachesDirectoryPath;
    const filepath = `${directory}/${finalFileName}`;

    // Write file
    await RNFS.writeFile(filepath, fileContent, 'utf8');

    // Share file
    const shareOptions = {
      title: 'Export Server Logs',
      url: Platform.OS === 'ios' ? filepath : `file://${filepath}`,
      type: getFileType(fileExtension),
      subject: 'Server Logs Export',
    };

    await Share.open(shareOptions);
  } catch (error) {
    console.error('Failed to export logs:', error);
    throw error;
  }
};

/**
 * Convert logs to TXT format
 */
const convertToTXT = (logs: Log[]): string => {
  let txtFile = '';

  logs.forEach(log => {
    if (log.type === 'PRINT') {
      txtFile += `
TYPE: ${log.type}
TIME: ${formatDateTime(log.timestamp)}
MESSAGE: ${log.message}
---------------------------------
`;
    } else {
      txtFile += `
TYPE: ${log.type}
TIME: ${formatDateTime(log.timestamp)}
URL: ${log.url}
REQUEST DATA: ${log.requestData}
RESPONSE DATA: ${log.responseData}
STATUS: ${log.status}
---------------------------------
`;
    }
  });

  return txtFile;
};

/**
 * Convert logs to CSV format
 */
const convertToCSV = (logs: Log[]): string => {
  const headers = 'Type,Time,URL,Request Data,Response Data,Status,Message\n';

  const rows = logs
    .map(log => {
      const time = formatDateTime(log.timestamp);

      if (log.type === 'PRINT') {
        return `"${log.type}","${time}","","","","","${escapeCSV(log.message)}"`;
      } else {
        return `"${log.type}","${time}","${escapeCSV(log.url)}","${escapeCSV(
          log.requestData
        )}","${escapeCSV(log.responseData)}","${log.status}",""`;
      }
    })
    .join('\n');

  return headers + rows;
};

/**
 * Escape special characters for CSV
 */
const escapeCSV = (str: string): string => {
  if (!str) return '';
  return str.replace(/"/g, '""').replace(/\n/g, ' ').replace(/\r/g, '');
};

/**
 * Get MIME type for file
 */
const getFileType = (extension: string): string => {
  switch (extension) {
    case 'json':
      return 'application/json';
    case 'csv':
      return 'text/csv';
    case 'txt':
    default:
      return 'text/plain';
  }
};

export default exportLogsToFileAndShare;

