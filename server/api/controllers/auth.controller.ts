import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const signup = async (req: Request, res: Response) => {
  try {
    const { user, profile, role, token } = await authService.signup(req.body);
    res.status(201).json({ user, profile, role, token });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error signing up';
    const status = message.toLowerCase().includes('subject') ? 400 : 500;
    res.status(status).json({ message, error });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { user, profile, role, token } = await authService.signin(req.body);
    res.json({ user, profile, role, token });
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials', error });
  }
};
