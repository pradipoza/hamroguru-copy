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

export const getClasses = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    const data = await teacherService.getClasses(req.user.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teacher classes', error });
  }
};

export const getStudents = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    const classId = typeof req.query.classId === 'string' ? req.query.classId : undefined;
    const data = await teacherService.getStudents(req.user.id, classId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teacher students', error });
  }
};

export const getAssignments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    const data = await teacherService.getAssignments(req.user.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments', error });
  }
};

export const getSubmissions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const data = await teacherService.getSubmissions(req.user.id, status);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions', error });
  }
};

export const getLessonPlans = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    const data = await teacherService.getLessonPlans(req.user.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lesson plans', error });
  }
};

export const getDailyDoses = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    const data = await teacherService.getDailyDoses(req.user.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching daily doses', error });
  }
};

export const getAssessments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    const data = await teacherService.getAssessments(req.user.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assessments', error });
  }
};

export const createAssignment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    
    const { title, description, chapter, classId, subjectId, dueDate } = req.body;
    
    if (!title || !classId || !subjectId || !dueDate) {
      return res.status(400).json({ message: 'Missing required fields: title, classId, subjectId, dueDate' });
    }
    
    const data = await teacherService.createAssignment(req.user.id, {
      title,
      description,
      chapter,
      classId,
      subjectId,
      dueDate: new Date(dueDate),
    });
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ message: 'Error creating assignment', error });
  }
};

export const getQueries = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    const data = await teacherService.getQueries(req.user.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student queries', error });
  }
};
