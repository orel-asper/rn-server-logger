# rn-server-logger

A modern, feature-rich React Native module for tracking, debugging, and exporting HTTP server traffic with full TypeScript support, dark mode, and enhanced security features.

[![npm version](https://badge.fury.io/js/rn-server-logger.svg)](https://badge.fury.io/js/rn-server-logger)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features ✨

- 🔍 **Comprehensive Logging** - Track REQUEST, RESPONSE, ERROR, and custom PRINT logs
- 📱 **Modern UI** - Clean interface with dark mode support
- 🔒 **Security First** - Automatic sanitization of sensitive data (tokens, passwords, API keys)
- 💾 **Multiple Export Formats** - Export logs as TXT, JSON, or CSV
- ⚡ **Performance Optimized** - Auto log rotation with configurable limits (default: 1000 logs)
- 🎯 **TypeScript Native** - Full TypeScript support with strict mode
- 🔎 **Advanced Search** - Real-time search with regex protection
- 📋 **Copy to Clipboard** - Long-press any log to copy to clipboard
- ♿ **Accessible** - Full accessibility support with labels and hints
- 🌓 **Dark Mode** - Automatic dark mode detection and support
- 📊 **Flexible Filtering** - Filter by log type and search text
- 🤝 **React Native 0.74+** - Compatible with latest React Native versions

## Installation

### Using npm:
```bash
npm install rn-server-logger axios date-fns react-native-fs react-native-share
```

### Using yarn:
```bash
yarn add rn-server-logger axios date-fns react-native-fs react-native-share
```

### iOS Setup:
```bash
cd ios && pod install && cd ..
```

## Peer Dependencies

Make sure you have these peer dependencies installed:

```json
{
  "axios": ">=1.6.0",
  "date-fns": ">=3.0.0",
  "react": ">=18.2.0",
  "react-native": ">=0.74.0",
  "react-native-fs": ">=2.20.0",
  "react-native-share": ">=10.0.0"
}
```

## Quick Start

### 1. Add ServerLogger to your App

```typescript
import React from 'react';
import { View } from 'react-native';
import ServerLogger, { ServerLoggerRef } from 'rn-server-logger';

// Create a ref for the logger
export const serverLoggerRef = React.createRef<ServerLoggerRef>();

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      {/* Your app content */}
      
      {/* Add ServerLogger - only in development/test environments */}
      {__DEV__ && <ServerLogger ref={serverLoggerRef} />}
    </View>
  );
};

export default App;
```

### 2. Use the Print Helper

```typescript
import { serverLoggerRef } from './App';

// Log a simple message
serverLoggerRef?.current?.printHelper('User logged in successfully');

// Log an object
serverLoggerRef?.current?.printHelper({
  action: 'USER_LOGIN',
  userId: 12345,
  timestamp: new Date().toISOString(),
});
```

### 3. Access the Logger

The logger automatically tracks all axios HTTP requests. To open the logger:

- **Shake your device** (physical device)
- The logger will open automatically when shake is detected

## Configuration

### Hook Options

You can configure the logger behavior using hook options:

```typescript
import useServerLogger from 'rn-server-logger/lib/hooks/useServerLogger';

const {
  logs,
  isTrackingLogs,
  toggleTracking,
  clearLogs,
  printHelper,
} = useServerLogger({
  maxLogs: 500,              // Maximum number of logs to keep (default: 1000)
  enableTracking: true,      // Start tracking on mount (default: true)
  maskSensitiveData: false,  // Mask sensitive data in logs (default: false)
});
```

### Export Options

Customize log export format and filtering:

```typescript
import exportLogsToFileAndShare from 'rn-server-logger/lib/services/exportLogsToFileAndShare';

await exportLogsToFileAndShare(logs, {
  format: 'json',           // 'txt' | 'json' | 'csv' (default: 'txt')
  fileName: 'my-logs.json', // Custom filename (optional)
});
```

## API Reference

### ServerLogger Component

Main component that renders the logger modal.

**Props:** None (controlled via ref)

**Ref Methods:**
- `printHelper(message: string | object)` - Log a custom message

### useServerLogger Hook

Hook that manages logging state and interceptors.

**Parameters:**
```typescript
interface UseServerLoggerOptions {
  maxLogs?: number;              // Default: 1000
  enableTracking?: boolean;      // Default: true
  maskSensitiveData?: boolean;   // Default: false
  customSensitiveParams?: string[]; // Additional params to sanitize
}
```

**Returns:**
```typescript
interface UseServerLoggerReturn {
  logs: LoggerState;
  isTrackingLogs: boolean;
  toggleTracking: (value: boolean) => void;
  clearLogs: () => void;
  printHelper: (message: string | object) => void;
}
```

### Types

```typescript
import { LogType, Log, NetworkLog, PrintLog, LoggerState } from 'rn-server-logger';

// Log types
type LogType = 'REQUEST' | 'RESPONSE' | 'ERROR' | 'PRINT';

// Network log structure
interface NetworkLog {
  type: 'REQUEST' | 'RESPONSE' | 'ERROR';
  timestamp: number;
  url: string;
  requestData: string;
  responseData: string;
  status: number;
}

// Print log structure
interface PrintLog {
  type: 'PRINT';
  timestamp: number;
  message: string;
}
```

## Security Features

### Automatic URL Sanitization

The logger automatically removes sensitive query parameters from URLs:

- `accessToken`, `access_token`
- `token`, `apiKey`, `api_key`
- `password`, `pwd`
- `secret`, `auth`, `authorization`
- `session`, `sessionId`, `session_id`
- `key`, `private`

### Sensitive Data Masking

When `maskSensitiveData: true` is enabled, the logger will mask sensitive fields in request/response bodies containing keywords like:
- password
- token
- secret
- auth
- key

### Regex Injection Protection

Search input is automatically escaped to prevent regex injection attacks.

## Advanced Usage

### Custom Axios Instance

If you're using a custom axios instance, you can still use the logger:

```typescript
import axios from 'axios';
import useServerLogger from 'rn-server-logger/lib/hooks/useServerLogger';

// The hook automatically sets up interceptors on the default axios instance
// If using custom instances, you'll need to manually add interceptors
```

### Production Safety

**Important:** Only include the logger in development/test builds:

```typescript
{__DEV__ && <ServerLogger ref={serverLoggerRef} />}

// Or with environment variables
{process.env.NODE_ENV !== 'production' && <ServerLogger ref={serverLoggerRef} />}
```

### Memory Management

The logger automatically:
- Limits logs to 1000 entries (configurable)
- Rotates old logs when limit is reached
- Cleans up axios interceptors on unmount
- Prevents memory leaks

## Troubleshooting

### Logs Not Appearing

1. Make sure axios is properly installed
2. Verify the logger is rendered in your component tree
3. Check that `isTrackingLogs` is `true` (toggle in the UI)
4. Ensure your HTTP requests are using axios

### Shake Not Working

1. Test on a physical device (shake doesn't work in simulators)
2. Check that shake permissions are granted
3. Manually open the logger to test if it's rendering

### Export Failing

1. Check file system permissions
2. Verify react-native-fs is properly linked
3. Ensure react-native-share is installed and configured
4. Check platform-specific requirements (iOS/Android)

### TypeScript Errors

1. Make sure you're using TypeScript 5.x
2. Install @types packages: `@types/react`, `@types/react-native`
3. Check your tsconfig.json settings

## Migration from v1.x

### Breaking Changes

1. **Dependencies moved to peerDependencies**
   - Install `date-fns` instead of `moment`
   - Remove `react-native-shake` dependency

2. **Hook return value changed from array to object**
   ```typescript
   // Old (v1.x)
   const [logs, isTracking, toggle, clear, print] = useServerLogger();
   
   // New (v2.x)
   const { logs, isTrackingLogs, toggleTracking, clearLogs, printHelper } = useServerLogger();
   ```

3. **TypeScript strict mode required**
   - Remove all `@ts-nocheck` from your code
   - Add proper types

### Migration Steps

1. Update package.json dependencies
2. Install new peer dependencies (`date-fns`)
3. Update hook usage from array destructuring to object destructuring
4. Remove `axios-inherit` requirement (no longer needed)
5. Update imports if using internal components

## Examples

### Logging User Actions

```typescript
// Track user navigation
serverLoggerRef?.current?.printHelper({
  event: 'NAVIGATION',
  screen: 'ProfileScreen',
  userId: currentUser.id,
});

// Track feature usage
serverLoggerRef?.current?.printHelper({
  event: 'FEATURE_USED',
  feature: 'DarkMode',
  enabled: true,
});
```

### Custom Error Tracking

```typescript
try {
  await someAsyncOperation();
} catch (error) {
  serverLoggerRef?.current?.printHelper({
    type: 'ERROR',
    message: error.message,
    stack: error.stack,
    context: 'UserProfile',
  });
}
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.

## License

MIT © [OrelAsper](https://github.com/orel-asper)

## Support

- 🐛 [Report a bug](https://github.com/orel-asper/rn-server-logger/issues)
- 💡 [Request a feature](https://github.com/orel-asper/rn-server-logger/issues)
- 📖 [Documentation](https://github.com/orel-asper/rn-server-logger)

## Credits

Designed for modern React Native development with a focus on developer experience and security.

---

Made with ❤️ by [OrelAsper](https://github.com/orel-asper)

