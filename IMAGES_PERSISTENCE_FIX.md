# Images Persistence Fix

## Problem

Images stored in `FileSystem.documentDirectory` are being lost during TestFlight updates.

## Root Cause

iOS can clear app data during updates if:

1. Files are not properly flagged for backup
2. App storage optimization occurs
3. TestFlight beta builds have different provisioning

## Solution Options

### Option 1: Store Images as Base64 in SQLite (100% Persistent) ⭐ RECOMMENDED

**Pros:**

- Images guaranteed to persist with database
- Single source of truth
- Easier backup/restore
- Works across all scenarios

**Cons:**

- Larger database size
- Slightly slower for very large images
- Need to migrate existing images

### Option 2: Use NSFileProtection + iCloud Backup

**Pros:**

- Keep file system approach
- Better for large images

**Cons:**

- Still vulnerable to iOS storage cleanup
- Requires iCloud backup enabled
- More complex

### Option 3: Hybrid Approach

- Thumbnails in SQLite (base64)
- Full images in FileSystem with backup flag
- Best of both worlds but more complex

## Recommended Implementation: Option 1

### Steps:

1. Add new column to funkos table: `image_data TEXT` (JSON array of base64)
2. Create migration function to convert existing file paths to base64
3. Update imageStorage service to use base64
4. Keep backward compatibility for 1 version

### Migration Code:

```typescript
// In database.ts
async migrateImagesToBase64() {
  const funkos = await this.getAllFunkos();

  for (const funko of funkos) {
    if (funko.image_paths?.length > 0) {
      const base64Images = await Promise.all(
        funko.image_paths.map(async (path) => {
          const base64 = await FileSystem.readAsStringAsync(path, {
            encoding: FileSystem.EncodingType.Base64
          });
          return base64;
        })
      );

      await this.db.runAsync(
        'UPDATE funkos SET image_data = ? WHERE id = ?',
        [JSON.stringify(base64Images), funko.id]
      );
    }
  }
}
```

## Quick Fix (Temporary)

For now, document in Settings screen that users should:

1. Export their collection before updates (coming soon)
2. Use external backup tools
3. Keep original photos in Camera Roll

## Long-term Solution

Implement full backup/restore feature with:

- Export to JSON + ZIP of images
- Import from backup
- Cloud sync option (future premium feature)
