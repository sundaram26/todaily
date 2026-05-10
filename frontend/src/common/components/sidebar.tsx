

const SidebarContent = [
    {
        id: 1,
        content: "DailyTask"
    },
    {
        id: 1,
        content: "Projects"
    },
    {
        id: 3,
        content: "Calendar"
    },
]

export const Sidebar = () => {
    return (
        <div className="h-screen w-[20%] max-w-xl border-r-2 border-border">
            <div className="">
                
            </div>
            <div className="">
                {SidebarContent.map((contents) => (
                    <div className="">
                        {contents.content}
                    </div>
                ))}
            </div>
        </div>
    )
}