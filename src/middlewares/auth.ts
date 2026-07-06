import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";
import { UserRole, UserStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";


declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

const auth = (...requiredRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError(401, "You are not authorized! Please login.");
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        throw new AppError(401, "You are not authorized! Please login.");
      }

      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload & {
        id: string;
        email: string;
        role: UserRole;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        throw new AppError(404, "User not found.");
      }

      if (user.status === UserStatus.BANNED) {
        throw new AppError(
          403,
          "Your account has been banned. Contact admin for support."
        );
      }

      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        throw new AppError(
          403,
          "You are not authorized to access this resource."
        );
      }

      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        next(new AppError(401, "Invalid token. Please login again."));
      } else if (error instanceof jwt.TokenExpiredError) {
        next(new AppError(401, "Token has expired. Please login again."));
      } else {
        next(error);
      }
    }
  };
};

export default auth;