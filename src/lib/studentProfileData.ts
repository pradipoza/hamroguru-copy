import { SubjectId } from './types';

// Extended student profile data for tracking
export interface StudentProfile {
  id: string;
  name: string;
  grade: number;
  section: string;
  school: string;
  avatar?: string;
  email: string;
  phone: string;
  guardianName: string;
  guardianPhone: string;
  joinedDate: Date;
  streakDays: number;
  totalPoints: number;
  // Learning personality
  learningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  studyGoal: string;
  preferredStudyTime: string;
  intelligenceLevel: 'needs_support' | 'average' | 'above_average' | 'advanced';
}

export interface HomeworkRecord {
  id: string;
  subjectId: SubjectId;
  title: string;
  assignedDate: Date;
  dueDate: Date;
  submittedAt?: Date;
  status: 'pending' | 'submitted' | 'late' | 'missed' | 'checked';
  score?: number;
  maxScore: number;
  aiChecked: boolean;
  feedback?: string;
}

export interface TestRecord {
  id: string;
  subjectId: SubjectId;
  title: string;
  type: 'unit_test' | 'practice_quiz' | 'terminal_exam';
  date: Date;
  status: 'upcoming' | 'completed' | 'missed';
  score?: number;
  maxScore: number;
  duration: number;
  topicsAssessed: string[];
}

export interface NoteRecord {
  id: string;
  subjectId: SubjectId;
  chapter: string;
  topic: string;
  status: 'pending' | 'completed' | 'verified';
  submittedAt?: Date;
  verifiedAt?: Date;
  completeness?: number; // percentage
}

export interface LearningInsight {
  subjectId: SubjectId;
  strengths: string[];
  weaknesses: string[];
  topicsToFocus: string[];
  recommendedResources: string[];
  progressTrend: 'improving' | 'stable' | 'declining';
  engagementLevel: 'low' | 'medium' | 'high';
}

export interface ActivityLog {
  id: string;
  type: 'homework_submitted' | 'test_completed' | 'note_verified' | 'tutor_session' | 'resource_accessed';
  description: string;
  date: Date;
  subjectId?: SubjectId;
}

// Mock data
export const studentProfile: StudentProfile = {
  id: 'student-1',
  name: 'Aarav Sharma',
  grade: 9,
  section: 'A',
  school: 'Shree Janata Secondary School',
  email: 'aarav.sharma@school.edu.np',
  phone: '+977-9812345678',
  guardianName: 'Ramesh Sharma',
  guardianPhone: '+977-9841234567',
  joinedDate: new Date('2024-04-15'),
  streakDays: 12,
  totalPoints: 2450,
  learningStyle: 'visual',
  studyGoal: 'Prepare for SEE examination and score 3.5+ GPA',
  preferredStudyTime: 'Evening (6-8 PM)',
  intelligenceLevel: 'above_average',
};

export const homeworkHistory: HomeworkRecord[] = [
  {
    id: 'hw-hist-1',
    subjectId: 'math',
    title: 'Quadratic Equations Practice',
    assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    status: 'checked',
    score: 8,
    maxScore: 10,
    aiChecked: true,
    feedback: 'Good work! Minor error in Q3 factorization.',
  },
  {
    id: 'hw-hist-2',
    subjectId: 'math',
    title: 'Linear Equations Review',
    assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
    status: 'checked',
    score: 10,
    maxScore: 10,
    aiChecked: true,
    feedback: 'Excellent! All problems solved correctly.',
  },
  {
    id: 'hw-hist-3',
    subjectId: 'science',
    title: 'Chemical Reactions Lab Report',
    assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
    status: 'checked',
    score: 9,
    maxScore: 10,
    aiChecked: true,
    feedback: 'Great observations. Add more detail to conclusion next time.',
  },
  {
    id: 'hw-hist-4',
    subjectId: 'english',
    title: 'Essay Writing - My Village',
    assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
    status: 'missed',
    maxScore: 10,
    aiChecked: false,
  },
  {
    id: 'hw-hist-5',
    subjectId: 'nepali',
    title: 'निबन्ध - मेरो गाउँ',
    assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    status: 'late',
    score: 7,
    maxScore: 10,
    aiChecked: true,
    feedback: 'Submitted late. Good content but check grammar.',
  },
  {
    id: 'hw-hist-6',
    subjectId: 'math',
    title: 'Word Problems',
    assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    status: 'pending',
    maxScore: 10,
    aiChecked: false,
  },
];

export const testHistory: TestRecord[] = [
  {
    id: 'test-hist-1',
    subjectId: 'math',
    title: 'Unit Test - Linear Equations',
    type: 'unit_test',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
    status: 'completed',
    score: 42,
    maxScore: 50,
    duration: 45,
    topicsAssessed: ['Linear Equations', 'Simultaneous Equations'],
  },
  {
    id: 'test-hist-2',
    subjectId: 'science',
    title: 'Unit Test - Chemical Reactions',
    type: 'unit_test',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    status: 'completed',
    score: 38,
    maxScore: 50,
    duration: 45,
    topicsAssessed: ['Chemical Reactions', 'Balancing Equations'],
  },
  {
    id: 'test-hist-3',
    subjectId: 'english',
    title: 'Grammar Quiz',
    type: 'practice_quiz',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    status: 'completed',
    score: 25,
    maxScore: 30,
    duration: 20,
    topicsAssessed: ['Tenses', 'Articles', 'Prepositions'],
  },
  {
    id: 'test-hist-4',
    subjectId: 'math',
    title: 'Unit Test - Quadratic Equations',
    type: 'unit_test',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    status: 'upcoming',
    maxScore: 50,
    duration: 45,
    topicsAssessed: ['Quadratic Equations', 'Factorization', 'Discriminant'],
  },
  {
    id: 'test-hist-5',
    subjectId: 'nepali',
    title: 'First Terminal Exam',
    type: 'terminal_exam',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
    status: 'completed',
    score: 72,
    maxScore: 100,
    duration: 180,
    topicsAssessed: ['Grammar', 'Literature', 'Essay Writing'],
  },
];

export const noteHistory: NoteRecord[] = [
  {
    id: 'note-hist-1',
    subjectId: 'math',
    chapter: 'Chapter 1: Sets',
    topic: 'Set Operations',
    status: 'verified',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    verifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 29),
    completeness: 100,
  },
  {
    id: 'note-hist-2',
    subjectId: 'math',
    chapter: 'Chapter 2: Quadratic Equations',
    topic: 'Factorization Method',
    status: 'completed',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    completeness: 85,
  },
  {
    id: 'note-hist-3',
    subjectId: 'science',
    chapter: 'Chapter 5: Chemical Reactions',
    topic: 'Types of Reactions',
    status: 'verified',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    verifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
    completeness: 100,
  },
  {
    id: 'note-hist-4',
    subjectId: 'english',
    chapter: 'Chapter 3: Grammar',
    topic: 'Tenses - Past Perfect',
    status: 'pending',
    completeness: 40,
  },
  {
    id: 'note-hist-5',
    subjectId: 'social',
    chapter: 'Chapter 6: Civics',
    topic: 'Constitution of Nepal',
    status: 'pending',
    completeness: 0,
  },
];

export const learningInsights: LearningInsight[] = [
  {
    subjectId: 'math',
    strengths: ['Linear Equations', 'Algebraic Expressions', 'Set Theory'],
    weaknesses: ['Word Problems', 'Quadratic Formula Application'],
    topicsToFocus: ['Discriminant Analysis', 'Completing the Square'],
    recommendedResources: ['Khan Academy - Quadratics', 'Practice Problems Set A'],
    progressTrend: 'improving',
    engagementLevel: 'high',
  },
  {
    subjectId: 'science',
    strengths: ['Lab Work', 'Observation Skills', 'Chemical Equations'],
    weaknesses: ['Theoretical Concepts', 'Memorization'],
    topicsToFocus: ['Periodic Table Properties', 'Reaction Mechanisms'],
    recommendedResources: ['Interactive Chemistry Simulations'],
    progressTrend: 'stable',
    engagementLevel: 'medium',
  },
  {
    subjectId: 'english',
    strengths: ['Reading Comprehension', 'Vocabulary'],
    weaknesses: ['Essay Structure', 'Tense Usage'],
    topicsToFocus: ['Past Perfect vs Past Simple', 'Paragraph Organization'],
    recommendedResources: ['Grammar in Use Book', 'Essay Writing Guide'],
    progressTrend: 'declining',
    engagementLevel: 'low',
  },
];

export const recentActivity: ActivityLog[] = [
  {
    id: 'act-1',
    type: 'homework_submitted',
    description: 'Submitted "Quadratic Equations Practice"',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2),
    subjectId: 'math',
  },
  {
    id: 'act-2',
    type: 'tutor_session',
    description: 'AI Tutor session - Discussed discriminant concept',
    date: new Date(Date.now() - 1000 * 60 * 60 * 5),
    subjectId: 'math',
  },
  {
    id: 'act-3',
    type: 'test_completed',
    description: 'Completed "Grammar Quiz" - Scored 25/30',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    subjectId: 'english',
  },
  {
    id: 'act-4',
    type: 'note_verified',
    description: 'Notes verified for "Types of Reactions"',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
    subjectId: 'science',
  },
  {
    id: 'act-5',
    type: 'resource_accessed',
    description: 'Watched "Quadratic Formula Explained" video',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    subjectId: 'math',
  },
];

// Utility functions
export const getHomeworkStats = () => {
  const total = homeworkHistory.length;
  const completed = homeworkHistory.filter(hw => hw.status === 'checked' || hw.status === 'submitted').length;
  const late = homeworkHistory.filter(hw => hw.status === 'late').length;
  const missed = homeworkHistory.filter(hw => hw.status === 'missed').length;
  const pending = homeworkHistory.filter(hw => hw.status === 'pending').length;
  const avgScore = homeworkHistory
    .filter(hw => hw.score !== undefined)
    .reduce((acc, hw) => acc + (hw.score! / hw.maxScore) * 100, 0) / 
    homeworkHistory.filter(hw => hw.score !== undefined).length || 0;

  return { total, completed, late, missed, pending, avgScore };
};

export const getTestStats = () => {
  const completedTests = testHistory.filter(t => t.status === 'completed');
  const avgScore = completedTests.reduce((acc, t) => acc + (t.score! / t.maxScore) * 100, 0) / completedTests.length || 0;
  const upcoming = testHistory.filter(t => t.status === 'upcoming').length;

  return { total: testHistory.length, completed: completedTests.length, upcoming, avgScore };
};

export const getNoteStats = () => {
  const total = noteHistory.length;
  const verified = noteHistory.filter(n => n.status === 'verified').length;
  const completed = noteHistory.filter(n => n.status === 'completed').length;
  const pending = noteHistory.filter(n => n.status === 'pending').length;

  return { total, verified, completed, pending };
};
