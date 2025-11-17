# Fun-Kollection App - Testing Guide

## Setup

Testing dependencies are already installed. Run tests with:

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Test Structure

```
src/
├── __tests__/
│   ├── database.test.ts       # Database service unit tests
│   ├── FunkoCard.test.tsx     # Component tests
│   └── useFunkos.test.tsx     # React Query hook tests
```

## What's Tested

### Database Service (`database.test.ts`)

- ✅ Creating Funkos with required and optional fields
- ✅ Updating Funkos with partial data
- ✅ Boolean to INTEGER conversion (SQLite)
- ✅ Searching across multiple fields
- ✅ Pagination with LIMIT and OFFSET

### FunkoCard Component (`FunkoCard.test.tsx`)

- ✅ Rendering Funko name, series, and number
- ✅ Currency formatting for prices
- ✅ Variant badge display logic
- ✅ Protector case badge display
- ✅ Conditional rendering based on data

### TanStack Query Hooks (`useFunkos.test.tsx`)

- ✅ Fetching all Funkos
- ✅ Error handling
- ✅ Creating Funkos with cache invalidation
- ✅ Updating Funkos with cache invalidation
- ✅ Deleting Funkos with image cleanup

## Mocked Dependencies

The following Expo and React Native modules are mocked in `jest.setup.js`:

- expo-font
- expo-haptics
- expo-audio
- expo-file-system
- expo-image-picker
- expo-sqlite
- @react-navigation/native
- react-native-vector-icons

## Writing New Tests

### Component Test Example

```typescript
import { render, screen } from "@testing-library/react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import YourComponent from "../components/YourComponent";

describe("YourComponent", () => {
  it("renders correctly", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <YourComponent />
      </QueryClientProvider>
    );
    expect(screen.getByText("Expected Text")).toBeTruthy();
  });
});
```

### Hook Test Example

```typescript
import { renderHook, waitFor } from "@testing-library/react-native";
import { useYourHook } from "../hooks/useYourHook";

describe("useYourHook", () => {
  it("returns expected data", async () => {
    const { result } = renderHook(() => useYourHook(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
```

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Running Specific Tests

```bash
# Run tests matching a pattern
npm test -- FunkoCard

# Run tests in a specific file
npm test -- database.test.ts

# Update snapshots
npm test -- -u
```

## Common Issues

### Mock Not Working

If a module mock isn't working, check `jest.setup.js` and ensure the module path is correct.

### Type Errors in Tests

Install type definitions:

```bash
npm install --save-dev @types/jest
```

### React Query Tests Failing

Ensure each test uses a fresh `QueryClient` instance to avoid cache pollution between tests.

## CI/CD Integration

Add to your CI pipeline:

```yaml
- name: Run tests
  run: npm test -- --ci --coverage --maxWorkers=2
```
