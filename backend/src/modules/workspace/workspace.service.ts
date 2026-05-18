import { AppError, NotFoundError, UnauthorizedError } from "@/utils/app-error";
import { WorkspaceRepository } from "./workspace.repository";
import { CustomField, ProjectDb, UpdateCustomField, UpdateProject, WorkspaceDb } from "./workspace.schema";



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

        return project;
    }

    async addCustomField(data: CustomField) {
        const field = await this.workspaceRepo.addCustomField(data);

        if (!field) {
            throw new AppError("unable to create new field!");
        }

        return field;
    }

    async updateCustomField(data: UpdateCustomField) {
        const field = await this.workspaceRepo.updateCustomField(data);

        if (!field) {
            throw new AppError("unable to update the field!");
        }

        return field;
    }

    async findCustomFieldByProjectId(project_id: string) {
        const field = await this.workspaceRepo.findCustomFieldByProjectId(project_id);

        if (!field) {
            throw new NotFoundError("Fields not found for project!");
        }

        return field;
    }
}

