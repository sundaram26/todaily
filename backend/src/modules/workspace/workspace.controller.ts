import { asyncHandler } from "@/utils/async-handler";
import { Request, Response } from "express";
import { WorkspaceService } from "./workspace.service";
import { WorkspaceRepository } from "./workspace.repository";
import { ApiResponse } from "@/utils/api-response";
import { AppError, BadRequestError, UnauthorizedError } from "@/utils/app-error";
import { ViewTypeEnumType } from "./workspace.schema";


const workspaceService = new WorkspaceService(new WorkspaceRepository());

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const created_by = req.user?.user_id;
  const data = req.body;
  const { customFields, ...projectData } = data;
  const projectDataWithUser = {
    ...projectData,
    created_by
  }

  const project = await workspaceService.createProject({ ...projectDataWithUser, customFields });

  res.status(201).json(
    new ApiResponse({
      status: 201,
      message: "successfully created project",
      data: project,
    }),
  );
})

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const user_id = req.user?.user_id;
  if (!user_id) {
    throw new UnauthorizedError("user not found!");
  }
  const project = await workspaceService.updateProject(user_id, req.body);

  res.status(200).json(
    new ApiResponse({
      status: 200,
      message: "successfully updated project",
      data: project,
    }),
  );
})

export const getProjectById = asyncHandler(async (req: Request, res: Response) => {
  const { project_id } = req.params;

  if (!project_id || (typeof project_id !== "string")) throw new AppError("Project id is required!");

  const project = await workspaceService.findProjectById(project_id);

  res.status(200).json(
    new ApiResponse({
      status: 200,
      message: "successfully fetched project details",
      data: project,
    }),
  );
})

export const getProjectWithoutWorkspace = asyncHandler(async (req: Request, res: Response) => {
  const user_id = req.user?.user_id;
  if (!user_id) throw new UnauthorizedError("user not found");
  const projects = await workspaceService.findUserProjectsWithoutWorkspace(user_id);

  res.status(200).json(
    new ApiResponse({
      status: 200,
      message: "successfully fetched all projects",
      data: projects
    })
  )
})

export const reorderProjects = asyncHandler(async (req: Request, res: Response) => {
  const user_id = req.user?.user_id;
  if (!user_id) throw new UnauthorizedError("user not found!");

  const result = await workspaceService.reorderProjects(user_id, req.body);

  return res.json(
    new ApiResponse({
      status: 200,
      message: result.message
    })
  )
})

export const createCustomField = asyncHandler(async (req: Request, res: Response) => {
  const field = await workspaceService.addCustomField(req.body);
  return res.json(
    new ApiResponse({
      status: 201,
      message: "successfully created new field",
      data: field
    })
  )
})

export const updateCustomField = asyncHandler(async (req: Request, res: Response) => {
  const field = await workspaceService.updateCustomField(req.body);
  return res.json(
    new ApiResponse({
      status: 200,
      message: "successfully created new field",
      data: field
    })
  )
})

export const getCustomFieldByProjectId = asyncHandler(async (req: Request, res: Response) => {
  const { project_id } = req.params;
  if (!project_id || !(typeof project_id === "string")) {
    throw new BadRequestError("Invalid project Id!");
  }

  const field = await workspaceService.findCustomFieldByProjectId(project_id);

  return res.json(
    new ApiResponse({
      status: 200,
      message: "successfully fetched all project fields",
      data: field
    })
  )
})

export const getTaskLabelsByViewTypes = asyncHandler(async (req: Request, res: Response) => {
  const { project_id, view_type } = req.params;

  if (!project_id || (typeof project_id !== "string") || !view_type || (!["table", "gallery", "kanban"].includes(view_type as ViewTypeEnumType))) {
    throw new BadRequestError("Invalid request!")
  }

  const labels = await workspaceService.findTaskLabelsByViewType(project_id, view_type as ViewTypeEnumType);

  if (!labels) {
    throw new AppError("unable to fetch the task labels!")
  }

  return res.json(
    new ApiResponse({
      status: 200,
      message: "successfully fetched the task labels",
      data: labels
    })
  )
})

// export const getViewColumnsByViewType = asyncHandler(async (req: Request, res: Response) => {
//   const { project_id, view_type } = req.query as {
//     project_id: string,
//     view_type: ViewTypeEnumType
//   }

//   const columns = await workspaceService.get
// })