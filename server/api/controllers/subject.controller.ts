import { Request, Response } from 'express';
import * as subjectService from '../services/subject.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { db } from '../../db';
import { studentProfiles } from '../../db/schema';
import { eq } from 'drizzle-orm';

export const getAllSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await subjectService.getAllSubjects();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subjects', error });
  }
};

export const getSubject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const subject = req.user
      ? await subjectService.getSubjectWithTeacherForStudent(req.params.subjectCode, req.user.id)
      : await subjectService.getSubjectByCode(req.params.subjectCode);
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
    
    // Get classId from student's profile
    const [studentProfile] = await db
      .select({ classId: studentProfiles.classId })
      .from(studentProfiles)
      .where(eq(studentProfiles.userId, studentId));

    if (!studentProfile?.classId) {
      return res.json([]); // Return empty array if student has no class assigned
    }

    const subject = await subjectService.getSubjectByCode(req.params.subjectCode);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    const tests = await subjectService.getTestsForSubject(subject.id, studentProfile.classId, studentId);
    res.json(tests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ message: 'Error fetching tests', error: error instanceof Error ? error.message : String(error) });
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
    const subjectCode = req.params.subjectCode;
    const subject = await subjectService.getSubjectByCode(subjectCode);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    const session = await subjectService.getAiTutorSession(subjectCode, studentId);
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
    const studentId = req.user.id;
    const subjectCode = req.params.subjectCode;
    const { message } = req.body;
    
    const subject = await subjectService.getSubjectByCode(subjectCode);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    const updatedSession = await subjectService.addAiTutorMessage(subjectCode, studentId, message);
    res.json(updatedSession);
  } catch (error: any) {
    console.error('Error posting AI tutor message:', error);
    res.status(500).json({ message: 'Error posting message to AI tutor', error: error.message });
  }
};

export const getHomework = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication error' });
    }
    const studentId = req.user.id;
    
    // Get classId from student's profile
    const [studentProfile] = await db
      .select({ classId: studentProfiles.classId })
      .from(studentProfiles)
      .where(eq(studentProfiles.userId, studentId));

    if (!studentProfile?.classId) {
      return res.json([]); // Return empty array if student has no class assigned
    }

    const subject = await subjectService.getSubjectByCode(req.params.subjectCode);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    const homework = await subjectService.getHomeworkForSubject(subject.id, studentProfile.classId, studentId);
    res.json(homework);
  } catch (error) {
    console.error('Error fetching homework:', error);
    res.status(500).json({ message: 'Error fetching homework', error: error instanceof Error ? error.message : String(error) });
  }
};
