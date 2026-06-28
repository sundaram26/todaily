"use client";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/react/sortable";
import { useCustomFields } from "../hooks/use-custom-fields";
import { EllipsisVertical, GripVertical } from "lucide-react";
import { useProjectStore } from "../store/project.store";
import { format } from "date-fns";
import { useProjectTabStore } from "../store/project-tab.store";

interface ProjectCardType {
  id: string;
  title: string;
  description?: string;
  position?: number;
  label_id?: string;
  created_at: string;
  due_date: string;
}

const ProjectCard = ({ project }: { project: ProjectCardType }) => {
  const { ref, isDragSource } = useSortable({
    id: project.id,
    index: project.position ?? 0
  });
  const { openModal } = useProjectStore();
  const { data: customFields } = useCustomFields(project.id);
  const { openTab } = useProjectTabStore();
  const projectLabel = customFields?.find((field: any) => 
    field.id === project.label_id && field.type === "label"
  )

  return (
    <div
      ref={ref}
      onClick={() => openTab({id: project.id, title: project.title})}
      className={cn(
        "border border-ring bg-primary-foreground",
        "-ml-px -mt-px",
        "p-3 sm:p-4",
        "cursor-pointer",
        "min-h-[220px]",
        "transition-opacity",
        isDragSource ? "opacity-40" : "opacity-100",
      )}
    >
      <div className="flex h-full flex-col justify-between gap-5">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            {projectLabel && (
              <div
                className="max-w-[120px] truncate rounded-full px-2 py-1 text-xs font-medium text-white"
                style={{
                  backgroundColor: projectLabel.color,
                }}
              >
                {projectLabel.title}
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                openModal("edit", project.id);
              }}
              className="rounded-md p-1.5 hover:bg-accent transition-colors"
            >
              <EllipsisVertical className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-1">
            <h1 className="line-clamp-2 text-base font-bold tracking-tight sm:text-lg lg:text-xl">
              {project.title}
            </h1>

            <p className="line-clamp-3 text-sm font-medium tracking-tight text-muted-foreground">
              {project.description}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-foreground">Created</h3>

            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              {format(project.created_at, "PPP")}
            </p>
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-medium text-foreground">Due Date</h3>

            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              {project.due_date
                ? format(project.due_date, "PPP")
                : "No due date"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;