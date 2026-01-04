export type SubjectId = 'math' | 'science' | 'english' | 'nepali' | 'social' | 'computer';

export interface Subject {
  id: SubjectId;
  name: string;
  nameNepali: string;
  teacher: string;
  icon: string;
  color: SubjectId;
  pendingHomework: number;
  pendingNotes: number;
  upcomingTests: number;
}

export interface Student {
  id: string;
  name: string;
  grade: number;
  section: string;
  school: string;
  avatar?: string;
  streakDays: number;
  totalPoints: number;
}

export interface Homework {
  id: string;
  subjectId: SubjectId;
  title: string;
  description: string;
  chapter: string;
  dueDate: Date;
  assignedDate: Date;
  status: 'pending' | 'submitted' | 'checked' | 'reviewed';
  grade?: number;
  feedback?: string;
  submittedAt?: Date;
  imageUrl?: string;
}

export interface Note {
  id: string;
  subjectId: SubjectId;
  chapter: string;
  topic: string;
  isCompleted: boolean;
  submittedAt?: Date;
  imageUrl?: string;
  verified: boolean;
}

export interface Test {
  id: string;
  subjectId: SubjectId;
  title: string;
  chapter: string;
  totalQuestions: number;
  duration: number; // in minutes
  scheduledDate?: Date;
  completedAt?: Date;
  score?: number;
  totalMarks: number;
  status: 'upcoming' | 'available' | 'completed';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  images?: string[];
}

export interface Resource {
  id: string;
  subjectId: SubjectId;
  chapter: string;
  title: string;
  type: 'video' | 'pdf' | 'notes' | 'practice';
  url: string;
  isBookmarked: boolean;
  recommended: boolean;
}

export interface PendingTask {
  id: string;
  type: 'homework' | 'notes' | 'test';
  subjectId: SubjectId;
  title: string;
  dueDate: Date;
  isOverdue: boolean;
}