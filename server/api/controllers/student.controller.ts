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

export const getHomeworkBySubject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    const userId = req.user.id;
    const { subjectCode } = req.params;
    
    if (!subjectCode) {
      return res.status(400).json({ message: 'Subject code is required' });
    }
    
    const data = await studentService.getHomeworkBySubject(userId, subjectCode);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching homework', error });
  }
};

export const getPersonalizedAssignment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    const userId = req.user.id;
    const { assignmentId } = req.params;
    
    if (!assignmentId) {
      return res.status(400).json({ message: 'Assignment ID is required' });
    }
    
    const data = await studentService.getPersonalizedAssignment(userId, assignmentId);
    
    if (!data) {
      return res.status(404).json({ message: 'Personalized assignment not found' });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching personalized assignment', error });
  }
};

export const submitHomework = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    const userId = req.user.id;
    const { assignmentId } = req.params;
    const { images } = req.body;
    
    if (!assignmentId || !images || !Array.isArray(images)) {
      return res.status(400).json({ message: 'Assignment ID and images array are required' });
    }
    
    const data = await studentService.submitHomework(userId, assignmentId, images);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting homework', error });
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

export const getProfileDetails = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    const data = await studentService.getProfileDetails(req.user.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile details', error });
  }
};

export const getProgress = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    const data = await studentService.getProgressSummary(req.user.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress data', error });
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
