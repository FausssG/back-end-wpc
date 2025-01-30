export interface JwtPayload {
    id: string;
    email: string;
    roleId: number;
    active: boolean;
}