import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { NextFunction } from "express";

declare global {
  namespace Express {
    export interface Request {
      user: { _id: string, iat: number}
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
    return res.status(401).send("Acces Denied");
  }

  try {
    const verified = jwt.verify(
      jwtToken,
      process.env.JWT_TOKEN_SECRET as string
    );

    req.user = verified as { _id: string, iat: number};
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
}
