import { Funko } from "@/database/schema";
import { db } from "@/services/db";
import { images } from "@/services/images";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFunkos = () => {
  return useQuery({
    queryKey: ["funkos"],
    queryFn: () => db.getAllFunkos(),
  });
};

export const useFunko = (id: string) => {
  return useQuery({
    queryKey: ["funko", id],
    queryFn: () => db.getFunkoById(id),
    enabled: !!id,
  });
};

export const useCreateFunko = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      funko: Omit<Funko, "id" | "created_at" | "updated_at">
    ) => {
      return await db.createFunko(funko);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funkos"] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

export const useUpdateFunko = (options?: {
  onSuccess?: (
    data: void,
    variables: {
      id: string;
      updates: Partial<Omit<Funko, "id" | "created_at">>;
    }
  ) => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Omit<Funko, "id" | "created_at">>;
    }) => {
      await db.updateFunko(id, updates);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["funkos"] });
      queryClient.invalidateQueries({ queryKey: ["funko", variables.id] });
      options?.onSuccess?.(data, variables);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

export const useDeleteFunko = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Get funko to delete associated image
      const funko = await db.getFunkoById(id);
      if (funko?.image_path) {
        await images.deleteImage(funko.image_path);
      }
      await db.deleteFunko(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funkos"] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

export const useSearchFunkos = (query: string) => {
  return useQuery({
    queryKey: ["funkos", "search", query],
    queryFn: () => db.searchFunkos(query),
    enabled: query.length > 0,
  });
};
