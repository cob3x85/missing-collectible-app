import { Funko, FunkoSize, FunkoType, FunkoVariant } from "@/database/schema";

type FunkoFormData = {
  name: string;
  series: string;
  number: string;
  category: string;
  condition: "mint" | "near_mint" | "good" | "fair" | "poor";
  size: FunkoSize;
  type: FunkoType;
  variant: FunkoVariant;
  purchase_price: string;
  current_value: string;
  purchase_date: string;
  notes: string;
  hasProtectorCase: boolean;
};

interface FunkoFormProps {
  mode?: "create" | "edit";
  initialData?: Funko;
  onSuccess?: () => void;
};

export { FunkoFormData, FunkoFormProps };
