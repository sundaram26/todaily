import { Router } from "express";
import { handleOAuthCallback, redirectToProvider } from "./oauth.controller";

const oauthRoute:Router = Router();

oauthRoute.get("/redirect/:provider", redirectToProvider);
oauthRoute.post("/callback/:provider", handleOAuthCallback);

export default oauthRoute;