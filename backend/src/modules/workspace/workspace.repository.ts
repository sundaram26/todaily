import { db } from "@/db";
import { workspaceMemberTable, workspaceTable } from "@/db/schema/workspace.table";
import { CustomField, Project, ProjectDb, Task, UpdateCustomField, UpdateProject, UpdateTask, UpdateWorkspace, WorkspaceDb, WorkspaceMember, WorkspaceMemberDb, WorkspaceMemberRole } from "./workspace.schema";
import { and, asc, desc, eq, isNull } from "drizzle-orm";
import { cleanData } from "@/utils/clean-data";
import { customFieldTable, projectMemberTable, projectTable, taskLabelTable, taskTable } from "@/db/schema";
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
            const whereClause = data.workspace_id
                ? eq(projectTable.workspace_id, data.workspace_id)
                : and(
                    isNull(projectTable.workspace_id),
                    eq(projectTable.created_by, data.created_by)
                )
            const projects = await tx.query.projectTable.findMany({
                where: whereClause,
                columns: {
                    position: true
                },
                orderBy: [desc(projectTable.position)],
                limit: 1
            })
            if(!projects) throw new AppError("Failed to find the position!")
            const nextPosition = projects[0] ? projects[0].position + 1 : 0;
            const [project] = await tx.insert(projectTable).values({ ...data, position: nextPosition }).returning({
                id: projectTable.id,
                title: projectTable.title
            });
            if (!project) {
                throw new AppError("Failed to create project!");
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
            .returning({
                id: projectTable.id,
                title: projectTable.title
            });

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
            columns: {
                id: true,
                title: true,
                description: true,
                created_by: true,
                workspace_id: true,
                created_at: true,
            }
        });
    }

    async findProjectWithoutWorkspaceByUserId(user_id: string) {
        return db.query.projectMemberTable.findMany({
            where: eq(projectMemberTable.user_id, user_id),
            with: {
                project: {
                    where: and(
                        eq(projectTable.created_by, user_id),
                        eq(projectTable.is_deleted, false),
                        isNull(projectTable.workspace_id),
                    ),
                    columns: {
                        id: true,
                        title: true,
                        description: true,
                        created_by: true,
                        workspace_id: true,
                        created_at: true,
                    },
                    orderBy: asc(projectTable.position)
                },
            },
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

    async updateTask(task_id: string, data: UpdateTask) {
        const [task] = await db.update(taskTable).set(data).where(eq(taskTable.id, task_id)).returning();

        return task;
    }

    async deleteTask(task_id: string) {
        return await db.update(taskTable).set({ is_deleted: true }).where(eq(taskTable.id, task_id)).returning();
    }

    async findTaskByProjectId(project_id: string) {
        return await db.query.taskTable.findMany({
            where: and(
                eq(taskTable.project_id, project_id),
                eq(taskTable.is_deleted, false)
            )
        })
    }

    async findTaskById(task_id: string) {
        return await db.query.taskTable.findFirst({
            where: and(
                eq(taskTable.id, task_id),
                eq(taskTable.is_deleted, false)
            )
        })
    }

    async addCustomField(data: CustomField) {
        const [field] = await db.insert(customFieldTable).values(data).returning({
            id: customFieldTable.id,
            project_id: customFieldTable.project_id,
            title: customFieldTable.title,
            color: customFieldTable.color,
            type: customFieldTable.type,
            position: customFieldTable.position
        });
        return field;
    }

    async updateCustomField(field_id: string, data: UpdateCustomField) {
        const filteredData = cleanData(data);
        const [field] = await db
            .update(customFieldTable)
            .set(filteredData)
            .where(eq(customFieldTable.id, field_id))
            .returning({
                id: customFieldTable.id,
                project_id: customFieldTable.project_id,
                title: customFieldTable.title,
                color: customFieldTable.color,
                type: customFieldTable.type,
                position: customFieldTable.position,
            });
        return field;
    }

    async deleteCustomField(field_id: string) {
        return await db.delete(customFieldTable).where(eq(customFieldTable.id, field_id));
    }

    async findCustomFieldByProjectId(project_id: string, type?: "status" | "priority" | "label") {
        return await db.query.customFieldTable.findMany({
            where: and(
                eq(customFieldTable.project_id, project_id),
                type ? eq(customFieldTable.type, type) : undefined
            ),
            orderBy: asc(customFieldTable.position)
        })
    }

    async addTaskLabel(task_id: string, field_id: string) {
        const [label] = await db.insert(taskLabelTable).values({ task_id, field_id }).returning()
        return label;
    }

    async removeTaskLabel(task_id: string, field_id: string) {
        return await db.delete(taskLabelTable).where(
            and(
                eq(taskLabelTable.task_id, task_id),
                eq(taskLabelTable.field_id, field_id)
            )
        )
    }

    async findTaskLabels(task_id: string) {
        return await db.query.taskLabelTable.findMany({
            where: eq(taskLabelTable.task_id, task_id),
            with: {
                field: true
            }
        })
    }

    async updateStatus(task_id: string, field_id: string) {
        const [task] = await db.update(taskTable).set({ status_id: field_id }).where(eq(taskTable.id, task_id)).returning({
            task_id: taskTable.id,
            status_id: taskTable.status_id
        });

        return task
    }

    async updatePriority(task_id: string, field_id: string) {
        const [task] = await db.update(taskTable).set({ status_id: field_id }).where(eq(taskTable.id, task_id)).returning({
            task_id: taskTable.id,
            priority_id: taskTable.priority_id
        });

        return task
    }
}