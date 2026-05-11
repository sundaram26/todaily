"use client";

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
      <div className="h-[8%] w-full border-b-2 border-border flex justify-between">
            <div className={cn(
                "h-full p-4 flex items-center border-r-2 border-border",
                getIsActivePage(pathname.split('/')[1]) && "bg-primary-hover/10"
            )}>
                <p className="text-md font-semibold capitalize">{getContentName()}</p>
            </div>
      </div>
    );
}