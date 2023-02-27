# rn-server-logger
A React-Native module for tracking server traffic, present it in-app and export it (designed for testing purposes)

## Quick start

#### 1. Install the module dependencies using [Yarn](https://yarnpkg.com)
```shell
yarn add react-native-shake react-native-fs react-native-share axios-inherit moment 
cd ios && pod install
```

#### 2. Add before the *FIRST* usage of axios.create the following code at the top of the file (after the import of axios):
```shell
const axiosInherit = require('axios-inherit');
axiosInherit(axios);
```

#### 3. Add the ServerLogger component to the App component and make sure to render it only in test env, for example:
```shell
const App = () => {
  return (
    <View style={styles.container}>
      <Provider store={store}>
        <NavigationContainer>
          <Root />
        </NavigationContainer>
      </Provider>
      
      {TEST_ENV_FLAG && <ServerLogger />}
    </View>
  );
};

```
