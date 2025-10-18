# Expo CLI Commands & EAS Development Build Guide

## 📋 Common Expo CLI Commands

### Development Server

- `npx expo start` - Starts the development server (works with development build or Expo Go)
- `npx expo start --web` - Start the web development server
- `npx expo start --android` - Start and open Android emulator/device
- `npx expo start --ios` - Start and open iOS simulator/device
- `npx expo start --clear` - Start with cleared Metro bundler cache

### Building & Compilation

- `npx expo prebuild` - Generates native Android and iOS directories using Prebuild
- `npx expo run:android` - Compiles native Android app locally
- `npx expo run:ios` - Compiles native iOS app locally

### Package Management

- `npx expo install package-name` - Install a new library (Expo-compatible version)
- `npx expo install --fix` - Validate and update specific libraries in your project

### Code Quality & Diagnostics

- `npx expo lint` - Setup and configure ESLint, or lint your project files if already configured
- `npx expo-doctor` - Diagnose issues in your Expo project (checks config, dependencies, etc.)
- `npx expo-doctor --help` - Display usage information for Expo Doctor

### Project Management

- `npx create-expo-app MyApp` - Create a new Expo project
- `npx expo upgrade` - Upgrade to the latest Expo SDK version

## 🔧 EAS CLI Installation & Commands

### Installation

```bash
npm install -g eas-cli
```

### Authentication

- `eas login` - Log in to your Expo account
- `eas logout` - Log out from your Expo account
- `eas whoami` - Check which account you're logged in with

### Development Builds

- `eas build --platform android --profile development` - Create Android development build
- `eas build --platform ios --profile development` - Create iOS development build
- `eas build --platform all --profile development` - Create development builds for both platforms

### Production Builds

- `eas build --platform android --profile production` - Create Android production build
- `eas build --platform ios --profile production` - Create iOS production build

### App Store Submission

- `eas submit --platform android` - Submit Android app to Google Play Store
- `eas submit --platform ios` - Submit iOS app to Apple App Store

### Updates (OTA)

- `eas update` - Create and publish an over-the-air update
- `eas update --branch production` - Publish update to specific branch

### Configuration

- `eas build:configure` - Configure EAS Build for your project
- `eas update:configure` - Configure EAS Update for your project

### Help & Information

- `eas --help` - Display all available EAS CLI commands
- `eas build --help` - Display build-specific commands and options

## 📱 Development Build Setup

### What is a Development Build?

A development build is a version of your app that includes the Expo development tools and can load JavaScript bundles from your development server. It's like a customizable version of Expo Go that includes your native dependencies.

### Why Use Development Builds?

- ✅ Install any native library from npm
- ✅ Full access to native APIs
- ✅ Custom native code support
- ✅ Production-ready builds
- ✅ Better performance than Expo Go

### Setup Steps

1. **Install EAS CLI globally:**

   ```bash
   npm install -g eas-cli
   ```

2. **Login to your Expo account:**

   ```bash
   eas login
   ```

3. **Configure EAS Build:**

   ```bash
   eas build:configure
   ```

4. **Create development build:**

   ```bash
   # For Android
   eas build --platform android --profile development

   # For iOS
   eas build --platform ios --profile development

   # For both platforms
   eas build --platform all --profile development
   ```

5. **Install the build on your device:**

   - **Android:** Download the APK from the build URL and install
   - **iOS:** Use TestFlight or install via Apple Configurator/Xcode

6. **Start development server:**
   ```bash
   npx expo start --dev-client
   ```

## 🔍 Additional Tools

### Expo Doctor

- `npx expo-doctor` - Comprehensive project health check
- Validates app config and package.json
- Checks dependency compatibility
- Analyzes project structure

### Orbit (macOS/Windows)

```bash
# Install on macOS
brew install expo-orbit
```

- Install and launch EAS builds on devices/emulators
- Manage development builds
- Launch Snack projects

### VS Code Extension

- **Expo Tools** - Provides autocomplete and IntelliSense for Expo config files
- Install from VS Code marketplace: Search "Expo Tools"

## 🌐 Testing & Prototyping

### Expo Go (For Simple Projects)

- Download from App Store/Play Store
- Scan QR code from `npx expo start`
- ⚠️ Limited to Expo SDK libraries only

### Snack (Browser-based)

- Visit [snack.expo.dev](https://snack.expo.dev)
- Test React Native code in browser
- Great for sharing code snippets

## 📚 Useful Resources

- [Expo CLI Reference](https://docs.expo.dev/more/expo-cli)
- [EAS CLI npm page](https://www.npmjs.com/package/eas-cli)
- [React Native Directory](https://reactnative.directory/) - Find compatible libraries
- [Expo SDK Versions](https://docs.expo.dev/versions/latest)

## 🎯 Pro Tips

1. **Always use `npx expo install`** instead of `npm install` for React Native packages
2. **Use development builds** for any project that needs native libraries
3. **Run `expo-doctor`** regularly to catch configuration issues early
4. **Clear Metro cache** with `--clear` flag when experiencing weird issues
5. **Keep your Expo CLI updated:** `npm install -g @expo/cli@latest`

---

_This guide is based on the official Expo documentation as of October 2025_
