# Expo OTA Updates - Rollback and Versioning Guide

## Overview

Your app is configured with Expo Over-the-Air (OTA) updates, allowing you to push JavaScript/code updates without a full App Store/Play Store release.

## Configuration Summary

### App Configuration (`app.json`)

- **Runtime Version Policy**: `appVersion` - Updates are tied to the app version (1.1.1)
- **Check Automatically**: `ON_LOAD` - App checks for updates when launched
- **Update URL**: Connected to your EAS project
- **Channels**: production, preview, development

### EAS Configuration (`eas.json`)

- **Build Channels**: Each build profile targets a specific update channel
- **Update Profiles**: Separate profiles for production and preview updates

## Publishing Updates

### 1. Publish a Production Update

```bash
# Publish to production channel (matches production builds)
eas update --channel production --message "Fix: Resolved translation issue"
```

### 2. Publish a Preview Update

```bash
# Publish to preview channel for testing
eas update --channel preview --message "Test: New feature preview"
```

### 3. Publish with Branch

```bash
# Create a specific branch for the update
eas update --branch hotfix-1.1.1 --channel production --message "Hotfix: Critical bug"
```

## Versioning Strategy

### Semantic Versioning

- **Major.Minor.Patch** (e.g., 1.1.1)
- **Major**: Breaking changes requiring new binary build
- **Minor**: New features (can use OTA if no native changes)
- **Patch**: Bug fixes (perfect for OTA updates)

### Runtime Version Rules

1. **Same Runtime Version**: OTA updates work (e.g., 1.1.1 → 1.1.1)
2. **Different Runtime Version**: Requires new binary build (e.g., 1.1.1 → 1.2.0)

### When to Use OTA vs Binary Build

- ✅ **OTA Updates**: JS/React code changes, bug fixes, UI tweaks, translations
- ❌ **Binary Build Required**: Native module changes, SDK upgrades, permissions, assets in native code

## Rollback Procedures

### Method 1: Republish Previous Update

1. **Find the previous working update ID**:

```bash
# List all updates for production channel
eas update:list --channel production
```

2. **View specific update details**:

```bash
eas update:view [UPDATE_ID]
```

3. **Republish the previous update**:

```bash
# This creates a new update with the same content as the previous one
eas update:republish [UPDATE_ID] --channel production --message "Rollback: Reverting to stable version"
```

### Method 2: Create Rollback Branch

1. **Check out the previous working commit**:

```bash
git log --oneline
git checkout [PREVIOUS_COMMIT_HASH]
```

2. **Publish the rollback**:

```bash
eas update --channel production --message "Rollback: Reverting to version X"
```

3. **Return to main branch**:

```bash
git checkout main
```

### Method 3: Emergency Rollback with Group

1. **Create a rollback group** (limits rollback to specific users):

```bash
eas update --channel production --group rollback --message "Emergency rollback"
```

2. **Test the rollback** with the group before full deployment

3. **Deploy to all users** once verified:

```bash
eas update --channel production --message "Verified rollback deployed"
```

## Update Workflow

### Standard Release Process

1. **Development**: Test changes locally
2. **Preview Update**:
   ```bash
   eas update --channel preview --message "Preview: [description]"
   ```
3. **Test Preview**: Verify on preview builds
4. **Production Update**:
   ```bash
   eas update --channel production --message "Release: [description]"
   ```
5. **Monitor**: Check for errors in EAS dashboard
6. **Rollback if needed**: Use procedures above

### Hotfix Process

1. **Create hotfix branch**: `git checkout -b hotfix/1.1.2`
2. **Fix the issue**
3. **Publish immediately**:
   ```bash
   eas update --channel production --message "Hotfix: [critical fix]"
   ```
4. **Merge back**: `git checkout main && git merge hotfix/1.1.2`

## Monitoring Updates

### Check Update Status

```bash
# View all updates for a channel
eas update:list --channel production

# View specific update
eas update:view [UPDATE_ID]

# View update group details
eas update:view --group [GROUP_ID]
```

### EAS Dashboard

- Visit https://expo.dev/accounts/cob3x85s/projects/fun-kollection/updates
- View real-time adoption rates
- Monitor errors and crashes
- See which users have which updates

## User Experience

### How Users Receive Updates

1. **App Launch**: Check for updates (configured in app.json)
2. **Download**: If available, download in background
3. **Prompt**: User sees "Update Available" dialog
4. **Apply**: On "Update Now", app reloads with new version
5. **Defer**: User can choose "Later" to update on next launch

### Manual Check

- Users can manually check via Settings → App Updates → Check for Updates

## Troubleshooting

### Update Not Appearing

1. Verify channel matches build: `eas build:list`
2. Check runtime version: Must match app version
3. Ensure not in development mode: OTA only works in production builds
4. Check update was published: `eas update:list --channel production`

### Rollback Not Working

1. Verify update was republished successfully
2. Check users have restarted app (updates apply on reload)
3. Confirm runtime versions match
4. Clear app data if necessary

### Testing Updates Locally

```bash
# Build preview locally with production-like settings
eas build --profile preview --platform ios --local

# Publish to preview channel
eas update --channel preview --message "Test update"

# Install and test the preview build
```

## Best Practices

1. **Always test in preview first** before production
2. **Use descriptive messages** for each update
3. **Monitor adoption rates** in EAS dashboard
4. **Keep rollback option ready** - know your previous stable update ID
5. **Document changes** in update messages
6. **Version control**: Tag releases in git
7. **Gradual rollouts**: Use groups for phased deployments
8. **Communication**: Inform users of major updates

## Cost Optimization

- **Local Builds**: Use `eas build --local` to save build minutes
- **Targeted Updates**: Use groups to limit update distribution
- **Preview Testing**: Test thoroughly in preview before production
- **OTA First**: Use OTA updates instead of binary builds when possible

## Important Commands Reference

```bash
# Publish update
eas update --channel [CHANNEL] --message "[MESSAGE]"

# List updates
eas update:list --channel [CHANNEL]

# View update details
eas update:view [UPDATE_ID]

# Republish (rollback)
eas update:republish [UPDATE_ID] --channel [CHANNEL] --message "[MESSAGE]"

# Build and update
eas build --profile production --platform ios --local
eas update --channel production --message "[MESSAGE]"

# Submit to stores
eas submit --platform ios --path [PATH_TO_IPA]
eas submit --platform android --path [PATH_TO_AAB]
```

## Support

- **EAS Documentation**: https://docs.expo.dev/eas-update/introduction/
- **Update Dashboard**: https://expo.dev/accounts/cob3x85s/projects/fun-kollection/updates
- **GitHub Issues**: Create issues for bugs or questions
