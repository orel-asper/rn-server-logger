import { format } from 'date-fns';

/**
 * Format timestamp to time string (HH:mm:ss)
 */
export const formatTime = (timestamp: number): string => {
  return format(new Date(timestamp), 'HH:mm:ss');
};

/**
 * Format timestamp to date and time string (dd-MM-yy HH:mm:ss.SSS)
 */
export const formatDateTime = (timestamp: number): string => {
  return format(new Date(timestamp), 'dd-MM-yy HH:mm:ss.SSS');
};

/**
 * Format timestamp to filename-safe string
 */
export const formatDateTimeForFilename = (timestamp: number): string => {
  return format(new Date(timestamp), 'yyyy-MM-dd_HH-mm-ss');
};

/**
 * Get current timestamp
 */
export const getCurrentTimestamp = (): number => {
  return Date.now();
};
