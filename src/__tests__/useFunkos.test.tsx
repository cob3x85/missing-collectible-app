import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import React from "react";
import { Funko } from "../database/schema";
import {
  useCreateFunko,
  useDeleteFunko,
  useFunkos,
  useUpdateFunko,
} from "../hooks/useFunkos";

// Mock database
jest.mock("../services/db", () => ({
  db: {
    getAllFunkos: jest.fn(),
    getFunkoById: jest.fn(),
    createFunko: jest.fn(),
    updateFunko: jest.fn(),
    deleteFunko: jest.fn(),
    searchFunkos: jest.fn(),
    getFunkosPaginated: jest.fn(),
  },
}));

// Mock images service
jest.mock("../services/images", () => ({
  images: {
    deleteImage: jest.fn(),
  },
}));

const mockFunkos: Funko[] = [
  {
    id: "1",
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
    notes: "First Funko",
    has_protector_case: true,
    image_paths: ["/path/to/image.jpg"],
    created_at: Date.now(),
    updated_at: Date.now(),
  },
];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useFunkos hook", () => {
  it("fetches all funkos successfully", async () => {
    const { db } = require("../services/db");
    db.getAllFunkos.mockResolvedValue(mockFunkos);

    const { result } = renderHook(() => useFunkos(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockFunkos);
    expect(db.getAllFunkos).toHaveBeenCalled();
  });

  it("handles fetch error gracefully", async () => {
    const { db } = require("../services/db");
    db.getAllFunkos.mockRejectedValue(new Error("Database error"));

    const { result } = renderHook(() => useFunkos(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeTruthy();
  });
});

describe("useCreateFunko hook", () => {
  it("creates a funko and invalidates cache", async () => {
    const { db } = require("../services/db");
    db.createFunko.mockResolvedValue("new-id");

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useCreateFunko({ onSuccess }), {
      wrapper: createWrapper(),
    });

    const newFunko = {
      name: "Iron Man",
      series: "Marvel",
      number: "285",
      category: "Movies",
      condition: "mint" as const,
      size: "standard" as const,
      type: "standard_pop" as const,
      variant: "normal" as const,
    };

    result.current.mutate(newFunko);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(db.createFunko).toHaveBeenCalledWith(newFunko);
    expect(onSuccess).toHaveBeenCalled();
  });
});

describe("useUpdateFunko hook", () => {
  it("updates a funko and invalidates cache", async () => {
    const { db } = require("../services/db");
    db.updateFunko.mockResolvedValue(undefined);

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useUpdateFunko({ onSuccess }), {
      wrapper: createWrapper(),
    });

    const updates = {
      current_value: 30.0,
      condition: "near_mint" as const,
    };

    result.current.mutate({ id: "1", updates });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(db.updateFunko).toHaveBeenCalledWith("1", updates);
    expect(onSuccess).toHaveBeenCalled();
  });
});

describe("useDeleteFunko hook", () => {
  it("deletes a funko and its images", async () => {
    const { db } = require("../services/db");
    const { images } = require("../services/images");

    db.getFunkoById.mockResolvedValue(mockFunkos[0]);
    db.deleteFunko.mockResolvedValue(undefined);
    images.deleteImage.mockResolvedValue(undefined);

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useDeleteFunko({ onSuccess }), {
      wrapper: createWrapper(),
    });

    result.current.mutate("1");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(db.deleteFunko).toHaveBeenCalledWith("1");
    expect(onSuccess).toHaveBeenCalled();
  });
});
