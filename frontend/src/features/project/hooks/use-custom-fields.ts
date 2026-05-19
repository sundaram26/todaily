import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCustomField,
  updateCustomField,
  getCustomFieldsByProjectId,
} from "../api/project.api";
import type { CustomFieldType, UpdateCustomFieldType } from "../types";
import { toast } from "sonner";

export const useCustomFields = (project_id: string) => {
  return useQuery({
    queryKey: ["customFields", project_id],
    queryFn: () => getCustomFieldsByProjectId(project_id),
    enabled: !!project_id,
  });
};

export const useCreateCustomField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CustomFieldType) => createCustomField(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["customFields"] });
      toast.success(res.message || "Custom field added", { position: "top-center" });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to add custom field",
        {
          position: "top-center",
        },
      );
    },
  });
};

export const useUpdateCustomField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCustomFieldType) => updateCustomField(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["customFields"] });
      toast.success(res.message || "Custom field updated", { position: "top-center" });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update custom field",
        {
          position: "top-center",
        },
      );
    },
  });
};
