"use client";

import { ProjectTabs } from "@/features/project/components/project-tabs-bar";
import { useProjectTabStore } from "@/features/project/store/project-tab.store";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";


export const DashboardNav = () => {
  const pathname = usePathname();
  const { setActiveTab } = useProjectTabStore();

    const getContentName = () => {
        return pathname.split('/')[1].split("-").join(" ")
    }

    const getIsActivePage = (path: string) => {
        return `/${path}` === pathname;
    };

    return (
      <div className="h-[72px] w-full border-b-2 border-border flex">
        <div
          className={cn(
            "h-full p-4 flex items-center border-r-2 border-border cursor-pointer",
            getIsActivePage(pathname.split("/")[1]) && "bg-primary-hover/10",
          )}
          onClick={() => setActiveTab("")}
        >
          <p className="text-sm font-semibold capitalize">{getContentName()}</p>
        </div>
        {getIsActivePage("projects") && (
          <div
            className={cn(
              "h-full flex items-center",
              getIsActivePage(pathname.split("/")[1]) &&
                "bg-foreground-muted/40",
            )}
          >
            <ProjectTabs />
          </div>
        )}
      </div>
    );
}