import { useQuery } from "@tanstack/react-query"
import { getTaskLabelsByViewTyps } from "../api/project.api"
import { ViewTypeEnumType } from "../types"



export const useTaskLabelByViewType = ({ project_id, view_type }: {
    project_id: string,
    view_type: ViewTypeEnumType
}) => {
    return useQuery({
        queryKey: ["labels", project_id, view_type],
        queryFn: () => getTaskLabelsByViewTyps({ project_id, view_type })
    })
}