"use client";
import CreateProjectCard from "@/features/project/components/create-project-card";
import ProjectCard from "@/features/project/components/project-card";
import { DragDropProvider, DragOverlay, useDragOperation } from "@dnd-kit/react"
import { isSortable } from "@dnd-kit/react/sortable";
import { useProjectsWithoutWorkspace } from "@/features/project/hooks/use-project";
import { useReorderProject } from "@/features/project/hooks/use-reorder-project";
import { useProjectTabStore } from "@/features/project/store/project-tab.store";
import { ActiveTab } from "@/features/project/components/active-tab";
import { ProjectSchemaType } from "@/features/project/types";
import { useEffect, useState } from "react";
import { Grid2x2, Kanban, Table } from "lucide-react";

interface ProjectType {
  id: string;
    title: string;
    description?: string;
  position?: number;
  created_at: string;
  due_date: string;
}

function PageContent() {
  const { data: projectsData, isLoading } = useProjectsWithoutWorkspace();
  const reorderProject = useReorderProject();
  const { activeTabId } = useProjectTabStore();
  const { source } = useDragOperation();

  const projects = projectsData?.data?.map((item: any) => item.project) || [];
  const draggedProject = source && projects.find((p: any) => p.id === source.id);
  const [project, setProject] = useState<ProjectSchemaType | null>(null);
  
  useEffect(() => {
    const projectData = projects.filter((project: ProjectSchemaType) => project.id === activeTabId);
    setProject(projectData[0] ?? null)
  }, [activeTabId, projects])
  
  if (isLoading) return <div>Loading...</div>;
  
  if (activeTabId) {
    if (project === null) return <div>it's null</div>;

    return (
      <div className="h-[calc(100vh-72px)] w-full">
        <div className="h-24 w-full px-8 flex justify-between items-center">
          <div className="w-[80%]">
            <h3 className="text-2xl font-semibold text-foreground">{project.title}</h3>
          </div>
          <div className="flex gap-2 text-foreground">
            <Table />
            <Grid2x2 />
            <Kanban />
          </div>
        </div>
        <ActiveTab activeTabId={activeTabId} />
      </div>
    );
  }

  return (
    <>
      <div className="grid h-[calc(100vh-61px)] grid-cols-3 grid-rows-2">
        <CreateProjectCard />
        {projects.map((project: ProjectType) => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
      </div>
      <DragOverlay className="bg-primary-foreground/80">
        {draggedProject && (
          <div className="border border-ring p-4 h-[calc((100vh-61px)/2)] w-[calc((100vw-288px)/3)]">
            <h1 className="font-semibold text-md text-foreground tracking-tight mb-2">
              {draggedProject.title}
            </h1>
            <p className="font-medium text-sm text-foreground-muted tracking-tight">
              {draggedProject.description}
            </p>
          </div>
        )}
      </DragOverlay>
    </>
  );
}

function page() {
    const { data: projectData } = useProjectsWithoutWorkspace();
  const reorderProject = useReorderProject();
  const projects = projectData?.data?.map((item: any) => item.project) || []

  function DragEnd(event: any) {
    if (event.canceled) return;
    const { source } = event.operation;

    if (isSortable(source)) {
      const { initialIndex, index } = source;
      if (initialIndex !== index) {
        const newProjects = [...projects];
        const [movedProject] = newProjects.splice(initialIndex, 1);
        newProjects.splice(index, 0, movedProject);

        const projectWithNewPositions = newProjects.map((project, i) => ({
          id: project.id,
          position: i
        }))

        reorderProject.mutate({ projects: projectWithNewPositions })
      }
    }
  }

    return (
      <DragDropProvider
        onDragEnd={(event) => DragEnd(event)}
      >
        <PageContent />
      </DragDropProvider>
    );
}

export default page;