
type AppErrorOptions = {
    status?: number;
    code?: string;
    details?: unknown;
}

export class AppError extends Error {
    status: number;
    code: string;
    details: unknown;

    constructor(
        message: string,
        options: AppErrorOptions = {}
    ) {
        super(message);

        const {
            status = 500,
            code = "INTERNAL_ERROR",
            details = null,
        } = options;

        this.name = this.constructor.name;
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

export class BadRequestError extends AppError {
    constructor(
        message = "Invalid Request",
        details?: unknown
    ) {
        super(message, {
            status: 400,
            code: "BAD_REQUEST",
            details,
        })        
    }
}

export class UnauthorizedError extends AppError {
    constructor(
        message = "Invalid Credentials",
        details?: unknown
    ) {
        super(message, {
            status: 401,
            code: "UNAUTHORIZED",
            details,
        })        
    }
}

export class ForbiddenError extends AppError {
    constructor(
        message = "Access Denied",
        details?: unknown
    ) {
        super(message, {
            status: 403,
            code: "FORBIDDEN",
            details,
        })        
    }
}

export class NotFoundError extends AppError {
    constructor(
        message = "Resource Not Found",
        details?: unknown
    ) {
        super(message, {
            status: 404,
            code: "NOT_FOUND",
            details,
        })        
    }
}
