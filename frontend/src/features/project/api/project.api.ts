import api from "@/lib/axios";
import { CreateProjectType, UpdateProjectType } from "../types";



export const createProject = async (data: CreateProjectType) => {
    const res = await api.post("/workspace/project", data, {
        withCredentials: true
    })

    return res.data;
}


export const updateProject = async (data: UpdateProjectType) => {
    const res = await api.put("/workspace/project", data, {
        withCredentials: true
    })

    return res.data;
}

export const getProjectsWithoutWorkspace = async () => {
    const res = await api.get("/workspace/projects", {
        withCredentials: true
    })

    return res.data;
}

export const getProjectsById = async (project_id: string) => {
    const res = await api.get(`/workspace/project/${project_id}`, {
        withCredentials: true
    })

    return res.data;
}