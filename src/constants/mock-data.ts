import { Funko } from "@/database/schema";

export const MOCK_FUNKOS: Funko[] = [
  {
    id: "mock-1",
    name: "Goku Super Saiyan",
    series: "Dragon Ball Z",
    number: "517",
    category: "Pop!",
    condition: "mint",
    image_path: "https://i.ebayimg.com/images/g/bUEAAOSw-wJl8rIL/s-l1200.jpg",
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
    image_path: "https://i.ebayimg.com/images/g/N7oAAOSwIZ5mLhY~/s-l1200.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
