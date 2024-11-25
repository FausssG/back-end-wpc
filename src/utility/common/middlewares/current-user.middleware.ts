import { Injectable, NestMiddleware} from "@nestjs/common";
import { isArray } from "class-validator";
import { NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { Request, Response } from "express";
import { UsersService } from '../../../users/users.service';
import { UserEntity } from "src/users/entities/user.entity";

declare global {
    namespace Express {
      interface Request {
        currentUser?: UserEntity;
      }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly UsersService:UsersService){}

  async use(req: Request, res: Response, next: NextFunction) {

    const authHeader=req.headers.authorization || req.headers.Authorization;

    if (!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
      req.currentUser=null;
      next();
      return;
    } else {
      try {
        const token = authHeader.split(' ')[1];
        const {id} = <JwtPayload>verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
        const currentUser = await this.UsersService.findOne(+id);
        req.currentUser = currentUser;
        next();
      } catch (error) {
        req.currentUser = null;
        next();
      }
    }
  }
}

interface JwtPayload {
  id: string;
}

