import 'express-session';
import { JwtToken } from '@/modules/auth/auth.util';

declare module 'express-session' {
    interface SessionData {
        oauthState?: string;
    }
}

declare module 'express' {
    interface Request {
        user?: JwtToken;
    }
}
