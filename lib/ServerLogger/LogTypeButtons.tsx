import React, { useCallback } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { LOG_TYPES, LogType } from '../types/types';
import { useStyles } from './styles';

interface LogTypeButtonProps {
  type: LogType;
  onPress: () => void;
  isActive: boolean;
}

const LogTypeButton: React.FC<LogTypeButtonProps> = ({ type, onPress, isActive }) => {
  const styles = useStyles();

  return (
    <TouchableOpacity onPress={onPress} accessibilityLabel={`Filter by ${type} logs`}>
      <View style={[styles.logTypeButtonContainer, isActive && styles.activeLogTypeButtonContainer]}>
        <Text style={[styles.text, isActive && styles.activeLogTypeButtonText]}>{type}</Text>
      </View>
    </TouchableOpacity>
  );
};

interface LogTypeButtonsProps {
  logType: LogType;
  setLogType: (type: LogType) => void;
}

const LogTypeButtons: React.FC<LogTypeButtonsProps> = ({ logType, setLogType }) => {
  const renderLogTypeButton = useCallback(
    (type: LogType) => (
      <LogTypeButton key={type} type={type} isActive={type === logType} onPress={() => setLogType(type)} />
    ),
    [logType, setLogType]
  );

  return <>{LOG_TYPES.map(renderLogTypeButton)}</>;
};

export default LogTypeButtons;

