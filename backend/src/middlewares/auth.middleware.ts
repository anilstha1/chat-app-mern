import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import User, {IUser} from "../models/user.model";

declare module "express" {
  interface Request {
    user?: IUser;
  }
}

interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({message: "Not authorized, no token"});
    }

    const token = authHeader.split(" ")[1];
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return res.status(500).json({message: "Server configuration error"});
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res
          .status(401)
          .json({message: "Not authorized, user not found"});
      }

      req.user = user.toObject();
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({message: "Not authorized, token failed"});
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({message: "Internal server error"});
  }
};
