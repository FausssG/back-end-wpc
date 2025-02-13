import { Injectable, NestMiddleware} from "@nestjs/common";
import { isArray } from "class-validator";
import { NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { Request, Response } from "express";
import { UserEntity } from "src/users/entities/user.entity";
import { ValidatorService } from "src/auth/validator.service";

declare global {
    namespace Express {
      interface Request {
        currentUser?: UserEntity;
      }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly validatorService:ValidatorService){}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
  
    if (!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
      req.currentUser = null;
      next();
      return;
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const { payload } = <JwtPayload>verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
      
      const currentUser = await this.validatorService.validateUserExistsById(payload.id);

      req.currentUser = currentUser;
      next();
    } catch (error) {
      req.currentUser = null;
      next();
    }
  }
}

interface JwtPayload {
  payload: {
    id: string,
    email: string,
    roleId: number,
    active: boolean
  },
  iat: number,
  exp: number
}

