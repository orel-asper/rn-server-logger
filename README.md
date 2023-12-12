### [](#header-3) rn-server-logger
rn-server-logger is a React-Native module designed for tracking server traffic, presenting it in the app, and exporting it, primarily for testing purposes. This module uses axios, moment, react-native-fs, react-native-share, and react-native-shake as its dependencies.

## Quick start
#### 1. Install the module:
```shell
yarn add rn-server-logger 
``` 
## Important note: Make sure to use react-native-shake version 5.1.1 without a caret (^) in the dependency.

add the dependency to your package.json file:
```shell
yarn add react-native-shake@5.1.1 react-native-fs react-native-share axios-inherit moment && cd ios && pod install && cd .. 
```
``` 
#### 2. Add the following code at the top of the file, after importing axios, before the first usage of axios.create:
```shell
const axiosInherit = require('axios-inherit');
axiosInherit(axios);
```

#### 3.Add the ServerLogger component to your App component and make sure to only render it in the test environment, for example:
```shell

export const serverLoggerRef = React.createRef<{printHelper: (message: string) => void}>()

const App = () => {
  return (
    <View style={styles.container}>
      <Provider store={store}>
        <NavigationContainer>
          <Root />
        </NavigationContainer>
      </Provider>
      
      {TEST_ENV_FLAG && <ServerLogger ref={serverLoggerRef} />}
      <Button onPress={() => {
        serverLoggerRef?.current?.printHelper('message');
      }} />
    </View>
  );
};

```

## Changes
#### renderLogTypeButtons function
The renderLogTypeButtons function has been refactored to a new custom hook named useLogTypeButtons, which returns an array of JSX elements representing the log type buttons.

#### filteredLogs function
The filteredLogs function has been refactored to a new custom hook named useFilteredLogs, which returns an array of log objects that match the search text and log type selected by the user.

#### highlightedText function
The highlightedText function has been updated to use the useMemo hook for performance optimization.
