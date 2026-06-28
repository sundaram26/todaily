import { useTaskLabelByViewType } from "../hooks/use-task-labels";



export const ActiveTab = ({ activeTabId }: {
  activeTabId: string
}) => {

  // const { labels } = useTaskLabelByViewType()

    return (
      <div className="scrollbar-track-background scrollbar-thumb-foreground-muted/40 overflow-auto">
        This is active tab: {activeTabId}
        {/* <div className="h-[5000px] w-[50000px]">dfj;as</div> */}
      </div>
    );
}