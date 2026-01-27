export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  email: string;
}

export interface Profile {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  phone: string | null;
  streakDays?: number;
  totalPoints?: number;
}

export interface Subject {
  id: string;
  name: string;
  nameNepali: string | null;
  code: string;
  icon: string | null;
  color: string | null;
}

export interface Homework {
  id: string;
  title: string;
  description: string | null;
  chapter: string | null;
  dueDate: string;
  status: 'pending' | 'submitted' | 'checked' | 'reviewed' | 'late' | 'missed';
  score: number | null;
}

export interface Note {
  id: string;
  studentId: string;
  subjectId: string;
  chapter: string;
  topic: string;
  content: string | null;
  images: string[] | null;
  status: 'pending' | 'completed' | 'verified';
  verifiedBy: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Test {
  id: string;
  title: string;
  chapter: string | null;
  type: string | null;
  totalQuestions: number | null;
  totalMarks: number | null;
  duration: number | null;
  scheduledDate: string | null;
  status: 'upcoming' | 'available' | 'completed';
  score: number | null;
  completedAt: string | null;
}

export interface Resource {
  id: string;
  subjectId: string;
  chapter: string | null;
  title: string;
  type: string;
  url: string | null;
  isBookmarked: boolean | null;
  recommended: boolean | null;
  createdAt: string;
}

export interface TeacherProfile {
  fullName: string;
  avatarUrl: string | null;
  qualification: string | null;
  yearsExperience: number | null;
  subjectsTaught: string[] | null;
}

export interface ClassAssignment {
  class: {
    grade: number;
    section: string;
  };
  subject: {
    name: string;
    code: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}