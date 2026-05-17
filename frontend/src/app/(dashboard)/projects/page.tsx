"use client";
import CreateProjectCard from "@/features/project/components/create-project-card";
import ProjectCard from "@/features/project/components/project-card";
import { DragDropProvider, DragOverlay, useDragOperation } from "@dnd-kit/react"
import { isSortable } from "@dnd-kit/react/sortable";
import { useProjectStore } from "@/features/project/store/project.store";


function PageContent() {
    const { projects } = useProjectStore();
    const { source } = useDragOperation();

    const draggedProject = source ? projects.find(p => p.id === source.id) : null;

    return (
      <>
        <div className="grid h-[calc(100vh-61px)] grid-cols-3 grid-rows-2">
          <CreateProjectCard />
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              index={project.position ?? 0}
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
    const { reorderProjects } = useProjectStore();

    return (
      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled) return;
          const { source } = event.operation;

          if (isSortable(source)) {
            const { initialIndex, index } = source;
            if (initialIndex !== index) {
              reorderProjects(initialIndex, index);
            }
          }
        }}
      >
        <PageContent />
      </DragDropProvider>
    );
}

export default page;