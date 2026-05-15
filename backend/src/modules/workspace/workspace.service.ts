import { AppError, NotFoundError, UnauthorizedError } from "@/utils/app-error";
import { WorkspaceRepository } from "./workspace.repository";
import { ProjectDb, UpdateProject, WorkspaceDb } from "./workspace.schema";



export class WorkspaceService {
    constructor(private workspaceRepo: WorkspaceRepository) { }
    
    // async createWorkspace(data: WorkspaceDb) {
    //     // todo: subscription check
        
    // }

    async createProject(data: ProjectDb) {
        const project = await this.workspaceRepo.addProject(data);

        if (!project) {
            throw new AppError("Unable to create the project!");
        }

        return project;
    }
    
    async updateProject(user_id: string, data: UpdateProject) {
        const existingProject = await this.workspaceRepo.findProjectById(data.id);

        if (!existingProject) {
            throw new NotFoundError("project not found!");
        }

        if (existingProject.created_by !== user_id) {
          throw new UnauthorizedError("Not allowed");
        }
        const project = await this.workspaceRepo.updateProject(data);

        if (!project) {
            throw new AppError("Unable to update the project!")
        }

        return project;
    }

    async findProjectById(project_id: string) {
        const project = await this.workspaceRepo.findProjectById(project_id);

        if (!project) {
            throw new NotFoundError("Project not found!");
        }

        return project;
    }

    async findUserProjectsWithoutWorkspace(user_id: string) {
        const project = await this.workspaceRepo.findProjectWithoutWorkspaceByUserId(user_id);

        if (project.length === 0) {
            throw new NotFoundError("Projects not found!");
        }

        return project;
    }
}

