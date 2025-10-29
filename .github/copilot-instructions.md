# AI Coding Agent Instructions - Fun-Kollection App

## Project Overview

A React Native/Expo cross-platform Funko collection tracking app with debounced search, safe area handling, and clean UI components.

## Current Implementation Status

### Completed Features

- **Search functionality**: Simple TextInput with 500ms debounced filtering
- **Safe area support**: Uses `useSafeAreaInsets` for proper device spacing
- **Mock data**: Static DATA array with sample Funko items for development
- **Responsive filtering**: Real-time search with performance optimization

### Architecture Patterns

#### Search Implementation (Current)

```typescript
// Two-state search pattern for performance
const [searchQuery, setSearchQuery] = useState(""); // Immediate UI
const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(""); // Filtering

// 500ms debounce using useEffect
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearchQuery(searchQuery);
  }, 500);
  return () => clearTimeout(timer);
}, [searchQuery]);
```

#### Safe Area Integration

```typescript
// Required for all screens
import { useSafeAreaInsets } from "react-native-safe-area-context";
const insets = useSafeAreaInsets();
// Apply to container: { paddingTop: insets.top }
```

#### Component Structure (Active)

- **Main Screen**: `src/app/(tabs)/index.tsx` - Home with search and list
- **Themed Components**: `ThemedView`/`ThemedText` for consistent styling
- **FlatList Pattern**: `ListHeaderComponent` for search, `ListEmptyComponent` for states

## Critical Development Patterns

### Search & Filtering

- **Immediate feedback**: TextInput updates `searchQuery` instantly
- **Debounced operations**: Filtering uses `debouncedSearchQuery` (500ms delay)
- **Consistent messaging**: Results counter and empty states use debounced query
- **TextInput setup**: Always include these props for React Native stability:
  ```typescript
  autoFocus={false}
  autoCorrect={false}
  autoCapitalize="none"
  spellCheck={false}
  ```

### Performance Optimization

- Use `useMemo` for filtered data to prevent unnecessary re-renders
- Debounce search to reduce filtering operations during typing
- `keyExtractor` and `showsVerticalScrollIndicator={false}` for FlatList

### State Management Principles

- Separate UI state (immediate) from business logic state (debounced)
- Use `useEffect` for side effects like debouncing
- Clear timers in cleanup functions to prevent memory leaks

## Component Guidelines

### FlatList Best Practices

```typescript
<FlatList
  style={[styles.container, { paddingTop: insets.top }]}
  data={filteredData}
  keyExtractor={(item) => item.id}
  ListHeaderComponent={renderHeader}
  contentContainerStyle={styles.listContent}
  ListEmptyComponent={EmptyStateComponent}
  showsVerticalScrollIndicator={false}
/>
```

### Styling Conventions

- Use `StyleSheet.create()` for performance
- Semi-transparent backgrounds: `rgba(255, 255, 255, 0.9)`
- Consistent border radius: `25px` for main containers
- Flexible layouts with `flex: 1` and `flexGrow: 1`

## Development Workflow

### Essential Commands

```bash
npx expo start          # Start development server
npx expo run:ios       # iOS simulator
npx expo run:android   # Android emulator
npm run reset-project  # Reset to blank slate
```

### Current Tech Stack

- **React Native**: 0.81.5 with Expo SDK 54
- **Navigation**: expo-router with file-based routing
- **Styling**: StyleSheet with safe area context
- **Icons**: @expo/vector-icons (Ionicons)
- **State**: React hooks (useState, useEffect, useMemo)

## File Organization

### Active Components

- `src/app/(tabs)/index.tsx` - Main home screen with search
- `src/components/themed-*.tsx` - Themed UI components
- `src/components/funkos/FunkoCard.tsx` - Individual item display

### Import Patterns

```typescript
// Always use @ alias for src imports
import { ThemedView } from "@/components/themed-view";
import { FunkoCard } from "@/components/funkos/FunkoCard";
```

## Platform Considerations

### Safe Area Handling

- **Required import**: `useSafeAreaInsets` from `react-native-safe-area-context`
- **Apply to containers**: Add `paddingTop: insets.top` to main containers
- **Cross-device support**: Handles notches, status bars, home indicators

### TypeScript Patterns

- Use proper timer types: `setTimeout(() => {}, delay)` returns correct type
- Interface definitions for component props and data structures
- Consistent typing for FlatList data and render functions

## Future Architecture (Planned)

### Platform-Aware Services (Not Yet Implemented)

- Database proxy pattern for SQLite (native) / IndexedDB (web)
- Image storage services with platform-specific implementations
- TanStack Query for server state management

### Advanced Features (Roadmap)

- Database persistence with CRUD operations
- Image upload and storage
- Collection management and categories
- Offline support and sync
