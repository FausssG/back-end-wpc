import { SetMetadata } from "@nestjs/common";
import { Role } from "../common/user-roles.enum";


export const AuthorizeRoles = (...roles: Role[]) => SetMetadata('allowedRoles', roles);