//@ts-nocheck
import React, { useCallback } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { LOG_TYPES } from '../types/types';
import styles from './styles';

const LogTypeButton = ({ type, onPress, isActive }) => (
    <TouchableOpacity onPress={onPress}>
        <View style={[styles.logTypeButtonContainer, isActive && styles.activeLogTypeButtonContainer]}>
            <Text style={[styles.text, isActive && styles.activeLogTypeButtonText]}>
                {type}
            </Text>
        </View>
    </TouchableOpacity>
);

const LogTypeButtons = ({ logType, setLogType }) => {
    const renderLogTypeButton = useCallback(
        (type) => (
            <LogTypeButton
                key={type}
                type={type}
                isActive={type === logType}
                onPress={() => setLogType(type)}
            />
        ),
        [logType, setLogType]
    );

    return (
        <>
            {LOG_TYPES.map(renderLogTypeButton)}
        </>
    );
};

export default LogTypeButtons;
