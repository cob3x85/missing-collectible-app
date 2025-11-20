# Image Storage Cleanup - Base64 Only

## Summary

Simplified image storage to use **base64-only** approach for the first production release. Removed all legacy file-based image storage code since no users have downloaded the app yet.

## Changes Made

### 1. ✅ Simplified Deletion Hook (`src/hooks/useFunkos.tsx`)

**Before:**

```typescript
mutationFn: async (id: string) => {
  const funko = await db.getFunkoById(id);
  if (funko?.image_paths && funko.image_paths.length > 0) {
    await Promise.all(
      funko.image_paths.map((imagePath) => images.deleteImage(imagePath))
    );
  }
  await db.deleteFunko(id);
};
```

**After:**

```typescript
mutationFn: async (id: string) => {
  // Base64 images stored in image_data column are automatically deleted when the database row is deleted
  // No file system cleanup needed since we use base64 storage
  await db.deleteFunko(id);
};
```

**Impact:** Simpler, faster deletion. Base64 images are deleted automatically with the database row.

---

### 2. ✅ Removed Legacy Conversion Code (`src/services/database.ts`)

**Changes:**

- ❌ Deleted `migrateImagesToBase64()` method (46 lines removed)
- ✅ Simplified `getAllFunkos()` - removed image_paths conversion logic (15 lines → 3 lines)
- ✅ Simplified `getFunkosPaginated()` - removed image_paths conversion (15 lines → 3 lines)
- ✅ Simplified `getFunkoById()` - removed image_paths conversion (15 lines → 3 lines)
- ✅ Simplified `getAllFunkoByName()` - removed image_paths conversion (15 lines → 3 lines)
- ✅ Simplified `searchFunkos()` - removed image_paths conversion (15 lines → 3 lines)
- ✅ Removed `image_paths` from `updateFunko` allowedFields whitelist

**Before (example - getAllFunkos):**

```typescript
async getAllFunkos(): Promise<Funko[]> {
  const result = await this.db.getAllAsync(...);

  // Convert image_path to image_paths array (handle both JSON string and single path)
  return (result as any[]).map((funko) => {
    let image_paths: string[] | undefined;
    if (funko.image_path) {
      try {
        image_paths = JSON.parse(funko.image_path);
      } catch {
        image_paths = [funko.image_path];
      }
    }
    return {
      ...funko,
      has_protector_case: funko.has_protector_case === 1,
      image_paths,
      image_data: funko.image_data,
    };
  }) as Funko[];
}
```

**After:**

```typescript
async getAllFunkos(): Promise<Funko[]> {
  const result = await this.db.getAllAsync(...);

  return (result as any[]).map((funko) => ({
    ...funko,
    has_protector_case: funko.has_protector_case === 1,
    image_data: funko.image_data,
  })) as Funko[];
}
```

**Impact:** ~115 lines removed, cleaner code, better performance (no parsing needed).

---

### 3. ✅ Simplified Form Component (`src/components/funkos/FunkoForm.tsx`)

**Changes:**

- ✅ Removed `image_paths` fallback from initial state
- ✅ Removed `image_paths` fallback from useEffect sync logic

**Before:**

```typescript
const [imagePaths, setImagePaths] = useState<string[]>(() => {
  if (initialData?.image_data) {
    try {
      const base64Array = JSON.parse(initialData.image_data);
      return base64Array.map(
        (base64: string) => `data:image/jpeg;base64,${base64}`
      );
    } catch (error) {
      console.warn("Failed to parse image_data:", error);
    }
  }
  return initialData?.image_paths || []; // ❌ Legacy fallback
});
```

**After:**

```typescript
const [imagePaths, setImagePaths] = useState<string[]>(() => {
  if (initialData?.image_data) {
    try {
      const base64Array = JSON.parse(initialData.image_data);
      return base64Array.map(
        (base64: string) => `data:image/jpeg;base64,${base64}`
      );
    } catch (error) {
      console.warn("Failed to parse image_data:", error);
    }
  }
  return []; // ✅ No legacy fallback needed
});
```

**Impact:** Cleaner code, no confusion about which format is being used.

---

### 4. ✅ Updated Database Schema (`src/database/schema.ts`)

**Before:**

```typescript
export interface Funko {
  // ...other fields
  image_paths?: string[]; // Legacy: file paths (deprecated)
  image_data?: string; // New: JSON array of base64 strings (persists across updates)
  // ...
}
```

**After:**

```typescript
export interface Funko {
  // ...other fields
  image_data?: string; // JSON array of base64 strings (persists across updates)
  // ...
}
```

**Impact:** TypeScript now enforces base64-only approach, no deprecated fields.

---

### 5. ✅ Updated Tests (`src/__tests__/hooks/useFunkos.test.tsx`)

**Changes:**

- ❌ Removed `images.deleteImage` mock
- ✅ Updated mock data to use `image_data` instead of `image_paths`
- ✅ Simplified deletion test (no image cleanup expectations)

**Before:**

```typescript
jest.mock("@/services/images", () => ({
  images: {
    deleteImage: jest.fn(),
  },
}));

const mockFunkos: Funko[] = [
  {
    // ...
    image_paths: ["/path/to/image.jpg"],
  },
];

it("deletes a funko and its images", async () => {
  db.getFunkoById.mockResolvedValue(mockFunkos[0]);
  db.deleteFunko.mockResolvedValue(undefined);
  images.deleteImage.mockResolvedValue(undefined); // ❌
  // ...
});
```

**After:**

```typescript
// ❌ No images mock needed

const mockFunkos: Funko[] = [
  {
    // ...
    image_data: JSON.stringify(["/9j/4AAQSkZJRgABAQAA..."]), // Base64 JSON array
  },
];

it("deletes a funko", async () => {
  db.deleteFunko.mockResolvedValue(undefined);
  // Base64 images in image_data are automatically deleted with the row
  // ...
});
```

**Impact:** Simpler tests, no unnecessary mocks.

---

## Files Not Changed (Intentionally)

### `src/services/imageStorage.ts` & `src/services/images.ts`

**Decision:** Keep `deleteImage()` methods for potential future use.

**Rationale:**

- Methods handle base64 data URIs gracefully (return early)
- No performance impact
- May be useful if we add bulk image cleanup features later
- Doesn't cause confusion (not called anywhere in production code)

---

## Storage Format Reference

### Current Production Format (Base64)

**Database Column:** `image_data` (TEXT)  
**Value:** JSON string array of base64 strings  
**Example:**

```json
["iVBORw0KGgoAAAANSUhEUgAAAAUA...", "/9j/4AAQSkZJRgABAQAA..."]
```

**UI Display:** Convert to data URIs

```typescript
const base64Array = JSON.parse(funko.image_data);
const imageUris = base64Array.map(
  (base64: string) => `data:image/jpeg;base64,${base64}`
);
```

**Persistence:** ✅ Survives app updates, ✅ Stored in SQLite database  
**Deletion:** ✅ Automatic when row is deleted (no file cleanup needed)

---

### Legacy Formats (REMOVED)

#### V1: `image_path` (singular)

- Database: JSON string of file paths
- Example: `'["/path/1.jpg", "/path/2.jpg"]'`
- Status: ❌ REMOVED

#### V2: `image_paths` (array)

- TypeScript: `string[]` of FileSystem paths
- Example: `["/document-dir/image-123.jpg"]`
- Status: ❌ REMOVED

---

## Test Results

All 17 tests passing ✅

```
Test Suites: 3 passed, 3 total
Tests:       17 passed, 17 total
```

No TypeScript errors ✅

---

## Benefits of Cleanup

### 1. **Simpler Codebase**

- ~150 lines of legacy code removed
- No more dual-format handling logic
- Clearer intent in all components

### 2. **Better Performance**

- No file system operations on deletion
- No parsing/conversion overhead in database reads
- Faster image loading (no file lookup)

### 3. **Easier Maintenance**

- Single source of truth for image storage
- No confusion about which format to use
- TypeScript enforces correct usage

### 4. **No Breaking Changes**

- App hasn't been released yet
- No legacy users to migrate
- Clean slate for first production release

---

## Future Considerations

### If File-Based Storage Needed Later

To add file-based storage for specific use cases (e.g., high-res images):

1. Keep `image_data` for quick loading (thumbnails)
2. Add new column `image_files` for optional file paths
3. Reintroduce file cleanup in deletion hook
4. Document clear separation of concerns

**DO NOT** reintroduce `image_paths` or dual-format handling without a compelling reason.

---

## Related Documentation

- **Image Storage Decision:** See `IMAGE_QUALITY_FEATURE.md`
- **Persistence Explanation:** See `IMAGES_PERSISTENCE_FIX.md`
- **Testing Guide:** See `TESTING.md`

---

**Date:** November 2025  
**Author:** AI Coding Agent  
**Status:** ✅ COMPLETE - Ready for first production release
