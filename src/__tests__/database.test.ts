import { Funko } from "../database/schema";
import { databaseService } from "../services/database";

describe("DatabaseService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createFunko", () => {
    it("should create a new Funko with all required fields", async () => {
      const mockFunko: Omit<Funko, "id" | "created_at" | "updated_at"> = {
        name: "Spider-Man",
        series: "Marvel",
        number: "574",
        category: "Movies",
        condition: "mint",
        size: "standard",
        type: "standard_pop",
        variant: "normal",
        purchase_price: 15.99,
        current_value: 25.0,
        purchase_date: Date.now(),
        notes: "Test note",
        has_protector_case: true,
        image_paths: ["/path/to/image.jpg"],
      };

      const result = await databaseService.createFunko(mockFunko);

      expect(databaseService.createFunko).toHaveBeenCalledWith(mockFunko);
      expect(typeof result).toBe("string");
    });

    it("should handle optional fields correctly", async () => {
      const mockFunko: Omit<Funko, "id" | "created_at" | "updated_at"> = {
        name: "Spider-Man",
        series: "Marvel",
        number: "574",
        category: "Movies",
        condition: "mint",
        size: "standard",
        type: "standard_pop",
        variant: "normal",
      };

      const result = await databaseService.createFunko(mockFunko);

      expect(databaseService.createFunko).toHaveBeenCalledWith(mockFunko);
      expect(typeof result).toBe("string");
    });
  });

  describe("updateFunko", () => {
    it("should update only provided fields", async () => {
      const updates = {
        current_value: 30.0,
        condition: "near_mint" as const,
      };

      await databaseService.updateFunko("test-id", updates);

      expect(databaseService.updateFunko).toHaveBeenCalledWith(
        "test-id",
        updates
      );
    });

    it("should handle boolean fields", async () => {
      await databaseService.updateFunko("test-id", {
        has_protector_case: false,
      });

      expect(databaseService.updateFunko).toHaveBeenCalledWith("test-id", {
        has_protector_case: false,
      });
    });
  });

  describe("searchFunkos", () => {
    it("should call searchFunkos with query", async () => {
      const results = await databaseService.searchFunkos("spider");

      expect(databaseService.searchFunkos).toHaveBeenCalledWith("spider");
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe("getFunkosPaginated", () => {
    it("should call getFunkosPaginated with limit and offset", async () => {
      const results = await databaseService.getFunkosPaginated(5, 0);

      expect(databaseService.getFunkosPaginated).toHaveBeenCalledWith(5, 0);
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe("getAllFunkos", () => {
    it("should return all funkos", async () => {
      const results = await databaseService.getAllFunkos();

      expect(databaseService.getAllFunkos).toHaveBeenCalled();
      expect(Array.isArray(results)).toBe(true);
    });
  });
});
