import { db } from "@/db";
import { workspaceMemberTable, workspaceTable } from "@/db/schema/workspace.table";
import { Project, ProjectDb, Task, UpdateProject, UpdateTask, UpdateWorkspace, WorkspaceDb, WorkspaceMember, WorkspaceMemberDb, WorkspaceMemberRole } from "./workspace.schema";
import { and, eq, isNull } from "drizzle-orm";
import { cleanData } from "@/utils/clean-data";
import { projectMemberTable, projectTable, taskTable } from "@/db/schema";
import { AppError } from "@/utils/app-error";



export class WorkspaceRepository {
    async findWorkspaceById(id: string) {
        return await db.query.workspaceTable.findFirst({
            where: and(
                eq(workspaceTable.id, id),
                eq(workspaceTable.is_deleted, false),
            ),
            columns: {
                id: true,
                name: true,
                slug: true,
                logo: true,
                created_at: true,
            },
        });
    }

    async findWorkspacesByUserId(user_id: string) {
        return await db.query.workspaceMemberTable.findMany({
            where: eq(workspaceMemberTable.user_id, user_id),
            columns: {
                role: true,
                joined_at: true,
            },
            with: {
                workspace: {
                    where: eq(workspaceTable.is_deleted, false),
                    columns: {
                        id: true,
                        name: true,
                        slug: true,
                        logo: true,
                        created_at: true,
                    },
                },
            },
        });
    }

    async addWorkspace(data: WorkspaceDb) {
        return await db.transaction(async (tx) => {
            const [workspace] = await tx
                .insert(workspaceTable)
                .values(data)
                .returning();
            if (!workspace) {
                throw new AppError("Failed to create workspace");
            }
            await tx.insert(workspaceMemberTable).values({
                user_id: data.created_by,
                workspace_id: workspace.id,
                role: "owner",
            });
            return workspace;
        });
    }

    async updateWorkspace(id: string, data: UpdateWorkspace) {
        const filteredData = cleanData(data);
        const [workspace] = await db
            .update(workspaceTable)
            .set(filteredData)
            .where(eq(workspaceTable.id, id))
            .returning();

        return workspace;
    }

    async deleteWorkspace(id: string) {
        const [workspace] = await db
            .update(workspaceTable)
            .set({ is_deleted: true })
            .where(eq(workspaceTable.id, id))
            .returning();
        return workspace;
    }

    async addWorkspaceMember(data: WorkspaceMemberDb) {
        const [member] = await db
            .insert(workspaceMemberTable)
            .values(data)
            .returning();

        return member;
    }

    async updateWorkspaceMemberRole(
        user_id: string,
        workspace_id: string,
        role: WorkspaceMemberRole,
    ) {
        const [member] = await db
            .update(workspaceMemberTable)
            .set({ role })
            .where(
                and(
                    eq(workspaceMemberTable.user_id, user_id),
                    eq(workspaceMemberTable.workspace_id, workspace_id),
                ),
            )
            .returning();

        return member;
    }

    async deleteWorkspaceMember(user_id: string, workspace_id: string) {
        return await db
            .delete(workspaceMemberTable)
            .where(
                and(
                    eq(workspaceMemberTable.user_id, user_id),
                    eq(workspaceMemberTable.workspace_id, workspace_id),
                ),
            );
    }

    async addProject(data: ProjectDb) {
        return db.transaction(async (tx) => {
            const [project] = await tx.insert(projectTable).values(data).returning();
            if (!project) {
                throw new AppError("Failed to create project");
            }
            await tx.insert(projectMemberTable).values({
                project_id: project.id,
                user_id: data.created_by,
                role: "owner",
            });

            return project;
        });
    }

    async updateProject(data: UpdateProject) {
        const projectData = cleanData(data);
        const [project] = await db
            .update(projectTable)
            .set(projectData)
            .where(eq(projectTable.id, data.id))
            .returning();

        return project;
    }

    async deleteProject(project_id: string) {
        return db
            .update(projectTable)
            .set({ is_deleted: true })
            .where(eq(projectTable.id, project_id))
            .returning();
    }

    async findProjectById(project_id: string) {
        return db.query.projectTable.findFirst({
            where: and(
                eq(projectTable.id, project_id),
                eq(projectTable.is_deleted, false),
            ),
        });
    }

    async findProjectWithoutWorkspaceByUserId(user_id: string) {
        return db.query.projectTable.findMany({
            where: and(
                eq(projectTable.created_by, user_id),
                eq(projectTable.is_deleted, false),
                isNull(projectTable.workspace_id)
            ),
        });
    }

    async findWorkspaceProjectsByUserId(user_id: string, workspace_id: string) {
        return await db.query.projectMemberTable.findMany({
            where: eq(projectMemberTable.user_id, user_id),

            with: {
                project: {
                    where: and(
                        eq(projectTable.workspace_id, workspace_id),
                        eq(projectTable.is_deleted, false),
                    ),
                },
            },
        });
    }

    async findWorkspaceMembers(workspace_id: string) {
        return await db.query.workspaceMemberTable.findMany({
            where: eq(workspaceMemberTable.workspace_id, workspace_id)
        })
    }

    async addTask(data: Task) {
        const [task] = await db.insert(taskTable).values(data).returning();

        return task;
    }

    async updateTask(data: UpdateTask) {
        const [task] = await db.update(taskTable).set(data).returning();

        return task;
    }

    async deleteTask(task_id: string) {
        return await db.update(taskTable).set({ is_deleted: true }).where(eq(taskTable.id, task_id)).returning();
    }

    // async findTaskByProjectId(project_id: string) {
    //     return await db.query.projectTable.findMany({
    //         with: {
    //             task: 
    //         }
    //     })
    // }
}