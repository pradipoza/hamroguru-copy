import { Response } from 'express';
import * as teacherService from '../services/teacher.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    const userId = req.user.id;
    const data = await teacherService.getProfileData(userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teacher profile data', error });
  }
};
