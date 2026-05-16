"use client";

import { PlusIcon } from "@/common/icons/plus";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AddProjectModal } from "./add-project-modal";

const CreateProjectCard = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
        <div
            onClick={() => setIsOpen(true)}
            className={cn(
                "border-l border-t border-r border-b border-ring bg-primary-foreground",
                "flex flex-col justify-center items-center gap-2",
            )}
            >
            <PlusIcon />
            <p className="font-semibold text-sm">Create New Project</p>
        </div>
        <AddProjectModal isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    );
};

export default CreateProjectCard;
