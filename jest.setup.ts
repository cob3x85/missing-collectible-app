// Mock expo winter module and globals
(global as any).__ExpoImportMetaRegistry = {};
(global as any).structuredClone =
  (global as any).structuredClone ||
  ((obj: any) => JSON.parse(JSON.stringify(obj)));

// Mock expo winter runtime
jest.mock("expo/src/winter/runtime.native", () => ({}), { virtual: true });
jest.mock("expo/src/winter/installGlobal", () => ({}), { virtual: true });

// Mock expo modules
jest.mock("expo", () => ({
  __ExpoImportMetaRegistry: {},
  registerRootComponent: jest.fn(),
}));

jest.mock("expo-font");
jest.mock("expo-asset");
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy",
  },
  NotificationFeedbackType: {
    Success: "success",
    Warning: "warning",
    Error: "error",
  },
}));
jest.mock("expo-audio");
jest.mock("expo-file-system");
jest.mock("expo-image-picker");
jest.mock("expo-sqlite", () => ({
  openDatabaseAsync: jest.fn(() =>
    Promise.resolve({
      execAsync: jest.fn(),
      getAllAsync: jest.fn(() => Promise.resolve([])),
      getFirstAsync: jest.fn(() => Promise.resolve(null)),
      runAsync: jest.fn(() =>
        Promise.resolve({ lastInsertRowId: 1, changes: 1 })
      ),
    })
  ),
}));

// Mock uuid
jest.mock("uuid", () => ({
  v4: jest.fn(() => "test-uuid-123"),
}));

// Mock database service
jest.mock("./src/services/database", () => ({
  DatabaseService: jest.fn().mockImplementation(() => ({
    init: jest.fn(() => Promise.resolve()),
    createFunko: jest.fn((funko) => Promise.resolve("test-id-123")),
    getAllFunkos: jest.fn(() => Promise.resolve([])),
    getFunkoById: jest.fn(() => Promise.resolve(null)),
    updateFunko: jest.fn(() => Promise.resolve()),
    deleteFunko: jest.fn(() => Promise.resolve()),
    searchFunkos: jest.fn(() => Promise.resolve([])),
    getFunkosPaginated: jest.fn(() => Promise.resolve([])),
    getTotalFunkosCount: jest.fn(() => Promise.resolve(0)),
  })),
  databaseService: {
    init: jest.fn(() => Promise.resolve()),
    createFunko: jest.fn(() => Promise.resolve("test-id-123")),
    getAllFunkos: jest.fn(() => Promise.resolve([])),
    getFunkoById: jest.fn(() => Promise.resolve(null)),
    updateFunko: jest.fn(() => Promise.resolve()),
    deleteFunko: jest.fn(() => Promise.resolve()),
    searchFunkos: jest.fn(() => Promise.resolve([])),
    getFunkosPaginated: jest.fn(() => Promise.resolve([])),
    getTotalFunkosCount: jest.fn(() => Promise.resolve(0)),
  },
}));

// Mock images service
jest.mock("./src/services/images", () => ({
  images: {
    saveImage: jest.fn(() => Promise.resolve("mock-image-path.jpg")),
    deleteImage: jest.fn(() => Promise.resolve()),
    getImageUri: jest.fn((path) => `file://${path}`),
  },
}));

// Mock react-native-vector-icons
jest.mock("react-native-vector-icons/FontAwesome", () => "FontAwesome");

// Mock navigation
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
  useTheme: () => ({
    colors: {
      primary: "#f46d03",
      text: "#000000",
      background: "#ffffff",
    },
  }),
}));
