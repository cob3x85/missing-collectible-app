# AI Coding Agent Instructions - Fun-Kollection App

## Project Overview

A React Native/Expo cross-platform Funko collection tracking app with SQLite persistence, TanStack Query state management, haptic feedback, and glassmorphism UI. Runs on iOS, Android, and Web.

## Architecture & Tech Stack

### Core Technologies

- **React Native 0.81.5** with **Expo SDK 54**
- **Navigation**: React Navigation with `@bottom-tabs/react-navigation` (native iOS tab bar, NOT expo-router)
- **State Management**: TanStack Query v5 for server state, React hooks for UI state
- **Database**: SQLite (native) with platform proxy pattern (`src/services/db.ts`)
- **UI**: `expo-glass-effect` for glassmorphism, `expo-haptics` for feedback
- **Validation**: Yup schemas for form validation
- **Images**: expo-file-system with JSON array storage in database

### Navigation Pattern (CRITICAL)

```typescript
// ✅ Use React Navigation hooks, NOT expo-router
import { useNavigation } from "@react-navigation/native";
const navigation = useNavigation();
navigation.navigate("Add" as never);

// ❌ NEVER use expo-router hooks
// import { useRouter } from "expo-router"; // WRONG
```

## Database Architecture

### Schema & Type Safety

- **Interface**: `src/database/schema.ts` - TypeScript interfaces
- **Implementation**: `src/services/database.ts` - SQLite with migrations
- **Proxy**: `src/services/db.ts` - Platform-aware database selection

### Critical Database Patterns

#### Boolean Storage (SQLite Limitation)

```typescript
// SQLite stores booleans as INTEGER (0/1)
// ALWAYS convert on write and read:

// Write: boolean → INTEGER
const intValue = has_protector_case ? 1 : 0;
await db.runAsync("INSERT ... VALUES (?)", [intValue]);

// Read: INTEGER → boolean
return { ...row, has_protector_case: row.has_protector_case === 1 };
```

#### Image Storage Pattern

```typescript
// Images stored as JSON array in singular column name
// Form sends: image_paths (plural array)
// Database column: image_path (singular, JSON string)

// Write transformation:
if (key === "image_paths" && Array.isArray(value)) {
  filteredUpdates["image_path"] = JSON.stringify(value);
}

// Read transformation:
const image_paths = funko.image_path ? JSON.parse(funko.image_path) : [];
return { ...funko, image_paths };
```

#### Database Migrations

```typescript
// Handle existing databases with try-catch for duplicate columns
try {
  await db.execAsync(
    "ALTER TABLE funkos ADD COLUMN has_protector_case INTEGER DEFAULT 0"
  );
} catch (error) {
  // Column already exists, safe to ignore
}
```

### Update Method Field Whitelist

```typescript
// updateFunko requires explicit field whitelist
const allowedFields = [
  "name",
  "series",
  "number",
  "category",
  "condition",
  "purchase_price",
  "current_value",
  "purchase_date",
  "notes",
  "has_protector_case",
  "image_paths", // Note: gets transformed to "image_path" internally
];
```

## Component Patterns

### Form State Management (Edit Mode)

```typescript
// Problem: useState only uses initialData on FIRST render
// Solution: useEffect + useCallback coalescing operator

const [formData, setFormData] = useState({
  hasProtectorCase: initialData?.has_protector_case ?? false, // Use ?? not ||
});

// Sync when initialData changes
useEffect(() => {
  if (initialData) {
    setFormData({
      /* all fields */
    });
  }
}, [initialData?.id, initialData?.has_protector_case]);
```

### Switch Component Quirks

```typescript
// Switch requires key prop to force remount on value changes
<Switch
  key={`protector-${initialData?.id}-${formData.hasProtectorCase}`}
  value={Boolean(formData.hasProtectorCase)} // Explicit boolean conversion
  onValueChange={(value) => {
    setFormData((prev) => ({ ...prev, hasProtectorCase: Boolean(value) }));
  }}
/>
```

### Cache-Aware Detail Views

```typescript
// FunkoDetail must query fresh data, not rely on stale props
import { useFunko } from "@/hooks/useFunkos";

export const FunkoDetail = ({ funko }) => {
  // Query cache - auto-updates when invalidated
  const { data: freshFunko } = useFunko(funko.id);
  const currentFunko = freshFunko || funko; // Fallback to prop
  // Use currentFunko for rendering
};
```

### Tab Bar Icon Colors (Dark Mode Fix)

```typescript
// Always use hierarchicalColor with focused state
tabBarIcon: ({ focused }) => ({
  sfSymbol: "house.fill",
  hierarchicalColor: focused
    ? Colors[colorScheme ?? "light"].tabIconSelected // White in dark mode
    : Colors[colorScheme ?? "light"].tabIconDefault, // Gray always
});
```

## TanStack Query Patterns

### Query Keys & Invalidation

```typescript
// List query
useQuery({ queryKey: ["funkos"], queryFn: () => db.getAllFunkos() });

// Detail query
useQuery({ queryKey: ["funko", id], queryFn: () => db.getFunkoById(id) });

// After mutation, invalidate both:
queryClient.invalidateQueries({ queryKey: ["funkos"] });
queryClient.invalidateQueries({ queryKey: ["funko", id] });
```

### Mutation Hooks

```typescript
// Use custom hooks from src/hooks/useFunkos.tsx
const createFunko = useCreateFunko({ onSuccess: () => {} });
const updateFunko = useUpdateFunko({ onSuccess: (data, variables) => {} });
const deleteFunko = useDeleteFunko({
  onSuccess: async (data, variables) => {
    // Clean up images before deletion
    if (funko?.image_paths?.length) {
      await Promise.all(
        funko.image_paths.map((path) => images.deleteImage(path))
      );
    }
  },
});
```

## Performance & UX Patterns

### Debounced Search

```typescript
// Two-state pattern for responsive UI
const [searchQuery, setSearchQuery] = useState(""); // Immediate
const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(""); // 500ms delay

useEffect(() => {
  const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 500);
  return () => clearTimeout(timer);
}, [searchQuery]);
```

### Safe Area Integration

```typescript
// Required for all full-screen views
import { useSafeAreaInsets } from "react-native-safe-area-context";
const insets = useSafeAreaInsets();
<View style={{ paddingTop: insets.top }}>{content}</View>;
```

### TextInput Dark Mode Cursor Fix

```typescript
// Always set explicit color for cursor visibility
<TextInput
  style={{ color: "#000" }} // Ensures cursor shows in dark mode
  autoCorrect={false}
  autoCapitalize="none"
  spellCheck={false}
/>
```

## File Organization

```
src/
├── app/(tabs)/              # Tab screens (Home, Add, Search, Settings, About)
│   ├── _layout.ios.tsx      # Native bottom tabs (iOS-specific)
│   └── index.tsx            # Home: grid + search
├── components/
│   ├── funkos/
│   │   ├── FunkoCard.tsx    # Grid card with edit/detail modals
│   │   ├── FunkoDetail.tsx  # Detail modal (uses useFunko for fresh data)
│   │   └── FunkoForm.tsx    # Create/edit form (mode prop, useEffect sync)
│   └── search/
│       └── SearchBar.tsx    # Floating search with glass effect
├── database/
│   └── schema.ts            # TypeScript interfaces
├── hooks/
│   ├── useFunkos.tsx        # TanStack Query CRUD hooks
│   └── useHapticFeedback.ts # Haptic + audio feedback
├── services/
│   ├── database.ts          # SQLite implementation with migrations
│   ├── database.web.ts      # Web fallback (not in scope)
│   ├── db.ts                # Platform proxy
│   └── images.ts            # File system image operations
└── constants/
    └── theme.ts             # Colors (dark.tint="#fff" causes icon issues)
```

## Common Pitfalls & Solutions

### ❌ Problem: Update not saving has_protector_case

**Cause**: Boolean not converted to INTEGER for SQLite  
**Fix**: Transform in `updateFunko` before SQL execution

### ❌ Problem: Images lost after reinstall

**Cause**: FileSystem.documentDirectory cleared on uninstall (not on updates)  
**Fix**: Document in Settings screen, plan Photo Library backup

### ❌ Problem: Switch shows wrong value in edit mode

**Cause**: useState doesn't update when initialData prop changes  
**Fix**: useEffect with dependency on `initialData?.id` + key prop on Switch

### ❌ Problem: Tab icons white-on-white in dark mode

**Cause**: Using tint color (white) for both active/inactive states  
**Fix**: Use `tabIconSelected` for focused, `tabIconDefault` for unfocused

### ❌ Problem: "Add Your First Funko" button doesn't work

**Cause**: Using `useRouter()` from expo-router with React Navigation  
**Fix**: Use `useNavigation()` and `navigation.navigate("Add" as never)`

## Development Commands

```bash
npx expo start              # Dev server
npx expo run:ios           # iOS simulator
npx expo run:ios --device  # iOS physical device (USB)
npx expo start --clear     # Clear cache
```

## Testing Checklist for New Features

1. ✅ Test create, read, update, delete operations
2. ✅ Verify boolean fields convert to INTEGER in database
3. ✅ Check cache invalidation triggers UI refresh
4. ✅ Test dark mode color contrast (icons, text, cursors)
5. ✅ Verify Switch components show correct initial state
6. ✅ Test with empty database and populated database
7. ✅ Check image cleanup on deletion (Promise.all pattern)

---

**Last Updated**: November 2025 - Post-implementation of has_protector_case, edit functionality, Settings screen, and React Navigation migration.
