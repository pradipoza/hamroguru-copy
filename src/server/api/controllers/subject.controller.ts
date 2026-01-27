import { Request, Response } from 'express';
import * as subjectService from '../services/subject.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getSubject = async (req: Request, res: Response) => {
  try {
    const subject = await subjectService.getSubjectByCode(req.params.subjectCode);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subject data', error });
  }
};

export const getNotes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    const studentId = req.user.id;
    const subject = await subjectService.getSubjectByCode(req.params.subjectCode);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    const notes = await subjectService.getNotesForSubject(subject.id, studentId);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error });
  }
};

export const getTests = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    const studentId = req.user.id;
    // TODO: Get classId from student's profile
    const classId = 'mock-class-id'; // Placeholder
    const subject = await subjectService.getSubjectByCode(req.params.subjectCode);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    const tests = await subjectService.getTestsForSubject(subject.id, classId, studentId);
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tests', error });
  }
};

export const getResources = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const subject = await subjectService.getSubjectByCode(req.params.subjectCode);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    const resources = await subjectService.getResourcesForSubject(subject.id);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resources', error });
  }
};

export const getAiTutorSession = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    const studentId = req.user.id;
    const subject = await subjectService.getSubjectByCode(req.params.subjectCode);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    const session = await subjectService.getAiTutorSession(subject.id, studentId);
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching AI tutor session', error });
  }
};

export const postAiTutorMessage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    const { sessionId, message } = req.body;
    const updatedSession = await subjectService.addAiTutorMessage(sessionId, message);
    res.json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: 'Error posting message to AI tutor', error });
  }
};

export const getHomework = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    const studentId = req.user.id;
    // TODO: Get classId from student's profile
    const classId = 'mock-class-id'; // Placeholder
    const subject = await subjectService.getSubjectByCode(req.params.subjectCode);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    const homework = await subjectService.getHomeworkForSubject(subject.id, classId, studentId);
    res.json(homework);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching homework', error });
  }
};
