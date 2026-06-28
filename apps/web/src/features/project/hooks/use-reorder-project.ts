import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ReorderProjectType } from "../types";
import { reorderProject } from "../api/project.api";


export const useReorderProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ReorderProjectType) => reorderProject(data),
        onMutate: async (newOrder) => {
            await queryClient.cancelQueries({ queryKey: ["projects"] });
            const previousProjects = queryClient.getQueryData(["projects"]);
            queryClient.setQueryData(["projects"], (old: any) => {
                if (!old) return old;

                const positionMap = new Map(newOrder.projects.map(p => [p.id, p.position]))
                
                return {
                    ...old,
                    data: old.data.map((item: any) => ({
                        ...item,
                        project: {
                            ...item.project,
                            position: positionMap.get(item.project.id) ?? item.project.position
                        }
                    }))
                }
            })
            return { previousProjects };
        },
        onError: (error, newOrder, context) => {
            queryClient.setQueryData(["projects"], context?.previousProjects)
        }
    })
}