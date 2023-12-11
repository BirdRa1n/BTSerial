# BTSerial

This is a new [**React Native**](https://reactnative.dev) project, specifically designed for managing Bluetooth Low Energy (BLE) devices and reading serial data. The project is bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

## Dependencies

This project relies on the following libraries:

- [**react-native-ble-manager**](https://github.com/innoveit/react-native-ble-manager): A React Native library for interacting with BLE (Bluetooth Low Energy) devices.
- [**gluestack-ui**](https://github.com/gluestack/gluestack-ui): A UI component library for React Native.

Make sure to install these dependencies before running the application.

```bash
# using npm
npm install react-native-ble-manager @gluestack/gluestack-ui

# OR using Yarn
yarn add react-native-ble-manager @gluestack/gluestack-ui
```

## Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till the "Creating a new application" step, before proceeding.

### Step 1: Start the Metro Server

Start **Metro**, the JavaScript _bundler_ that ships _with_ React Native. Run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

### Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

#### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

#### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If set up _correctly_, your app should run in your _Android Emulator_ or _iOS Simulator_.

### Step 3: Modifying your App

Now that your app is running, let's modify it:

1. Open `App.tsx` in your text editor and make edits.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> on Windows/Linux or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> on macOS) to see your changes.

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see changes.

## Congratulations! :tada:

You've successfully run and modified your BTSerial app. :partying_face:

### Next Steps

- If you want to integrate this React Native code into an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- For more on React Native, explore the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

## Troubleshooting

If you encounter issues, refer to the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

## Learn More

Explore more about React Native with these resources:

- [React Native Website](https://reactnative.dev) - Learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - Overview of React Native and setting up your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - Guided tour of React Native basics.
- [Blog](https://reactnative.dev/blog) - Read the latest official React Native blog posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - Open-source GitHub repository for React Native.
