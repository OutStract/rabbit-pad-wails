export interface Payload {
    id: string;
    success: boolean;
    action: string;
    error: unknown;
    message: string;
    data: any;
}