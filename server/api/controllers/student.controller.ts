import { Response } from 'express';
import * as studentService from '../services/student.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getDashboard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    const userId = req.user.id;
    const data = await studentService.getDashboardData(userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error });
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    const userId = req.user.id;
    const data = await studentService.getStudentProfile(userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

export const getPendingTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    const userId = req.user.id;
    const data = await studentService.getPendingTasks(userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending tasks', error });
  }
};
