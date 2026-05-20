"use client";

import { ProjectTabs } from "@/features/project/components/project-tabs-bar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";


export const DashboardNav = () => {
    const pathname = usePathname();

    const getContentName = () => {
        return pathname.split('/')[1].split("-").join(" ")
    }

    const getIsActivePage = (path: string) => {
        return `/${path}` === pathname;
    };

    return (
      <div className="h-[8%] w-full border-b-2 border-border flex">
        <div
          className={cn(
            "h-full p-4 flex items-center border-r-2 border-border",
            getIsActivePage(pathname.split("/")[1]) && "bg-primary-hover/10",
          )}
        >
          <p className="text-sm font-semibold capitalize">{getContentName()}</p>
        </div>
        <div
            className={cn(
                "h-full flex items-center",
                getIsActivePage(pathname.split("/")[1]) && "bg-foreground-muted/40",
            )}
        >
          <ProjectTabs />
        </div>
      </div>
    );
}