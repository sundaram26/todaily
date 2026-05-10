import { Sidebar } from "@/common/components/sidebar"

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="h-full w-full flex">
            <Sidebar />
            {children}
        </div>
    )
}