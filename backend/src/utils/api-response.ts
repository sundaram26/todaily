
type ApiResponseOptions = {
    status: number;
    message: string;
    data?: any;
};

export class ApiResponse {
    status: number;
    message: string;
    data?: unknown;

    constructor({ status, message, data = null }: ApiResponseOptions) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}
