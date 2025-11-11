/* eslint-disable @typescript-eslint/no-explicit-any */
export default class ServiceResult {
    success: number;
    message: string;
    data: any;

    constructor(success: number, message: string, data: any) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
}
