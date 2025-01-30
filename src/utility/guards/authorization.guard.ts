import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from 'src/roles/dto/role.dto';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { currentUser } = context.switchToHttp().getRequest();

    const routePermissions = this.reflector.get<Permission[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );
    
    if (!routePermissions) return true;

    const userPermissions = currentUser.role.permissions;
    for (const permission of routePermissions) {
      const userPermission = userPermissions.find(
        (perm) => perm.resource === permission.resource,
      );

      if (!userPermission) throw new UnauthorizedException();

      const allActionsAvailable = permission.actions.every((requiredAction) =>
        userPermission.actions.includes(requiredAction),
      );

      if (!allActionsAvailable) throw new UnauthorizedException();
    }
    
    return true;
  }
}
