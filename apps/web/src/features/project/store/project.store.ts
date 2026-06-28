import { create } from "zustand";

export interface Project {
  id: string;
  title: string;
  description: string;
  created_by: string;
  position: number;
  updated_at: Date;
  created_at: Date;
}

export interface CustomField{
    id: string;
    type: "status" | "priority" | "label";
    title: string;
    color: string;
}

type ProjectState = {
    isModalOpen: boolean;
    isEditMode: boolean;
    editingProjectId?: string;
}

type ProjectActions = {
    openModal: (mode?: 'create' | 'edit', projectId?: string) => void;
    closeModal: () => void    
}

type ProjectStore = ProjectState & ProjectActions;

export const useProjectStore = create<ProjectStore>((set) => ({
    isModalOpen: false,
    isEditMode: false,

    openModal: (mode = 'create', projectId) => set({
        isModalOpen: true,
        isEditMode: mode === 'edit',
        editingProjectId: projectId,
    }),

    closeModal: () => set({
        isModalOpen: false,
        isEditMode: false,
        editingProjectId: undefined
    })
}));