import api from "@/lib/axios";
import { CreateProjectType, CustomFieldType, ReorderProjectType, UpdateCustomFieldType, UpdateProjectType, ViewTypeEnumType } from "../types";

export const createProject = async (data: CreateProjectType) => {
  const res = await api.post("/workspace/project", data, {
    withCredentials: true,
  });

  return res.data;
};

export const updateProject = async (data: UpdateProjectType) => {
  const res = await api.put("/workspace/project", data, {
    withCredentials: true,
  });

  return res.data;
};

export const getProjectsWithoutWorkspace = async () => {
  const res = await api.get("/workspace/projects", {
    withCredentials: true,
  });

  return res.data;
};

export const getProjectsById = async (project_id: string) => {
  const res = await api.get(`/workspace/project/${project_id}`, {
    withCredentials: true,
  });

  return res.data;
};

export const reorderProject = async (data: ReorderProjectType) => {
  const res = await api.put("/workspace/projects/reorder", data, {
    withCredentials: true
  })

  return res.data;
}

export const createCustomField = async (data: CustomFieldType) => {
  const res = await api.post("/workspace/custom-field", data);
  return res.data.data;
};

export const updateCustomField = async (data: UpdateCustomFieldType) => {
  const res = await api.put("/workspace/custom-field", data);
  return res.data.data;
};

export const getCustomFieldsByProjectId = async (project_id: string) => {
  const res = await api.get(`/workspace/custom-field/${project_id}`);
  return res.data.data;
};

// Task Api's
export const getTaskLabelsByViewTyps = async ({ project_id, view_type }: {
  project_id: string,
  view_type: ViewTypeEnumType
}) => {
  const res = await api.get("/workspace/task/labels",
    {
      params: {
        project_id,
        view_type
      },
      withCredentials: true
    },
  )

  return res.data;
}