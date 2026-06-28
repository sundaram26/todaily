import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UpdateProjectType } from "../types";
import { updateProject } from "../api/project.api";
import { toast } from "sonner";


export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateProjectType) => updateProject(data),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["projects"] }),
            queryClient.invalidateQueries({ queryKey: ["project"] }),
            toast.success(res.message || "project updated", { position: "top-center" })
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "failed to update project", { position: "top-center" })
        }
    })
}