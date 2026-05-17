"use client";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/react/sortable";
import { projects } from "../dummy-data";

interface ProjectCardType {
    id: string;
    index: number;
}

const ProjectCard = ({ id, index }: ProjectCardType) => {
    const { ref, isDragSource } = useSortable({ id, index });

    const data = projects.filter((project) => project.id === id);
    const projectData = data[0];
    return (
      <div
        ref={ref}
        className={cn(
          "border-l border-t border-r border-b border-ring bg-primary-foreground -ml-px -mt-px",
            `${isDragSource ? "opacity-40" : "opacity-100"}`,
          "p-4"
        )}
      >
        <h1 className="font-semibold text-md text-foreground tracking-tight mb-2">{projectData.title}</h1>
        <p className="font-medium text-sm text-foreground-muted tracking-tight">{projectData.description}</p>
      </div>
    );
}

export default ProjectCard;