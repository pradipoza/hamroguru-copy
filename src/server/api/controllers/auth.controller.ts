import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const signup = async (req: Request, res: Response) => {
  try {
    const { user, token } = await authService.signup(req.body);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up', error });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { user, token } = await authService.signin(req.body);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials', error });
  }
};
