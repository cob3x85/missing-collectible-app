import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react-native";
import React from "react";
import { Image } from "react-native";
import { FunkoCard } from "../components/funkos/FunkoCard";
import { Funko } from "../database/schema";

// Mock navigation
jest.mock("@react-navigation/native");

// Mock haptics
jest.mock("../hooks/useHapticFeedback", () => ({
  useHapticFeedback: () => ({
    playFeedback: jest.fn(),
  }),
}));

// Mock image component
jest.mock("expo-image", () => ({
  Image: "Image",
}));

const mockFunko: Funko = {
  id: "1",
  name: "Spider-Man",
  series: "Marvel",
  number: "574",
  category: "Movies",
  condition: "mint",
  size: "standard",
  type: "standard_pop",
  variant: "chase",
  purchase_price: 15.99,
  current_value: 25.0,
  purchase_date: Date.now(),
  notes: "First Funko",
  has_protector_case: true,
  image_paths: ["/path/to/image.jpg"],
  created_at: Date.now(),
  updated_at: Date.now(),
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("FunkoCard", () => {
  it("renders Funko name correctly", () => {
    render(<FunkoCard {...mockFunko} />, { wrapper });
    expect(screen.getByText("Spider-Man")).toBeTruthy();
  });

  it("displays number badge", () => {
    render(<FunkoCard {...mockFunko} />, { wrapper });
    expect(screen.getByText("574")).toBeTruthy();
  });

  it("renders without number badge when number is not provided", () => {
    const noNumberFunko = { ...mockFunko, number: "" };
    render(<FunkoCard {...noNumberFunko} />, { wrapper });
    expect(screen.queryByText("574")).toBeNull();
  });

  it("shows placeholder when no image is provided", () => {
    const noImageFunko = { ...mockFunko, image_paths: [] };
    render(<FunkoCard {...noImageFunko} />, { wrapper });
    expect(screen.getByText("No Image")).toBeTruthy();
  });

  it("renders with image when image_paths is provided", () => {
    const { UNSAFE_getByType } = render(<FunkoCard {...mockFunko} />, {
      wrapper,
    });
    const images = UNSAFE_getByType(Image);
    expect(images).toBeTruthy();
  });
});
