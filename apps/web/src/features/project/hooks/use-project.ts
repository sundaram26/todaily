import { useQuery } from "@tanstack/react-query";
import { getProjectsById, getProjectsWithoutWorkspace } from "../api/project.api";

export const useProjectsWithoutWorkspace = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjectsWithoutWorkspace,
    staleTime: 60 * 1000,
  });
};

export const useProjectById = (project_id: string) => {
  return useQuery({
    queryKey: ["project", project_id],
    queryFn: () => getProjectsById(project_id),
    enabled: !!project_id,
  });
};