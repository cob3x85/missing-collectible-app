# OTA Updates - Quick Start

## Implementation Complete ✅

Your app now supports Expo Over-the-Air (OTA) updates with user prompts!

## What Was Implemented

### 1. Configuration Files Updated

- ✅ `app.json`: Added update configuration with `ON_LOAD` checking
- ✅ `eas.json`: Added update profiles for production and preview channels

### 2. Update Service Created

- ✅ `src/services/update.ts`: Complete update service with user prompts
  - Check for updates
  - Download updates
  - Prompt user before applying
  - Manual check functionality
  - Silent launch checks

### 3. UI Integration

- ✅ Settings screen updated with:
  - Manual "Check for Updates" button
  - Update ID and channel display
  - Loading states and error handling
  - User-friendly messaging

### 4. App Launch Integration

- ✅ `src/app/_layout.tsx`: Automatic check on app launch
  - Silent check (doesn't interrupt startup)
  - Only prompts if update is available

## How It Works

### For Users

1. **Automatic**: App checks for updates on launch
2. **User Choice**: If update found, user sees dialog:
   - "Update Now" → Downloads and restarts with new version
   - "Later" → User continues with current version
3. **Manual Check**: Users can tap "Check for Updates" in Settings anytime

### For You (Developer)

1. **Make Code Changes**: Fix bugs, update translations, etc.
2. **Publish Update**:
   ```bash
   eas update --channel production --message "Fix: Translation updates"
   ```
3. **Users Get It**: Next time they open the app, they'll be prompted to update

## Quick Commands

### Publish an Update

```bash
# Production
eas update --channel production --message "Your update description"

# Preview (for testing)
eas update --channel preview --message "Test update"
```

### Rollback (Emergency)

```bash
# List updates to find previous stable version
eas update:list --channel production

# Republish the previous version
eas update:republish [UPDATE_ID] --channel production --message "Rollback to stable"
```

### Check Update Status

```bash
# See all updates
eas update:list --channel production

# View specific update details
eas update:view [UPDATE_ID]
```

## When to Use OTA vs Store Release

### ✅ Use OTA Updates For:

- Bug fixes in JavaScript code
- UI/text changes
- Translation updates
- Feature toggles
- Business logic changes
- Small improvements

### ❌ Need Store Release For:

- Native module changes
- New permissions
- SDK version upgrades
- Changes to `app.json` native config
- Major version bumps

## Testing Updates

### Before Publishing to Production

1. **Test locally** with development build
2. **Publish to preview**:
   ```bash
   eas update --channel preview --message "Test: [feature]"
   ```
3. **Test on preview build** (built with `--profile preview`)
4. **Verify everything works**
5. **Publish to production**:
   ```bash
   eas update --channel production --message "Release: [feature]"
   ```

## Monitoring

- **Dashboard**: https://expo.dev/accounts/cob3x85s/projects/fun-kollection/updates
- **Adoption Rate**: See how many users have the latest update
- **Errors**: Monitor any issues with updates
- **Rollback**: Quick rollback from dashboard if needed

## User Experience Flow

```
App Launch → Check for Update → Download → Prompt User
                    ↓                           ↓
              No Update Available        User Chooses:
                    ↓                     - Update Now (reloads app)
              Continue Normal           - Later (update on next launch)
```

## Important Notes

1. **Production Builds Only**: OTA updates only work in production builds (not dev mode)
2. **Runtime Version**: Updates must match the app's runtime version (currently tied to app version 1.1.1)
3. **Automatic Background**: Download happens in background, doesn't block the user
4. **User Control**: Users always have choice to update now or later
5. **No Internet**: If offline, app continues normally (update will be checked next launch)

## Next Steps

1. **Build Production Version**:

   ```bash
   eas build --profile production --platform ios --local
   ```

2. **Test the Update Flow**:

   - Install the production build
   - Make a small change (e.g., update a translation)
   - Publish update: `eas update --channel production --message "Test update"`
   - Relaunch the app
   - You should see the update prompt!

3. **Submit to Store** (when ready):
   ```bash
   eas submit --platform ios --path [path-to-ipa]
   ```

## Full Documentation

See `docs/ota-updates-guide.md` for comprehensive documentation including:

- Detailed rollback procedures
- Versioning strategies
- Advanced workflows
- Troubleshooting guide
- Best practices

## Questions?

- Check `docs/ota-updates-guide.md` for detailed info
- Test in preview channel first
- Monitor the EAS dashboard
- Keep a log of update IDs for easy rollback
