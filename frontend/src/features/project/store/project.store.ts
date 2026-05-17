import { create } from "zustand";
import { projects as initialProjects } from "../dummy-data";

export interface Project {
  id: string;
  title: string;
  description: string;
  created_by: string;
  position: number;
  updated_at: Date;
  created_at: Date;
}
interface ProjectStore {
    projects: Project[];

    reorderProjects: (initailIndex: number, index: number) => void;
}


export const useProjectStore = create<ProjectStore>((set, get) => ({
    projects: initialProjects,
    reorderProjects: (initialIndex, index) => {
        const projects = [...get().projects];

        const initialPosition = projects.findIndex(p => p.position === initialIndex)
        const finalPosition = projects.findIndex(p => p.position === index);

        const [movedProject] = projects.splice(initialPosition, 1);
        projects.splice(finalPosition, 0, movedProject);

        // Update positions
        const reordered = projects.map((p, i) => ({ ...p, position: i }));

        set({ projects: reordered });
    },
}));