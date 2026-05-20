import { X } from "lucide-react";
import { useProjectTabStore } from "../store/project-tab.store"
import { cn } from "@/lib/utils";



export const ProjectTabs = () => {

    const { openTabs, activeTabId, setActiveTab } = useProjectTabStore();

    return (
        <div className="h-full flex">
            {openTabs.map((project) => {
                const isActiveTab = activeTabId === project.id;
                return (
                    <div
                        key={project.id}
                        onClick={() => setActiveTab(project.id)}
                    >
                        <div
                            className={cn(
                                "h-full flex justify-between items-center gap-2 px-4 border-l border-y border-border",
                                isActiveTab ? "bg-primary" : "bg-transparent"
                            )}
                        >
                            <p className="text-sm font-semibold">{project.title}</p>
                            <X className="h-4 w-4 font-semibold" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}