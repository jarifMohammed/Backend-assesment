import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import redisClient from "../utils/redisClient";
import { ERROR_MESSAGES } from "../constants/messages";

// Access token secret
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Extract token from the authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    // If no token is provided, return an error
    res.status(401).json({ error: ERROR_MESSAGES.INVALID_CREDENTIALS });
    return;
  }

  try {
    // Check if the token is blacklisted in Redis
    const isBlacklisted = await redisClient.get(token);
    if (isBlacklisted) {
      res.status(403).json({ error: ERROR_MESSAGES.INVALID_CREDENTIALS });
      return;
    }

    // Verify the token's validity
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as { id: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: ERROR_MESSAGES.INVALID_CREDENTIALS });
    return;
  }
};
