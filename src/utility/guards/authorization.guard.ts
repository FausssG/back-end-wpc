import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../common/user-roles.enum';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.get<string[]>(
      'allowedRoles',
      context.getHandler(),
    );
    const { currentUser } = context.switchToHttp().getRequest();

    if (currentUser.role === Role.ADMIN) return true;

    const result = allowedRoles.includes(currentUser.role);

    if (result) return true;

    throw new UnauthorizedException('Lo siento, no estas autorizado!');
  }
}
