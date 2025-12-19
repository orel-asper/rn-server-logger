import { DeviceEventEmitter, Platform } from 'react-native';

let shakeSubscription: any = null;

/**
 * Start listening for shake gestures using DeviceEventEmitter
 * This is a simplified implementation without external dependencies
 */
export const startShakeListener = (onShake: () => void): void => {
  stopShakeListener();

  // For iOS and Android, we can use native shake detection
  // Note: This requires native module implementation or RNShake
  // For now, we'll provide a placeholder that can be replaced
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    try {
      shakeSubscription = DeviceEventEmitter.addListener('ShakeEvent', onShake);
    } catch (error) {
      console.warn('Shake detection not available:', error);
    }
  }
};

/**
 * Stop listening for shake gestures
 */
export const stopShakeListener = (): void => {
  if (shakeSubscription) {
    shakeSubscription.remove();
    shakeSubscription = null;
  }
};
