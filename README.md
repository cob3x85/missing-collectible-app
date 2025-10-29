# Fun-Kollection App 🎯

A React Native/Expo cross-platform app for tracking your Funko Pop collection with smart search and modern UI.

## � Features

- **Smart Search**: Debounced search with 500ms delay for optimal performance
- **Cross-Platform**: Runs on iOS, Android, and Web
- **Safe Area Support**: Proper handling of notches and device variations
- **Responsive Design**: Clean, modern UI with themed components
- **Real-time Filtering**: Instant search results with performance optimization

## 🛠️ Tech Stack

- **React Native** 0.81.5 with **Expo SDK 54**
- **expo-router** for file-based navigation
- **TypeScript** for type safety
- **@expo/vector-icons** for consistent iconography
- **react-native-safe-area-context** for device compatibility

## 📱 Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npx expo start
   ```

3. **Run on your preferred platform**

   ```bash
   # iOS Simulator
   npx expo run:ios

   # Android Emulator
   npx expo run:android

   # Web Browser
   npx expo start --web
   ```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx        # Home screen with search
│   │   ├── add.tsx          # Add new Funko
│   │   └── about.tsx        # About screen
│   └── _layout.tsx          # Root layout with providers
├── components/
│   ├── funkos/
│   │   └── FunkoCard.tsx    # Individual Funko display
│   ├── themed-view.tsx      # Themed container component
│   └── themed-text.tsx      # Themed text component
└── constants/
    └── theme.ts             # App theme configuration
```

## 🔍 Current Implementation

### Search Functionality

The app features a sophisticated search system:

- **Immediate UI feedback**: Search input updates instantly
- **Debounced filtering**: Results update 500ms after typing stops
- **Performance optimized**: Uses `useMemo` to prevent unnecessary re-renders

### Sample Data

Currently uses mock data for development:

- 6 Dragon Ball Z themed Funko Pops
- Searchable by character names
- Ready for database integration

## 🎨 Design Patterns

### Safe Area Integration

```typescript
import { useSafeAreaInsets } from "react-native-safe-area-context";

const insets = useSafeAreaInsets();
// Apply to main containers for proper spacing
```

### Debounced Search

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

## 🚧 Development

### Available Scripts

```bash
npm run start           # Start Expo development server
npm run android        # Run on Android emulator
npm run ios           # Run on iOS simulator
npm run web           # Run in web browser
npm run reset-project # Reset to blank Expo template
```

### Code Quality

- **TypeScript**: Full type safety throughout the app
- **ESLint**: Configured with Expo recommended rules
- **Consistent styling**: Uses `StyleSheet.create()` for performance

## 📋 Roadmap

### Planned Features

- [ ] **Database Integration**: SQLite for mobile, IndexedDB for web
- [ ] **Image Upload**: Camera and gallery integration
- [ ] **Collection Management**: Categories and custom collections
- [ ] **Data Persistence**: Offline support with sync
- [ ] **Advanced Search**: Filter by series, condition, price range
- [ ] **Statistics**: Collection value tracking and analytics

### Architecture Goals

- [ ] Platform-aware service layer with proxy pattern
- [ ] TanStack Query for server state management
- [ ] Error boundaries with Sentry integration
- [ ] Comprehensive testing suite

## 🤝 Contributing

This project is designed to be AI-agent friendly. See `.github/copilot-instructions.md` for detailed development guidelines and patterns.

### Development Guidelines

1. Use debounced search patterns for performance
2. Implement proper safe area handling
3. Follow TypeScript best practices
4. Use themed components for consistency
5. Test on multiple platforms

## 📄 License

This project is part of a React Native learning series focusing on cross-platform development best practices.

---

**Note**: This app is currently in development. Database integration and advanced features are planned for future releases.
