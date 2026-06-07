import { AppError, NotFoundError, UnauthorizedError } from "@/utils/app-error";
import { WorkspaceRepository } from "./workspace.repository";
import { CustomField, ProjectDb, ReorderProjects, UpdateCustomField, UpdateProject, ViewTypeEnumType, WorkspaceDb } from "./workspace.schema";



export class WorkspaceService {
    constructor(private workspaceRepo: WorkspaceRepository) { }
    
    // async createWorkspace(data: WorkspaceDb) {
    //     // todo: subscription check
        
    // }

    async createProject(data: ProjectDb) {
        const { customFields, ...projectData } = data as any;
        const project = await this.workspaceRepo.addProject(projectData);

        if (!project) {
            throw new AppError("Unable to create the project!");
        }

        if (
          customFields &&
          Array.isArray(customFields) &&
          customFields.length > 0
        ) {
          for (const field of customFields) {
            await this.workspaceRepo.addCustomField({
              ...field,
              project_id: project.id, // Use the new project's ID
            });
          }
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

    async reorderProjects(user_id: string, data: ReorderProjects) {
        for (const project of data.projects) {
            const existingProject = await this.workspaceRepo.findProjectById(project.id);
            if (!existingProject) {
                throw new NotFoundError(`Project ${project.id} not found`)
            }
            if (existingProject.created_by !== user_id) {
                throw new UnauthorizedError("Not allowed to modify this project")
            }
        }

        await this.workspaceRepo.updateProjectPosition(data);

        return {
            message: "Successfully reordered projects"
        };
    }

    async addCustomField(data: CustomField & {project_id: string}) {
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

    async findTaskLabelsByViewType(project_id: string, view_type: ViewTypeEnumType="table") {
        const labels = await this.workspaceRepo.findViewColumns(project_id, view_type)

        if (!labels) {
            throw new NotFoundError("Columns not found!");
        }

        return labels;
    }
}

