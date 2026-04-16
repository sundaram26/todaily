import { AuthRepository } from "../auth/auth.repository";
import { OAuthService } from "./oauth.service";


const oauthService = new OAuthService(new AuthRepository);