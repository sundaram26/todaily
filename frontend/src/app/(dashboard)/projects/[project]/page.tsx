"use client";
import { useProjectTabStore } from "@/features/project/store/project-tab.store";


function page() {
    const { activeTabId } = useProjectTabStore();

    return (
        <div>
            <p>{activeTabId}</p>
        </div>
    )
}


export default page;