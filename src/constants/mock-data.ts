import { Funko } from "@/database/schema";

export const MOCK_FUNKOS: Funko[] = [
  {
    id: "mock-1",
    name: "Goku Super Saiyan",
    series: "Dragon Ball Z",
    number: "517",
    category: "Pop!",
    condition: "mint",
    image_data: JSON.stringify([
      "iVBORw0KGgoAAAANSUhEUgAAAAUA...", // Base64 placeholder
    ]),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-2",
    name: "Spider-Man",
    series: "Marvel",
    number: "593",
    category: "Pop!",
    condition: "near_mint",
    image_data: JSON.stringify([
      "iVBORw0KGgoAAAANSUhEUgAAAAUA...", // Base64 placeholder
    ]),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
