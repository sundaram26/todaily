"use client";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/react/sortable";
import { useCustomFields } from "../hooks/use-custom-fields";
import { EllipsisVertical, GripVertical } from "lucide-react";

interface ProjectCardType {
  id: string;
  title: string;
  description?: string;
  position?: number;
  label_id?: string;
}

const ProjectCard = ({ project }: { project: ProjectCardType }) => {
  const { ref, isDragSource } = useSortable({
    id: project.id,
    index: project.position ?? 0
  });

  const { data: customFields } = useCustomFields(project.id);
  const projectLabel = customFields?.find((field: any) => 
    field.id === project.label_id && field.type === "label"
  )

  return (
    <div
      ref={ref}
      className={cn(
        "border-l border-t border-r border-b border-ring bg-primary-foreground -ml-px -mt-px",
        `${isDragSource ? "opacity-40" : "opacity-100"}`,
        "p-4 cursor-pointer",
      )}
    >
      <div className="relative">
        <EllipsisVertical className="absolute right-0 text-xl text-foreground" />
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-xl text-foreground tracking-tight mb-2">
          {project.title}
        </h1>
        {projectLabel && (
          <div className="flex gap-2">
            <span
              className="px-2 py-1 text-xs rounded-full"
              style={{
                backgroundColor: projectLabel.color,
                color: "#fff",
              }}
            >
              {projectLabel.title}
            </span>
          </div>
        )}
      </div>
      <p className="font-semibold text-sm text-foreground-muted tracking-tight">
        {project.description}
      </p>
    </div>
  );
}

export default ProjectCard;