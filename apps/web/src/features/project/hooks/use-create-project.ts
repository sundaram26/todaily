import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CreateProjectType } from "../types";
import { createProject } from "../api/project.api";
import { toast } from "sonner";



export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateProjectType) => createProject(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"]})
        },
        onError: (error) => {
            toast.error(error.message || "Unable to create the project", { position: "top-center" })
        }
    })
}