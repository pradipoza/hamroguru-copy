import { SubjectId } from './types';

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: SubjectId[];
  avatar?: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  grade: number;
  section: string;
  subjectId: SubjectId;
  studentCount: number;
  pendingSubmissions: number;
  averageScore: number;
}

export interface StudentRecord {
  id: string;
  name: string;
  grade: number;
  section: string;
  email: string;
  avatar?: string;
  averageScore: number;
  submissionRate: number;
  lastActive: Date;
}

export interface Submission {
  id: string;
  homeworkId: string;
  homeworkTitle: string;
  studentId: string;
  studentName: string;
  classId: string;
  subjectId: SubjectId;
  submittedAt: Date;
  status: 'pending_review' | 'reviewed' | 'returned';
  grade?: number;
  feedback?: string;
  aiSuggestion?: string;
}

export interface TeacherAssignment {
  id: string;
  title: string;
  description: string;
  chapter: string;
  classId: string;
  className: string;
  subjectId: SubjectId;
  dueDate: Date;
  createdAt: Date;
  totalStudents: number;
  submittedCount: number;
  gradedCount: number;
}

export interface ClassPerformance {
  classId: string;
  className: string;
  averageScore: number;
  submissionRate: number;
  topPerformers: string[];
  needsAttention: string[];
}

export interface StudentQuery {
  id: string;
  studentId: string;
  studentName: string;
  query: string;
  topic: string;
  status: 'pending' | 'addressed' | 'not_addressed';
  askedAt: Date;
  addressedAt?: Date;
  studentFeedback?: 'understood' | 'still_confused' | 'not_addressed';
}

export interface LessonPlan {
  id: string;
  classId: string;
  className: string;
  subjectId: SubjectId;
  date: Date;
  topics: string[];
  studentQueries: StudentQuery[];
  weakAreas: string[];
  recommendedFocus: string;
  dailyDose: DailyDose;
  status: 'upcoming' | 'completed' | 'missed';
  completedAt?: Date;
  feedbackCollected?: boolean;
}

export interface DailyDose {
  id: string;
  title: string;
  description: string;
  content: string;
  topics: string[];
  estimatedTime: number; // in minutes
  source: string;
  completed: boolean;
}

export interface TeacherAssessment {
  id: string;
  title: string;
  subjectId: SubjectId;
  totalQuestions: number;
  duration: number;
  scheduledDate: Date;
  completedAt?: Date;
  score?: number;
  status: 'upcoming' | 'available' | 'completed';
}
