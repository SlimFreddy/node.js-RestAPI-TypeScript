import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { NextFunction } from "express";
import HttpException from "../models/exceptions/HttpException";

declare global {
  namespace Express {
    export interface Request {
      user: { _id: string; iat: number };
    }
  }
}

export default function verify(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const jwtToken = req.header("jwt-token");
  if (!jwtToken) {
    const error = new HttpException(401, "Acces Denied");
    next(error);
  } else {
    try {
      const verified = jwt.verify(
        jwtToken,
        process.env.JWT_TOKEN_SECRET as string
      );
      req.user = verified as { _id: string; iat: number };
      next();
    } catch (err) {
      const error = new HttpException(400, "Invalid Token");
      next(error);
    }
  }
}
