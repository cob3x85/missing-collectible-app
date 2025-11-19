# Image Quality Settings Feature

## Overview

Added dynamic image quality/compression settings to optimize storage space and allow users to control the size of images stored in the database.

## Changes Made

### 1. New Settings Service (`src/services/settings.ts`)

- **Purpose**: Persistent storage for app settings using AsyncStorage
- **Features**:
  - Three quality presets: High (0.9), Medium (0.7), Low (0.5)
  - Compression quality mapping
  - Max dimensions per quality level:
    - High: 1200x1200 (~500KB/image)
    - Medium: 800x800 (~250KB/image)
    - Low: 600x600 (~150KB/image)
  - Auto-initialization on app startup
  - Human-readable labels for UI

### 2. Updated Image Storage Service (`src/services/imageStorage.ts`)

- **Changes**:
  - Import `settingsService`
  - New `getImageQuality()` private method that reads quality setting
  - Updated `pickImageFromLibrary()`: Uses dynamic quality instead of hardcoded 0.8
  - Updated `takePhoto()`: Uses dynamic quality instead of hardcoded 0.8

**Before:**

```typescript
quality: 0.8, // Hardcoded
```

**After:**

```typescript
quality: await this.getImageQuality(), // Dynamic from settings
```

### 3. New Settings UI (`src/app/(tabs)/settings.tsx`)

- **New Section**: "Image Quality" with three selectable options
- **UI Components**:
  - Radio button style selectors (custom design)
  - Visual indicators for selected quality
  - "Recommended" badge on Medium quality
  - File size estimates per option
  - Help text explaining the feature
  - Emoji icon for better UX
- **State Management**:
  - React useState for UI state
  - useEffect to load current setting on mount
  - Async update handler that persists changes

### 4. App Initialization (`src/app/_layout.tsx`)

- **Changes**:
  - Import `settingsService`
  - Initialize settings service on app startup
  - Runs after database migration, before app renders

## User Experience

### Settings Screen Flow

1. User opens Settings tab
2. Sees "Image Quality" section with three options:
   - **High Quality** (~500KB/image)
   - **Medium Quality** (~250KB/image) [Recommended]
   - **Low Quality** (~150KB/image)
3. User taps desired option
4. Radio button updates immediately
5. Setting saved to AsyncStorage
6. Future photos use new quality setting

### Notes Displayed to User

- "Choose image quality for new photos. Lower quality saves storage space."
- "💡 This setting only affects new photos. Existing images won't change."

## Technical Details

### Quality Compression Values

| Setting | Compression | Max Dimensions | Est. File Size |
| ------- | ----------- | -------------- | -------------- |
| High    | 0.9         | 1200x1200      | ~500KB         |
| Medium  | 0.7         | 800x800        | ~250KB         |
| Low     | 0.5         | 600x600        | ~150KB         |

### Storage Location

- Settings stored in: `@react-native-async-storage/async-storage`
- Key: `@app_settings`
- Format: JSON object `{ imageQuality: "medium" }`

### Default Behavior

- Default quality: **Medium** (0.7 compression)
- Balanced between quality and file size
- Recommended for most users

## Benefits

### For Users

✅ Control over storage space usage  
✅ Faster image loading with smaller files  
✅ Better app performance  
✅ Choice based on device storage capacity

### For Collectors

- **High Quality**: For rare/valuable Funkos where detail matters
- **Medium Quality**: Everyday collection (recommended)
- **Low Quality**: Large collections (1000+ Funkos)

## Future Enhancements (Optional)

### Phase 1 - Storage Stats

- Display total database size in Settings
- Show image storage breakdown
- Calculate potential savings per quality level

### Phase 2 - Batch Optimization

- "Optimize Existing Images" feature
- Re-compress old images to new quality setting
- Background processing with progress indicator

### Phase 3 - Smart Quality

- AI-based auto quality selection
- Detect rare Funkos → use High quality
- Common Funkos → use Low quality

## Testing Checklist

- [x] AsyncStorage package installed
- [x] Settings service created with proper types
- [x] Image storage service updated to use dynamic quality
- [x] Settings UI implemented with radio buttons
- [x] App layout initializes settings on startup
- [ ] Manual test: Change quality setting
- [ ] Manual test: Add photo with High quality
- [ ] Manual test: Add photo with Low quality
- [ ] Manual test: Setting persists after app restart
- [ ] Manual test: Compare file sizes between quality levels

## Dependencies Added

```json
{
  "@react-native-async-storage/async-storage": "^2.1.0"
}
```

## Files Modified

1. `/src/services/settings.ts` (NEW)
2. `/src/services/imageStorage.ts` (UPDATED)
3. `/src/app/(tabs)/settings.tsx` (UPDATED)
4. `/src/app/_layout.tsx` (UPDATED)

---

**Implementation Date**: November 2024  
**Feature Status**: ✅ Complete and ready for testing
