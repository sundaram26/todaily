import { isAuthenticated } from "@/middlewares/authorize.middleware";
import { Router } from "express";
import { createProject, getProjectById, getProjectWithoutWorkspace, updateProject } from "./workspace.controller";

const workspaceRoute:Router = Router();

workspaceRoute.post("/project", isAuthenticated, createProject);
workspaceRoute.put("/project", isAuthenticated, updateProject);
workspaceRoute.get("/project/:project_id", isAuthenticated, getProjectById);
workspaceRoute.get("/projects", isAuthenticated, getProjectWithoutWorkspace);

export default workspaceRoute;