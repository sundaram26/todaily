import { DashboardNav } from "@/common/components/dashboard-nav";
import { Sidebar } from "@/common/components/sidebar"

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="h-full w-full flex selection:bg-primary/50 selection:text-primary-foreground">
            <Sidebar />
            <div className="flex-1">
                <DashboardNav />
                {children}
            </div>
        </div>
    );
}