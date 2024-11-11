import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import * as request from 'supertest';


@Injectable()
export class AuthorizeGuard implements CanActivate {

    constructor(private readonly reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean {
        const allowedRoles = this.reflector.get<string[]>('allowedRoles', context.getHandler());
        const request=context.switchToHttp().getRequest();
        const result = request?.currentUser?.roles.map((role:string)=>allowedRoles.includes(role)).find((val:boolean)=>val===true);
        if (result) return true;
        throw new UnauthorizedException('Lo siento, no estas autorizado!');
    }
}