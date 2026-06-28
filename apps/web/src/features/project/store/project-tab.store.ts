import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProjectTab = {
    id: string;
    title: string;
}

type ProjectTabState = {
    openTabs: ProjectTab[];
    activeTabId: string | null;
    openTab: (project: ProjectTab) => void;
    closeTab: (projectId: string) => void;
    setActiveTab: (projectId: string) => void;
}

export const useProjectTabStore = create<ProjectTabState>()(
    persist(
        (set) => ({
            openTabs: [],
            activeTabId: null,

            openTab: (project: ProjectTab) => set((state) => {
                const exists = state.openTabs.find(tab => tab.id === project.id);
                if (exists) {
                    return { activeTabId: project.id }
                }

                return {
                    openTabs: [...state.openTabs, project],
                    activeTabId: project.id
                }
            }),

            closeTab: (projectId: string) => set((state) => ({
                openTabs: state.openTabs.filter(tab => tab.id !== projectId),
                activeTabId: state.activeTabId === projectId ? null : state.activeTabId
            })),

            setActiveTab: (projectId: string) => set({ activeTabId: projectId })
        }),
        { name: "project-tabs" }
    ),
)