# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-01-01

### Added
- Dark mode support with automatic theme detection
- TypeScript strict mode compliance
- Multiple export formats (JSON, CSV, TXT)
- Log filtering by date range
- Log statistics and analytics
- Request duration tracking
- Copy to clipboard for individual logs
- Accessibility labels for all interactive elements
- SafeAreaView for modern devices
- Keyboard avoiding behavior
- Loading states for async operations
- Error boundaries
- Max log limit (1000) with auto-rotation
- Log grouping by endpoint/domain
- Debounced search input
- Sensitive data masking
- Regex injection protection
- FlatList for better performance
- Configurable options via hook parameters

### Changed
- Replaced `moment` with `date-fns` for date formatting
- Replaced `react-native-shake` with custom shake detection
- Updated to TypeScript 5.x
- Moved dependencies to `peerDependencies`
- Updated axios to latest version
- Replaced VirtualizedList with FlatList
- Improved URL sanitization
- Enhanced error handling throughout
- Modernized styling with responsive design
- Updated README with comprehensive documentation

### Fixed
- Removed all `@ts-nocheck` comments
- Fixed typo: `ServiceLoger.d.ts` → `ServiceLogger.d.ts`
- Fixed PRINT log type structure inconsistency
- Fixed missing dependency in `useImperativeHandle`
- Fixed hardcoded flex values in styles
- Added missing active button styles
- Fixed regex injection vulnerability in search
- Fixed memory leak with log accumulation
- Proper cleanup of axios interceptors

### Security
- Added regex escape for search input
- Implemented sensitive parameter sanitization
- Added option to mask sensitive data
- Added production build safety

## [1.0.19] - Previous Release

### Initial features
- Basic server logging for React Native
- Request/Response/Error tracking
- Export logs functionality
- Search and filter capabilities
