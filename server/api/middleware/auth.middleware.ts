import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role?: string };
}

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'A token is required for authentication' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_default_secret');
    req.user = decoded as { id: string; role?: string };
  } catch (err) {
    return res.status(401).json({ message: 'Invalid Token' });
  }

  return next();
};
