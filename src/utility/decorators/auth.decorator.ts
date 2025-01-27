import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from '../common/user-roles.enum';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { AuthorizeGuard } from '../guards/authorization.guard';
import { AuthorizeRoles } from './authorize-roles.decorator';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    AuthorizeRoles(...roles),
    UseGuards(AuthenticationGuard, AuthorizeGuard),
  );
}
