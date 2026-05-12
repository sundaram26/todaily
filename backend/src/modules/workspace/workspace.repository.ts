import { db } from "@/db";
import { workspaceTable } from "@/db/schema/workspace.table";
import { UpdateWorkspace, WorkspaceDb } from "./workspace.schema";
import { and, eq } from "drizzle-orm";
import { cleanData } from "@/utils/clean-data";



export class workspaceRepository {
    async addWorkspace(data: WorkspaceDb) {
        const [workspace] = await db.insert(workspaceTable).values(data).returning();

        return workspace;
    }

    async updateWorkspace(id: string, data: UpdateWorkspace) {
        const filteredData = cleanData(data);
        const [workspace] = await db.update(workspaceTable).set(filteredData).where(eq(workspaceTable.id, id)).returning();

        return workspace
    }

    async findWorkspaceById(id: string) {
        return await db.query.workspaceTable.findFirst({
            where: and(
                eq(workspaceTable.id, id),
                eq(workspaceTable.is_deleted, false),
            ),
        });
    }

    async deleteWorkspace(id: string) {
        const [workspace] = await db.update(workspaceTable).set({ is_deleted: true }).where(eq(workspaceTable.id, id)).returning();
        return workspace;
    }
}