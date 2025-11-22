# Pop Kollection App 🎯

A React Native/Expo cross-platform pop vinyl figure collection tracker with smart search, haptic feedback, audio cues, and modern glassmorphism UI. Track your collection across iOS, Android, and Web with platform-specific optimizations.

## ✨ Features

- **Smart Search**: Debounced search with 500ms delay for optimal performance
- **Cross-Platform**: Runs on iOS, Android, and Web with platform-specific UI
- **Haptic + Audio Feedback**: iOS-like interactions with touch feedback and sound
- **Modern UI**: Glassmorphism effects, 2-column grid layout, custom fonts
- **Safe Area Support**: Proper handling of notches and device variations
- **Real-time Filtering**: Instant search results with performance optimization
- **Form Validation**: Yup schema validation for data integrity
- **Mock Data**: Testing with sample pop vinyl figures
- **Empty States**: Intuitive onboarding with "Add Your First Item" CTA

## 🛠️ Tech Stack

- **React Native** 0.81.5 with **Expo SDK 54**
- **expo-router** for file-based navigation
- **TypeScript** for type safety
- **expo-audio** for sound feedback
- **expo-haptics** for tactile feedback
- **expo-glass-effect** for glassmorphism UI
- **react-native-vector-icons** for web icons
- **Yup** for form validation
- **TanStack Query** for data fetching (planned)
- **SQLite/IndexedDB** for platform-aware storage (planned)

## 📱 Running the App

### Prerequisites

```bash
# Install dependencies
npm install

# For iOS development
sudo gem install cocoapods
cd ios && pod install && cd ..
```

### Development Server (Expo Go)

```bash
# Start the Expo development server
npx expo start

# Options:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Press 'w' for web browser
# - Scan QR code with Expo Go app on physical device
```

### iOS Simulator

```bash
# Run on iOS simulator (Mac only)
npx expo run:ios

# Specify simulator
npx expo run:ios --simulator "iPhone 15 Pro"

# List available simulators
xcrun simctl list devices
```

### iOS Physical Device

#### Option 1: Connected via USB (Recommended for Development)

```bash
# Connect iPhone via USB cable
# Unlock device and trust computer

# Run on connected device
npx expo run:ios --device

# If multiple devices connected, specify by name
npx expo run:ios --device "Your iPhone Name"

# First time: Trust developer certificate on device
# Settings → General → VPN & Device Management → Trust
```

#### Option 2: Expo Go App (Quick Testing)

```bash
# Start server
npx expo start

# Scan QR code with Camera app (iOS)
# Opens in Expo Go app automatically
```

#### Option 3: Development Build (Full Native Features)

```bash
# Install development client
npx expo install expo-dev-client

# Create development build
npx expo run:ios --device

# Start dev client
npx expo start --dev-client
```

### Android Emulator

```bash
# Start Android emulator first, then:
npx expo run:android

# Or let Expo start emulator automatically
npx expo start
# Press 'a' to open Android
```

### Android Physical Device

```bash
# Enable USB debugging on Android device
# Connect via USB

npx expo run:android --device

# Or use Expo Go:
npx expo start
# Scan QR code with Expo Go app
```

### Web Browser

```bash
# Run in web browser
npx expo start --web

# Or
npm run web

# Opens at http://localhost:8081
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx        # Home: 2-col grid, search, empty state
│   │   ├── add.tsx          # Add Funko form with validation
│   │   ├── about.tsx        # About screen
│   │   └── _layout.tsx      # Tab navigation (top on web, bottom on mobile)
│   └── _layout.tsx          # Root: SafeArea, QueryClient, fonts
├── components/
│   ├── funkos/
│   │   └── FunkoCard.tsx    # Card: image, number badge, haptics
│   ├── themed-view.tsx      # Themed container
│   └── themed-text.tsx      # Themed text
├── constants/
│   ├── mock-data.ts         # Sample Funkos for testing
│   └── theme.ts             # App theme configuration
├── hooks/
│   ├── useFunkos.tsx        # TanStack Query CRUD hooks
│   └── useHapticFeedback.ts # Haptic + audio feedback
├── screens/
│   └── FunkoForm.tsx        # Form: Yup validation, date picker
└── services/
    ├── database.ts          # SQLite (native)
    ├── database.web.ts      # IndexedDB (web)
    └── images.ts            # Platform-aware image storage
```

## 🎨 Key Implementations

### 1. Platform-Specific UI

```typescript
// Web: top navigation, centered content, white backgrounds
// Mobile: bottom tabs, full width, themed backgrounds
Platform.OS === "web" ? (
  <View style={{ backgroundColor: "white", maxWidth: 1200 }}>{content}</View>
) : (
  content
);
```

### 2. Haptic + Audio Feedback

```typescript
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

const { playFeedback } = useHapticFeedback();
playFeedback("medium"); // Plays haptic + click sound
```

### 3. Form Validation with Yup

```typescript
const schema = yup.object().shape({
  name: yup.string().required().min(2).max(100),
  number: yup
    .string()
    .required()
    .matches(/^[0-9]+$/),
  condition: yup.string().oneOf(["mint", "near_mint", "good", "fair", "poor"]),
});
```

### 4. Debounced Search

```typescript
const [searchQuery, setSearchQuery] = useState("");
const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearchQuery(searchQuery);
  }, 500);
  return () => clearTimeout(timer);
}, [searchQuery]);
```

### 5. Safe Area Integration

```typescript
import { useSafeAreaInsets } from "react-native-safe-area-context";

const insets = useSafeAreaInsets();
<View style={{ paddingTop: insets.top }}>{content}</View>;
```

## 🔧 Development Commands

```bash
# Development
npm run start              # Start Expo dev server
npm run android            # Run Android emulator
npm run ios                # Run iOS simulator
npm run web                # Run web browser

# Device testing
npx expo run:ios --device  # iOS physical device
npx expo run:android --device  # Android physical device

# Troubleshooting
npx expo start --clear     # Clear cache
npx expo run:ios --clean   # Clean iOS build
npm run reset-project      # Reset to blank template

# Dependencies
npm install                # Install packages
cd ios && pod install      # Install iOS pods
```

## 🐛 Troubleshooting

### iOS Device Not Detected

```bash
# Check connected devices
xcrun xctrace list devices

# Fixes:
# 1. Unlock device
# 2. Trust computer on device
# 3. Restart Xcode
# 4. Unplug and replug USB
```

### Build Fails

```bash
# Clean and rebuild
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
npx expo run:ios --device --clean
```

### Metro Bundler Issues

```bash
# Clear cache and restart
npx expo start --clear
# Or delete node_modules and reinstall
rm -rf node_modules && npm install
```

### "Untrusted Developer" on Device

- Go to: **Settings → General → VPN & Device Management**
- Tap your developer certificate
- Tap "Trust"

## 🎯 Current Implementation Status

### ✅ Completed

- Smart search with debouncing
- 2-column grid layout with FunkoCard
- Haptic + audio feedback system
- Platform-specific UI (web vs mobile)
- Form validation with Yup
- Empty state with CTA
- Mock data for testing
- Safe area handling
- Custom Slackey font
- Glassmorphism effects

### 🚧 In Progress

- Database CRUD operations
- Image upload and storage
- Detail screen navigation

### 📋 Planned

- [ ] Advanced search filters
- [ ] Collection statistics
- [ ] Export/import data
- [ ] Cloud sync
- [ ] Camera integration
- [ ] Barcode scanning
- [ ] Price tracking
- [ ] Wishlist feature

## 🏛️ Architecture Patterns

### Platform-Aware Services

```typescript
// Proxy pattern for platform-specific implementations
export const db = Platform.select({
  web: () => require("./database.web"),
  default: () => require("./database"),
})();
```

### State Management

- **UI State**: React useState for immediate feedback
- **Server State**: TanStack Query for data fetching
- **Debounced State**: useEffect + setTimeout for performance

### Component Organization

- **Screens**: Full-page components in `src/screens/`
- **Components**: Reusable UI in `src/components/`
- **Hooks**: Custom hooks in `src/hooks/`
- **Services**: Platform logic in `src/services/`

## 🤝 Contributing

This project follows AI-agent friendly development patterns. See `.github/copilot-instructions.md` for:

- Code architecture guidelines
- Component patterns
- State management conventions
- Platform-specific best practices

## 📄 License & Usage

**Copyright © 2025 Carlos Ortiz Bravo. All Rights Reserved.**

This is a **proprietary project** provided for reference and portfolio demonstration purposes only.

### ⚠️ Important Usage Terms

- ✅ **Allowed**: View source code for educational purposes
- ✅ **Allowed**: Study implementation patterns and techniques
- ✅ **Allowed**: Reference in discussions or educational contexts
- ❌ **Prohibited**: Commercial use without written permission
- ❌ **Prohibited**: Distribution or redistribution of the code
- ❌ **Prohibited**: Creating derivative works or modified versions
- ❌ **Prohibited**: Using in production applications or products

See [LICENSE](./LICENSE) file for full terms and conditions.

### 💼 Commercial Licensing & Collaboration

Interested in using this code commercially, collaboration opportunities, or custom development?

**Contact:** cob3x85.apple@outlook.com  
**Repository:** https://github.com/cob3x85/missing-funko-app

### 🏷️ Trademark Notice

"Pop Kollection" and associated branding materials are trademarks of Carlos Ortiz Bravo.

---

**Built with ❤️ using React Native, Expo, and modern mobile development practices**

_This app is not affiliated with, endorsed by, or sponsored by Funko, Inc. or any other vinyl figure manufacturer. All product names, trademarks, and registered trademarks are property of their respective owners._
