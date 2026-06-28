"use client";

import { PlusIcon } from "@/common/icons/plus";
import { cn } from "@/lib/utils";
import { AddProjectModal } from "./add-project-modal";
import { useProjectStore } from "../store/project.store";

const CreateProjectCard = () => {
  const { isModalOpen, isEditMode,  openModal } = useProjectStore();
    return (
      <>
        <div
          onClick={(e: any) => openModal(e)}
          className={cn(
            "border-l border-t border-r border-b border-primary-foreground/60 bg-primary-foreground/60 inset-shadow-gray-800 -ml-px -mt-px",
            "flex flex-col justify-center items-center gap-2",
          )}
        >
          <PlusIcon />
          <p className="font-semibold text-sm">Create New Project</p>
        </div>
        {isModalOpen &&  isEditMode ? <AddProjectModal /> : <AddProjectModal />}
      </>
    );
};

export default CreateProjectCard;
