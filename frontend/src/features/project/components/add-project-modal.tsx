"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AddProjectModalProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

export const AddProjectModal = ({ isOpen, setIsOpen }: AddProjectModalProps) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-primary-subtle/60"
          onClick={() => setIsOpen(false)}
        />

            <div className="h-[80%] w-[50%] bg-primary-foreground border-2 border-ring">
                
          <div className="absolute right-4 top-4">
             <Button onClick={() => setIsOpen(false)}>
            <X />
            </Button>
          </div>
        </div>
      </div>
    );
}