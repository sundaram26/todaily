import { Router } from "express";
import { createSmtpConfig, deleteSmtpConfig, getAllSmtpConfig, updateSmtpConfig } from "./system-config.controller";

const sysConfigRoute: Router = Router();

sysConfigRoute.post("/smtp", createSmtpConfig);
sysConfigRoute.patch("/smtp/:id", updateSmtpConfig);
sysConfigRoute.get("/smtp", getAllSmtpConfig);
sysConfigRoute.delete("/smtp/:id", deleteSmtpConfig);

export default sysConfigRoute; 