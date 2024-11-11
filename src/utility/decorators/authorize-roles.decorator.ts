import { SetMetadata } from "@nestjs/common";
import { Roles } from "../common/user-roles.enum";


export const AuthorizeRoles = (...roles: Roles[]) => SetMetadata('allowedRoles', roles);