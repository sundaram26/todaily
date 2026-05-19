import { isAuthenticated } from "@/middlewares/authorize.middleware";
import { Router } from "express";
import { createCustomField, createProject, getCustomFieldByProjectId, getProjectById, getProjectWithoutWorkspace, reorderProjects, updateCustomField, updateProject } from "./workspace.controller";
import { validateSchema } from "@/middlewares/validate-schema.middleware";
import { CustomFieldSchema, ProjectSchema, ReorderProjectsSchema, UpdateCustomFieldSchema, UpdateProjectSchema } from "./workspace.schema";

const workspaceRoute:Router = Router();

workspaceRoute.post("/project", isAuthenticated, validateSchema(ProjectSchema), createProject);
workspaceRoute.put("/project", isAuthenticated, validateSchema(UpdateProjectSchema), updateProject);
workspaceRoute.get("/project/:project_id", isAuthenticated, getProjectById);
workspaceRoute.get("/projects", isAuthenticated, getProjectWithoutWorkspace);
workspaceRoute.put("/projects/reorder", isAuthenticated, validateSchema(ReorderProjectsSchema), reorderProjects);

workspaceRoute.post("/custom-field", isAuthenticated, validateSchema(CustomFieldSchema), createCustomField);
workspaceRoute.put("/custom-field", isAuthenticated, validateSchema(UpdateCustomFieldSchema), updateCustomField);
workspaceRoute.get("/custom-field/:project_id", isAuthenticated, getCustomFieldByProjectId);

export default workspaceRoute;