import { Funko } from "@/database/schema";
import { databaseService } from "@/services/database";
import { imageStorageService } from "@/services/imageStorage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFunkos = () => {
  return useQuery({
    queryKey: ["funkos"],
    queryFn: () => databaseService.getAllFunkos(),
  });
};

export const useFunko = (id: string) => {
  return useQuery({
    queryKey: ["funko", id],
    queryFn: () => databaseService.getFunkoById(id),
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
      return await databaseService.createFunko(funko);
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
      await databaseService.updateFunko(id, updates);
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
      const funko = await databaseService.getFunkoById(id);
      if (funko?.image_path) {
        await imageStorageService.deleteImage(funko.image_path);
      }
      await databaseService.deleteFunko(id);
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
    queryFn: () => databaseService.searchFunkos(query),
    enabled: query.length > 0,
  });
};
