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
  "size", // Funko size: "standard" | "super_sized" | "jumbo"
  "type", // Funko type: "standard_pop" | "pop_ride" | "pop_town" | etc.
  "purchase_price",
  "current_value",
  "purchase_date",
  "notes",
  "has_protector_case",
  "image_paths", // Note: gets transformed to "image_path" internally
];
```

### Funko Size and Type Fields

**Size Options** (FunkoSize enum):

- `standard` - 3.75" figure (default)
- `super_sized` - 6" figure
- `jumbo` - 10" figure

**Type Options** (FunkoType enum):

- `standard_pop` - Regular Funko Pop (default)
- `pop_ride` - Pop with vehicle/ride
- `pop_town` - Pop with building/location
- `pop_moment` - Pop with scene/moment
- `pop_album` - Pop with album cover
- `pop_comic_cover` - Pop with comic book
- `pop_deluxe` - Deluxe/oversized Pop
- `pop_2pack` - 2-pack set
- `pop_3pack` - 3-pack set
- `pop_keychain` - Keychain version
- `pop_tee` - Pop & Tee bundle
- `soda` - Funko Soda can variant
- `vinyl_gold` - Vinyl Gold collectible
- `other` - Other Funko variant

**Database Storage**:

- Both stored as TEXT in SQLite
- Default values: `size = 'standard'`, `type = 'standard_pop'`
- Added via ALTER TABLE migrations (safe for existing databases)

**Form Implementation**:

- Size picker: 3 button options with dimensions displayed
- Type picker: 8 common button options (full enum available in schema)
- Both follow condition picker pattern (TouchableOpacity buttons)
- Labels display human-readable format (e.g., "Pop Ride" not "pop_ride")

**Display in Detail View**:

- Size shows with dimensions: "Standard (3.75\")", "Super-Sized (6\")", "Jumbo (10\")"
- Type shows title-cased with spaces: "Standard Pop", "Pop Ride", "Pop 2Pack"

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

---

## Future Features Roadmap

### Phase 1 - Quick Wins (Week 1-2)

**Priority: HIGH | Cost: FREE**

1. **CSV/Excel Import**

   - Libraries: `expo-document-picker`, `papaparse` (CSV), `xlsx` (Excel)
   - Format: name, series, number, category, condition, purchase_price, current_value, purchase_date, notes, has_protector_case, image_url
   - Image Handling: Download from URLs in CSV, batch processing with retry logic (3 parallel downloads)
   - Implementation: CSVImportService with progress callback, validation with existing Yup schemas
   - Premium Feature: Gate behind in-app purchase
   - Database: Add `imported_from` column to track source

2. **Share Funko Cards**

   - Libraries: `react-native-view-shot`, `expo-sharing`
   - Features: Share individual cards as images with watermark, native share sheet
   - Format: Card with image, name, series #number, value, "Fun-Kollection App" branding
   - Social: Instagram Stories, Facebook, Twitter, WhatsApp via native share

3. **Email Feedback System**
   - Library: `expo-mail-composer`
   - Features: Bug reports, feature requests, general feedback
   - Auto-include: App version, platform, device info
   - Screenshot attachment option
   - Already have: Sentry for crash tracking

### Phase 2 - Monetization (Week 3-4)

**Priority: HIGH | Cost: FREE (30% App Store fee)**

4. **In-App Purchases (One-Time)**

   - Library: `expo-in-app-purchases`
   - Price: $4.99 one-time unlock
   - Product IDs: `com.funkollection.premium` (iOS & Android)
   - Gated Features:
     - CSV/Excel import
     - eBay image fetching
     - Pop Price Guide auto-fill
     - AI box scanning (10/month free tier)
     - Bulk edit operations
     - Advanced statistics
     - Unlimited Funkos (free tier: 50 limit)
   - Implementation: PremiumService with AsyncStorage receipt persistence, restore purchases flow
   - UI: PremiumGate component wrapper, feature comparison table

5. **eBay Image Search**
   - API: eBay Finding API (FREE - 5,000 calls/day)
   - Requirements: Developer account at developer.ebay.com (free)
   - Features: Search Funko listings, extract gallery images (80x80), filter by category #246 (Collectibles)
   - Rate Limiting: Cache results for 24hr, implement request throttling
   - Premium Feature: "Find Images" button in Add form
   - Limitation: Gallery images are low-res; consider Pop Price Guide for high-res

### Phase 3 - AI Integration (Week 5-8)

**Priority: HIGH | Cost: $70-150/month**

6. **OCR Box Scanning** 🎯 KILLER FEATURE

   - Service: Google Vision API ($1.50/1000 images, free tier: 1000/month)
   - Features: Extract Funko name, number, series from box photo
   - Flow: Camera → OCR → Parse text → Match Pop Price Guide → Auto-fill form
   - Implementation:

     ```typescript
     // Step 1: Extract text
     const text = await GoogleVision.detectText(imageUri);
     // "FUNKO POP! MARVEL SPIDER-MAN #574"

     // Step 2: Parse with regex
     const parsed = {
       series: text.match(/MARVEL|DC|DISNEY|STAR WARS/i)?.[0],
       number: text.match(/#?(\d{2,4})/)?.[1],
       name: text.match(/POP!\s+[A-Z\s]+\s+([A-Z-]+)/)?.[1],
     };

     // Step 3: Match database
     const match = await PopPriceGuide.search(parsed.name, parsed.series);
     ```

   - Premium: Free tier 10 scans/month, unlimited with premium
   - Accuracy: 85-90% for clear box photos
   - User Value: ⭐⭐⭐⭐⭐ (saves 90% data entry time)

7. **Smart Collection Insights**

   - Service: OpenAI GPT-4 ($0.03/1K tokens, ~$0.001 per summary)
   - Features: Generate natural language collection summaries
   - Examples:
     - "Your collection shines with Marvel Funkos! You've made an impressive 87% ROI..."
     - "You're just 3 Funkos away from completing the Avengers series!"
     - "Your collection is valued at $2,450, up 15% from last month"
   - Implementation:

     ```typescript
     const insights = {
       topSeries: await db.getMostPopularSeries(),
       avgROI: await db.calculateROI(),
       totalValue: await db.sumCurrentValues(),
       completionRate: await compareWithPopPriceGuide(),
     };

     const summary = await openai.chat.completions.create({
       model: "gpt-4",
       messages: [
         {
           role: "user",
           content: `Generate friendly summary: ${JSON.stringify(insights)}`,
         },
       ],
     });
     ```

   - Display: Dashboard in About tab, shareable card
   - Cost: ~$10-20/month for 10,000 users

8. **Pop Price Guide Integration**
   - API: pricecharting.com/api-documentation
   - Cost: $50-200/month depending on call volume
   - Features: 50,000+ Funko database, high-res images, pricing data, rarity info
   - Implementation: PopPriceGuideService with search and auto-fill
   - UI: "Smart Add" feature - search by name, auto-populate form fields
   - Premium Feature: Auto-update collection values weekly
   - Database: Store `price_guide_id` for future updates

### Phase 4 - Advanced AI (Month 3-4)

**Priority: MEDIUM | Cost: $150-300/month**

9. **Price Predictions**

   - Service: Custom TensorFlow.js model OR GPT-4 analysis
   - Cost: $0 runtime (on-device) OR $0.03/1K tokens
   - Features: Predict future Funko values, buy/sell recommendations
   - Data: Historical prices from Pop Price Guide API
   - Implementation:

     ```typescript
     // Option 1: Simple ML model
     const priceHistory = await PopPriceGuide.getPriceHistory("574");
     const prediction = await TensorFlow.predict(priceHistory);
     // { nextMonth: 32, nextYear: 45, confidence: 0.78 }

     // Option 2: GPT-4 analysis
     const analysis = await openai.chat.completions.create({
       model: "gpt-4",
       messages: [
         {
           role: "user",
           content: `Analyze trend and predict: ${JSON.stringify(
             priceHistory
           )}`,
         },
       ],
     });
     ```

   - Premium Feature: $9.99/month subscription OR part of one-time premium
   - Alerts: "Spider-Man #574 likely to appreciate 20% next quarter"
   - User Value: ⭐⭐⭐⭐ (actionable investment advice)

10. **Natural Language Search**

    - Service: OpenAI GPT-4 with function calling
    - Cost: $0.01/1K tokens (~$0.001 per query)
    - Features: Conversational search, complex filters
    - Examples:
      - "Show me all Marvel Funkos worth over $50"
      - "Which Star Wars Funkos am I missing?"
      - "What's my most valuable Disney Princess?"
    - Implementation:
      ```typescript
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: userQuery }],
        tools: [
          {
            type: "function",
            function: {
              name: "search_funkos",
              parameters: {
                series: { type: "string" },
                min_value: { type: "number" },
                category: { type: "string" },
              },
            },
          },
        ],
      });
      // GPT calls: search_funkos({ series: "Marvel", min_value: 50 })
      ```
    - Cost: $10-50/month for 10,000-50,000 queries
    - User Value: ⭐⭐⭐ (nice-to-have, not essential)

11. **Image Recognition (Custom Model)**
    - Service: Custom TensorFlow Lite model OR AWS Rekognition
    - Cost: $10,000-50,000 one-time training + $0-100/month runtime
    - Features: Identify Funko from photo without box, detect fakes
    - Training: Requires 50,000+ labeled Funko images
    - Accuracy: 90-95% with proper dataset
    - Implementation: Train model → Export to TensorFlow Lite → On-device inference
    - Premium Feature: Advanced collectors only
    - User Value: ⭐⭐ (niche, high cost)

### Phase 5 - Social & Backend (Future)

**Priority: LOW | Cost: $100-300/month**

12. **Personalized Recommendations**

    - Service: OpenAI Embeddings + Pinecone vector DB
    - Cost: $70-140/month (vector DB) + $0.02/1M tokens
    - Features: "You might like these", "Complete your collection"
    - Implementation: Collaborative filtering based on similar users
    - Requires: Backend infrastructure, user data sync
    - Privacy: GDPR consent required
    - User Value: ⭐⭐⭐ (discovery, engagement)

13. **Public Collection Galleries**

    - Backend: Firebase/Supabase ($25-100/month)
    - Features: Shareable URLs, view-only web pages, leaderboards
    - Implementation: Cloud sync, authentication, public/private toggle
    - Social: Embed in social media, compare collections
    - User Value: ⭐⭐⭐ (social proof, community)

14. **Collection Statistics Sharing**

    - Features: Total count, value, most valuable, top series
    - Share: Text-based stats via native Share API
    - UI: Statistics dashboard in About tab
    - Cost: $0 (native APIs)
    - User Value: ⭐⭐⭐⭐ (viral growth)

15. **Native Store Reviews**
    - Library: `expo-store-review`
    - Trigger: After 10 Funkos added, or 30 days after install
    - Implementation: useReviewPrompt hook with action tracking
    - Cost: $0 (native APIs)
    - User Value: ⭐⭐⭐ (app store ranking)

---

## AI Implementation Details

### Cost-Benefit Analysis

| Feature               | Monthly Cost  | Dev Time | User Value | ROI       | Priority   |
| --------------------- | ------------- | -------- | ---------- | --------- | ---------- |
| **OCR Box Scanning**  | $50-70        | 2 weeks  | ⭐⭐⭐⭐⭐ | Excellent | ✅ HIGHEST |
| **Smart Summaries**   | $10-20        | 1 week   | ⭐⭐⭐⭐   | Excellent | ✅ HIGH    |
| **Pop Price Guide**   | $50-200       | 2 weeks  | ⭐⭐⭐⭐⭐ | Excellent | ✅ HIGH    |
| **Price Predictions** | $0-100        | 3 weeks  | ⭐⭐⭐⭐   | Good      | ✅ MEDIUM  |
| **Natural Language**  | $30-50        | 1 week   | ⭐⭐⭐     | Good      | ⚠️ MEDIUM  |
| **Recommendations**   | $150          | 4 weeks  | ⭐⭐⭐     | Fair      | ⚠️ LOW     |
| **Custom ML Model**   | $10k one-time | 8 weeks  | ⭐⭐       | Poor      | ❌ SKIP    |
| **Voice Assistant**   | $0            | 1 week   | ⭐⭐       | Poor      | ❌ SKIP    |

### Privacy & Compliance

**Data Sent to AI Services**:

- ❌ User photos (Funko boxes) → Google Vision
- ❌ Collection data (names, values) → OpenAI for summaries
- ✅ Anonymous aggregates (trends) → Safe

**Compliance Requirements**:

- **GDPR (EU)**: Obtain explicit consent before sending images to third parties
- **CCPA (California)**: Allow users to opt-out of AI features
- **COPPA (Kids)**: Funko collectors include minors - extra care needed

**Implementation**:

```typescript
// Add AI consent screen
<PremiumGate feature="aiScanning">
  <Text>
    AI features send images to Google Vision for text extraction. Your photos
    are not stored and are deleted immediately after analysis.
  </Text>
  <Checkbox label="I consent to AI processing" onChange={setAiConsent} />
  <Link href="/privacy-policy">View Privacy Policy</Link>
</PremiumGate>
```

### Monetization Strategy

**Free Tier**:

- Up to 50 Funkos
- Manual entry only
- Basic search & filters
- Share individual cards
- Email feedback
- 10 AI scans/month

**Premium ($4.99 one-time)**:

- Unlimited Funkos
- CSV/Excel import
- eBay image search
- Unlimited AI box scanning
- Pop Price Guide auto-fill
- Smart collection insights
- Price predictions
- Advanced statistics
- Bulk edit operations

**Optional Subscription ($9.99/month)**:

- Weekly price updates
- Price alerts
- Natural language search
- Personalized recommendations
- Early access to new features

**No Ads Policy** - Clean, premium experience

### Social Strategy

**Viral Features**:

1. Share beautiful Funko cards to Instagram Stories (watermark for attribution)
2. Collection milestones (50th Funko, $1000 value) with celebration animations
3. "Challenge a Friend" - compare collections
4. Reddit r/funkopop engagement (offer import tool for spreadsheet users)
5. Facebook Funko collector groups outreach

**Community Building**:

1. Public galleries (Phase 4) - showcase collections
2. Leaderboards (most valuable, largest, most rare)
3. Monthly themed showcases (Marvel only, Disney Princesses, etc.)
4. User-generated CSV templates

### Implementation Notes

**Already Have**:

- expo-file-system ✅
- expo-sqlite ✅
- expo-sharing ✅
- @sentry/react-native ✅
- expo-image-picker ✅
- expo-camera (via image picker)

**Need to Add**:

- expo-document-picker (CSV import)
- papaparse (CSV parsing)
- react-native-view-shot (share cards)
- expo-in-app-purchases (monetization)
- expo-mail-composer (feedback)
- expo-store-review (ratings)
- @google-cloud/vision (OCR) OR rest API
- openai (GPT-4 summaries)

**Database Migrations**:

```sql
-- Add AI tracking columns
ALTER TABLE funkos ADD COLUMN imported_from TEXT; -- 'csv', 'ebay', 'manual', 'price_guide', 'ai_scan'
ALTER TABLE funkos ADD COLUMN price_guide_id TEXT; -- For future price updates
ALTER TABLE funkos ADD COLUMN last_price_update INTEGER; -- Timestamp
ALTER TABLE funkos ADD COLUMN ai_confidence REAL; -- OCR accuracy (0.0-1.0)
ALTER TABLE funkos ADD COLUMN scan_date INTEGER; -- When AI scanned

-- Add indexes for performance
CREATE INDEX idx_funkos_series ON funkos(series);
CREATE INDEX idx_funkos_category ON funkos(category);
CREATE INDEX idx_funkos_price_guide_id ON funkos(price_guide_id);
```

### Performance Considerations

**OCR Scanning**:

- Compress images to 1024x1024 before upload (reduce API costs)
- Show real-time progress: "Analyzing box... Extracting text... Matching database..."
- Cache OCR results for 7 days (avoid re-scanning same box)
- Offline fallback: Queue scans, process when online

**API Rate Limits**:

- Google Vision: 1000/month free, then $1.50/1000
- eBay Finding: 5000/day free
- OpenAI GPT-4: No hard limit, pay-per-use
- Pop Price Guide: 50,000/month on $200 plan

**Error Handling**:

- OCR fails: Allow manual entry with suggested corrections
- API timeout: Show "Processing taking longer than expected" with cancel option
- Network offline: Queue requests, sync when connected
- Invalid data: Validate with Yup schemas before database insert

### User Experience Flow

**AI Box Scanning**:

1. User taps "Scan Box" in Add screen
2. Camera opens with overlay guide ("Align Funko box here")
3. Capture photo → Show preview with "Analyzing..." spinner
4. OCR extracts text (2-3 seconds)
5. Parse and match Pop Price Guide (1-2 seconds)
6. Pre-fill form with extracted data
7. User reviews/edits fields
8. Save to database with `imported_from: 'ai_scan'` and confidence score

**Smart Insights**:

1. User opens About tab
2. Dashboard shows: Total count, value, ROI, top series
3. GPT-4 generates friendly summary (3-5 seconds on first load)
4. Cache summary for 24 hours
5. "Share Insights" button → Native share sheet

**Price Predictions** (Premium):

1. User views Funko detail
2. Show current value + "Predicted value in 6 months: $45 ▲20%"
3. Tap for detailed chart with confidence interval
4. Option to set price alert: "Notify me when value reaches $50"

---

## Recommended AI Roadmap

### Month 1 (MVP - $70/month)

1. ✅ Google Vision OCR - Extract text from box photos
2. ✅ Pop Price Guide API - Auto-fill form from database
3. ✅ GPT-4 Summaries - Generate collection insights

**Goal**: Launch with killer AI feature (box scanning)  
**Target**: 100 beta testers, 80% report "saves significant time"

### Month 2 (Premium Launch - $150/month)

4. ✅ In-app purchases - Gate AI features
5. ✅ Price predictions - TensorFlow.js model
6. ✅ Natural language search - GPT-4 function calling

**Goal**: Convert 10% of free users to premium  
**Target**: 1000 active users, $500/month revenue

### Month 3 (Growth - $250/month)

7. ✅ Personalized recommendations - Vector embeddings
8. ✅ Share features - Viral growth
9. ✅ Backend infrastructure - Cloud sync

**Goal**: Viral growth via sharing  
**Target**: 10,000 users, $5000/month revenue

### Month 4+ (Scale - $500+/month)

10. ✅ Custom ML model - Advanced recognition
11. ✅ Public galleries - Community features
12. ✅ Subscription tier - Recurring revenue

**Goal**: Sustainable business  
**Target**: 50,000 users, $25,000/month revenue

---

## Internationalization (i18n) & Localization

### Supported Languages (Phase 1)

**Priority: HIGH | Cost: $50-200 one-time translation**

1. **English (US)** - `en-US` - Default
2. **Spanish (Latin America)** - `es-MX` or `es-419` - 2nd largest market
3. **French** - `fr-FR` - European market
4. **German** - `de-DE` - European market
5. **Italian** - `it-IT` - European market
6. **Portuguese (Brazil)** - `pt-BR` - Latin American market

### Implementation Strategy

#### Library Selection

```bash
# Install i18n libraries
expo install expo-localization i18n-js
```

**i18n-js** - Recommended for React Native/Expo

- Lightweight (no bloat)
- Works with Expo
- Supports pluralization, number/date formatting
- Compatible with existing project structure

#### File Structure

```
src/
├── i18n/
│   ├── index.ts              # i18n configuration
│   ├── locales/
│   │   ├── en-US.json        # English (US)
│   │   ├── es-MX.json        # Spanish (Latin America)
│   │   ├── fr-FR.json        # French
│   │   ├── de-DE.json        # German
│   │   ├── it-IT.json        # Italian
│   │   └── pt-BR.json        # Portuguese (Brazil)
│   └── types.ts              # TypeScript types for translations
```

#### Configuration (src/i18n/index.ts)

```typescript
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import translations
import enUS from "./locales/en-US.json";
import esMX from "./locales/es-MX.json";
import frFR from "./locales/fr-FR.json";
import deDE from "./locales/de-DE.json";
import itIT from "./locales/it-IT.json";
import ptBR from "./locales/pt-BR.json";

// Initialize i18n
const i18n = new I18n({
  "en-US": enUS,
  "es-MX": esMX,
  "es-419": esMX, // Alias for Latin American Spanish
  "fr-FR": frFR,
  "de-DE": deDE,
  "it-IT": itIT,
  "pt-BR": ptBR,
});

// Fallback to English if translation missing
i18n.defaultLocale = "en-US";
i18n.enableFallback = true;

// Set locale from device settings or user preference
export async function initializeI18n() {
  try {
    // Check if user manually selected a language
    const savedLocale = await AsyncStorage.getItem("user_locale");

    if (savedLocale) {
      i18n.locale = savedLocale;
    } else {
      // Use device locale
      const deviceLocale = Localization.locale; // e.g., "en-US", "es-MX"
      i18n.locale = deviceLocale;
    }
  } catch (error) {
    i18n.locale = "en-US"; // Fallback
  }
}

export async function changeLanguage(locale: string) {
  i18n.locale = locale;
  await AsyncStorage.setItem("user_locale", locale);
}

export function t(key: string, options?: any): string {
  return i18n.t(key, options);
}

export { i18n };
```

#### Translation Keys Structure (en-US.json example)

```json
{
  "common": {
    "add": "Add",
    "edit": "Edit",
    "delete": "Delete",
    "cancel": "Cancel",
    "save": "Save",
    "search": "Search",
    "filter": "Filter",
    "share": "Share"
  },
  "tabs": {
    "home": "Home",
    "add": "Add",
    "search": "Search",
    "settings": "Settings",
    "about": "About"
  },
  "funko": {
    "name": "Name",
    "series": "Series",
    "number": "Number",
    "category": "Category",
    "condition": "Condition",
    "purchasePrice": "Purchase Price",
    "currentValue": "Current Value",
    "purchaseDate": "Purchase Date",
    "notes": "Notes",
    "protectorCase": "Protector Case",
    "addFunko": "Add Funko",
    "editFunko": "Edit Funko",
    "deleteFunko": "Delete Funko",
    "confirmDelete": "Are you sure you want to delete {{name}}?",
    "addPhotos": "Add Photos",
    "takePhoto": "Take Photo",
    "chooseFromLibrary": "Choose from Library"
  },
  "conditions": {
    "mint": "Mint",
    "nearMint": "Near Mint",
    "good": "Good",
    "fair": "Fair",
    "poor": "Poor"
  },
  "validation": {
    "required": "{{field}} is required",
    "invalidNumber": "Must be a valid number",
    "invalidDate": "Must be a valid date"
  },
  "search": {
    "placeholder": "Type anything...",
    "noResults": "No Funkos found",
    "showing": "Showing {{count}} Funko(s)"
  },
  "settings": {
    "title": "Settings",
    "language": "Language",
    "appInfo": "App Information",
    "version": "Version",
    "storage": "Storage",
    "imageStorage": "Image Storage Info",
    "helpGuide": "Help & Guide",
    "howToDelete": "How to Delete Items",
    "comingSoon": "Coming Soon"
  },
  "alerts": {
    "deleteTitle": "Delete Funko",
    "deleteMessage": "This action cannot be undone and will also delete all associated images.",
    "imageStorageTitle": "Image Storage",
    "imageStorageMessage": "Images are stored in the app's directory and will be lost if you uninstall the app. They will persist through app updates.\n\nBackup options coming soon!",
    "deleteInstructions": "To delete a Funko from your collection:\n\n1. Long press on any Funko card\n2. Tap 'Delete' from the menu\n3. Confirm deletion when prompted\n\nNote: This action cannot be undone and will also delete all associated images."
  }
}
```

#### Usage in Components

```typescript
import { t } from "@/i18n";

export function FunkoForm() {
  return (
    <View>
      <Text>{t("funko.name")}</Text>
      <TextInput placeholder={t("funko.name")} />

      <Button title={t("common.save")} />
      <Button title={t("common.cancel")} />
    </View>
  );
}

// With pluralization
<Text>{t("search.showing", { count: funkos.length })}</Text>;

// With interpolation
Alert.alert(
  t("funko.deleteFunko"),
  t("funko.confirmDelete", { name: funko.name })
);
```

#### Language Selector (Settings Screen)

```typescript
import { changeLanguage } from "@/i18n";

export function LanguageSelector() {
  const languages = [
    { code: "en-US", label: "English (US)", flag: "🇺🇸" },
    { code: "es-MX", label: "Español (Latinoamérica)", flag: "🇲🇽" },
    { code: "fr-FR", label: "Français", flag: "🇫🇷" },
    { code: "de-DE", label: "Deutsch", flag: "🇩🇪" },
    { code: "it-IT", label: "Italiano", flag: "🇮🇹" },
    { code: "pt-BR", label: "Português (Brasil)", flag: "🇧🇷" },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState("en-US");

  const handleLanguageChange = async (code: string) => {
    await changeLanguage(code);
    setSelectedLanguage(code);
    // Trigger app re-render
  };

  return (
    <View>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          onPress={() => handleLanguageChange(lang.code)}
        >
          <Text>
            {lang.flag} {lang.label}
          </Text>
          {selectedLanguage === lang.code && <Text>✓</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
}
```

### Translation Strategy

#### Option 1: Manual Translation (Recommended for Quality)

- **Cost**: $50-200 one-time (freelance translators on Upwork/Fiverr)
- **Quality**: High (native speakers)
- **Timeline**: 1-2 weeks
- **Process**:
  1. Export en-US.json as base
  2. Hire native translators for each language
  3. Review for context accuracy (Funko terminology, collector slang)
  4. Import translated files

#### Option 2: AI Translation (Fast, Lower Quality)

- **Cost**: $10-50 (OpenAI GPT-4)
- **Quality**: Medium (requires review)
- **Timeline**: 1 day
- **Process**:
  ```typescript
  // Translate all strings with GPT-4
  const translated = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content: `Translate this JSON to ${targetLanguage}, maintaining keys: ${JSON.stringify(
          enUS
        )}`,
      },
    ],
  });
  ```
  - ⚠️ **Review Required**: AI may miss cultural nuances or collector terminology

#### Option 3: Hybrid (Best Balance)

- Use AI for initial translation
- Native speaker review for corrections
- Community contributions (Reddit r/funkopop for slang verification)

### Localization Considerations

#### Numbers & Currency

```typescript
// Use Intl for proper formatting
const price = new Intl.NumberFormat(i18n.locale, {
  style: "currency",
  currency: getCurrencyForLocale(i18n.locale), // USD, EUR, MXN, BRL
}).format(funko.purchase_price);

// Helper function
function getCurrencyForLocale(locale: string): string {
  const currencyMap = {
    "en-US": "USD",
    "es-MX": "MXN",
    "fr-FR": "EUR",
    "de-DE": "EUR",
    "it-IT": "EUR",
    "pt-BR": "BRL",
  };
  return currencyMap[locale] || "USD";
}
```

#### Dates

```typescript
// Use Intl.DateTimeFormat
const formattedDate = new Intl.DateTimeFormat(i18n.locale, {
  year: "numeric",
  month: "short",
  day: "numeric",
}).format(new Date(funko.purchase_date));
```

#### Right-to-Left (RTL) Support (Future)

- Not needed for initial languages (all LTR)
- For Arabic/Hebrew: Use `expo-localization` to detect RTL
- Mirror UI components with `I18nManager.isRTL`

### Testing Checklist

1. ✅ Test all screens in each language
2. ✅ Verify text doesn't overflow (German is 30% longer than English)
3. ✅ Check currency formatting matches locale
4. ✅ Test date formats (MM/DD/YYYY vs DD/MM/YYYY)
5. ✅ Verify language selector persists after app restart
6. ✅ Test fallback to English if translation missing
7. ✅ Check that images/icons don't contain hardcoded text

### Funko Collector Terminology

**Important**: Some terms should NOT be translated:

- "Funko Pop" - Keep as-is (brand name)
- "Chase" - Keep as-is (collector term, recognized globally)
- "Vaulted" - Keep as-is (Funko-specific term)
- "Grail" - Keep as-is (collector slang)

**Do translate**:

- Conditions (Mint, Near Mint, etc.)
- Categories (Movies, TV Shows, Games, etc.)
- UI actions (Add, Edit, Delete, etc.)

### App Store Localization

**Required for App Store Connect:**

- App name translation (optional, "Fun-Kollection" works globally)
- Description in each language
- Screenshots with localized text overlays
- Keywords for ASO (App Store Optimization)

**Recommended Approach**:

1. Launch with English only
2. Add Spanish (MX) for Latin American market (30% of Funko collectors)
3. Add European languages (FR, DE, IT) for EU expansion
4. Add Portuguese (BR) for Brazilian market

### Cost Breakdown

| Task                          | Cost                | Timeline  |
| ----------------------------- | ------------------- | --------- |
| **i18n Setup**                | $0 (built-in)       | 2 days    |
| **Translation (6 languages)** | $50-200 (freelance) | 1-2 weeks |
| **QA Testing**                | $0 (manual)         | 3 days    |
| **App Store Localization**    | $0 (self-service)   | 1 day     |
| **Total**                     | $50-200             | 2-3 weeks |

### Implementation Priority

**Phase 1 (Launch)**: English (US) only  
**Phase 2 (Month 2)**: Add Spanish (MX/419) - High ROI  
**Phase 3 (Month 3)**: Add European languages (FR, DE, IT) - EU market  
**Phase 4 (Month 4)**: Add Portuguese (BR) - Complete Latin America coverage

---

**Last Updated**: November 2025 - Added comprehensive feature roadmap including CSV import, monetization, AI integration (OCR, predictions, NLP), social features, internationalization (i18n) support for 6 languages, and implementation details with cost analysis.
