import { asyncHandler } from "@/utils/async-handler";
import { Request, Response } from "express";
import { WorkspaceService } from "./workspace.service";
import { WorkspaceRepository } from "./workspace.repository";
import { ApiResponse } from "@/utils/api-response";
import { AppError, UnauthorizedError } from "@/utils/app-error";


const workspaceService = new WorkspaceService(new WorkspaceRepository());

export const createProject = asyncHandler(async (req: Request, res: Response) => {
    const created_by = req.user?.user_id;
    const data = req.body;
    const projectData = {
        ...data,
        created_by
    }

    const project = await workspaceService.createProject(projectData);

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
    const { project_id }= req.params;
    
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