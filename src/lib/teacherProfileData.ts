import { SubjectId } from './types';

// Extended teacher profile data for portfolio and tracking
export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: SubjectId[];
  avatar?: string;
  school: string;
  employeeId: string;
  qualification: string;
  experience: number; // years
  joinedDate: Date;
  specializations: string[];
}

export interface DailyDoseRecord {
  id: string;
  title: string;
  assignedDate: Date;
  completedAt?: Date;
  status: 'pending' | 'completed' | 'skipped';
  topics: string[];
  estimatedTime: number;
  source: string;
}

export interface AssessmentRecord {
  id: string;
  title: string;
  subjectId: SubjectId;
  date: Date;
  status: 'upcoming' | 'completed' | 'missed';
  score?: number;
  maxScore: number;
  topics: string[];
  performanceLevel?: 'needs_improvement' | 'satisfactory' | 'good' | 'excellent';
}

export interface QueryAddressedRecord {
  id: string;
  studentId: string;
  studentName: string;
  query: string;
  topic: string;
  askedAt: Date;
  status: 'addressed' | 'not_addressed' | 'pending';
  addressedAt?: Date;
  studentFeedback?: 'understood' | 'still_confused' | 'not_addressed';
  addedToPortfolio: boolean;
}

export interface LessonPlanRecord {
  id: string;
  classId: string;
  className: string;
  date: Date;
  status: 'completed' | 'partial' | 'missed';
  topicsPlanned: string[];
  topicsCovered: string[];
  queriesAssigned: number;
  queriesAddressed: number;
  feedbackScore?: number; // 1-5
}

export interface PortfolioMetric {
  category: string;
  metric: string;
  value: number;
  maxValue?: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
}

// Mock data
export const teacherProfile: TeacherProfile = {
  id: 'teacher-1',
  name: 'Ram Prasad Sharma',
  email: 'ram.sharma@school.edu.np',
  phone: '+977-9841234567',
  subjects: ['math'],
  school: 'Shree Janata Secondary School',
  employeeId: 'TCH-2019-045',
  qualification: 'M.Ed. Mathematics',
  experience: 8,
  joinedDate: new Date('2019-07-15'),
  specializations: ['Algebra', 'Geometry', 'Trigonometry'],
};

export const dailyDoseHistory: DailyDoseRecord[] = [
  {
    id: 'ddh-1',
    title: 'Understanding Common Misconceptions in Quadratic Equations',
    assignedDate: new Date(),
    status: 'pending',
    topics: ['Quadratic Equations', 'Student Misconceptions'],
    estimatedTime: 10,
    source: 'AI Analysis',
  },
  {
    id: 'ddh-2',
    title: 'New GeoGebra Features for Teaching Parabolas',
    assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
    status: 'completed',
    topics: ['EdTech', 'GeoGebra'],
    estimatedTime: 8,
    source: 'EdTech Weekly',
  },
  {
    id: 'ddh-3',
    title: 'Effective Strategies for Word Problems',
    assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 3),
    status: 'completed',
    topics: ['Word Problems', 'Teaching Methods'],
    estimatedTime: 12,
    source: 'AI Analysis',
  },
  {
    id: 'ddh-4',
    title: 'Differentiated Instruction for Mixed Ability Classes',
    assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    status: 'skipped',
    topics: ['Pedagogy', 'Differentiation'],
    estimatedTime: 15,
    source: 'Teacher Training Module',
  },
  {
    id: 'ddh-5',
    title: 'Using Real-World Examples in Linear Equations',
    assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4 + 1000 * 60 * 60 * 2),
    status: 'completed',
    topics: ['Linear Equations', 'Applied Math'],
    estimatedTime: 10,
    source: 'AI Analysis',
  },
  {
    id: 'ddh-6',
    title: 'Assessment Strategies for Formative Evaluation',
    assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 60 * 4),
    status: 'completed',
    topics: ['Assessment', 'Formative Evaluation'],
    estimatedTime: 10,
    source: 'Teacher Training Module',
  },
];

export const assessmentHistory: AssessmentRecord[] = [
  {
    id: 'asmt-1',
    title: 'Quadratic Equations Mastery Test',
    subjectId: 'math',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    status: 'upcoming',
    maxScore: 100,
    topics: ['Quadratic Equations', 'Factorization', 'Graphing'],
  },
  {
    id: 'asmt-2',
    title: 'Modern Teaching Methods Assessment',
    subjectId: 'math',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    status: 'completed',
    score: 85,
    maxScore: 100,
    topics: ['Pedagogy', 'EdTech', 'Student Engagement'],
    performanceLevel: 'good',
  },
  {
    id: 'asmt-3',
    title: 'Linear Equations Deep Dive',
    subjectId: 'math',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    status: 'completed',
    score: 92,
    maxScore: 100,
    topics: ['Linear Equations', 'Simultaneous Equations'],
    performanceLevel: 'excellent',
  },
  {
    id: 'asmt-4',
    title: 'Geometry Fundamentals Review',
    subjectId: 'math',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
    status: 'completed',
    score: 78,
    maxScore: 100,
    topics: ['Geometry', 'Coordinate Geometry'],
    performanceLevel: 'satisfactory',
  },
  {
    id: 'asmt-5',
    title: 'Classroom Management Assessment',
    subjectId: 'math',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
    status: 'missed',
    maxScore: 100,
    topics: ['Classroom Management', 'Discipline'],
  },
];

export const queryAddressHistory: QueryAddressedRecord[] = [
  {
    id: 'qah-1',
    studentId: 'student-3',
    studentName: 'Bikash Gurung',
    query: 'I don\'t understand how to find the discriminant in quadratic equations',
    topic: 'Quadratic Equations - Discriminant',
    askedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    status: 'pending',
    addedToPortfolio: false,
  },
  {
    id: 'qah-2',
    studentId: 'student-5',
    studentName: 'Rajan Karki',
    query: 'When do we use the quadratic formula vs factorization?',
    topic: 'Quadratic Equations - Methods',
    askedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    status: 'pending',
    addedToPortfolio: false,
  },
  {
    id: 'qah-3',
    studentId: 'student-1',
    studentName: 'Aarav Sharma',
    query: 'How to identify if a quadratic equation has real roots?',
    topic: 'Quadratic Equations - Nature of Roots',
    askedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'addressed',
    addressedAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
    studentFeedback: 'understood',
    addedToPortfolio: false,
  },
  {
    id: 'qah-4',
    studentId: 'student-7',
    studentName: 'Dipesh Magar',
    query: 'Can you explain completing the square method step by step?',
    topic: 'Quadratic Equations - Completing Square',
    askedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    status: 'not_addressed',
    addedToPortfolio: true, // Added to portfolio as unaddressed
  },
  {
    id: 'qah-5',
    studentId: 'student-2',
    studentName: 'Priya Thapa',
    query: 'How to graph quadratic equations quickly?',
    topic: 'Quadratic Equations - Graphing',
    askedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    status: 'addressed',
    addressedAt: new Date(Date.now() - 1000 * 60 * 60 * 68),
    studentFeedback: 'still_confused',
    addedToPortfolio: true, // Added because student still confused
  },
];

export const lessonPlanHistory: LessonPlanRecord[] = [
  {
    id: 'lph-1',
    classId: 'class-9a',
    className: 'Grade 9A',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'completed',
    topicsPlanned: ['Quadratic Equations - Factorization', 'Practice Problems'],
    topicsCovered: ['Quadratic Equations - Factorization', 'Practice Problems'],
    queriesAssigned: 2,
    queriesAddressed: 2,
    feedbackScore: 4.5,
  },
  {
    id: 'lph-2',
    classId: 'class-9b',
    className: 'Grade 9B',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'completed',
    topicsPlanned: ['Linear Equations Review'],
    topicsCovered: ['Linear Equations Review'],
    queriesAssigned: 1,
    queriesAddressed: 1,
    feedbackScore: 4.0,
  },
  {
    id: 'lph-3',
    classId: 'class-10a',
    className: 'Grade 10A',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    status: 'partial',
    topicsPlanned: ['Trigonometry Basics', 'Sin Cos Tan Introduction'],
    topicsCovered: ['Trigonometry Basics'],
    queriesAssigned: 3,
    queriesAddressed: 1,
    feedbackScore: 3.0,
  },
  {
    id: 'lph-4',
    classId: 'class-9a',
    className: 'Grade 9A',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    status: 'completed',
    topicsPlanned: ['Quadratic Equations Introduction'],
    topicsCovered: ['Quadratic Equations Introduction'],
    queriesAssigned: 0,
    queriesAddressed: 0,
    feedbackScore: 4.8,
  },
  {
    id: 'lph-5',
    classId: 'class-9b',
    className: 'Grade 9B',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    status: 'missed',
    topicsPlanned: ['Word Problems Practice'],
    topicsCovered: [],
    queriesAssigned: 2,
    queriesAddressed: 0,
  },
];

export const portfolioMetrics: PortfolioMetric[] = [
  {
    category: 'Daily Dose',
    metric: 'Completion Rate',
    value: 83,
    maxValue: 100,
    trend: 'up',
    period: 'Last 30 days',
  },
  {
    category: 'Assessments',
    metric: 'Average Score',
    value: 85,
    maxValue: 100,
    trend: 'stable',
    period: 'All time',
  },
  {
    category: 'Student Queries',
    metric: 'Resolution Rate',
    value: 75,
    maxValue: 100,
    trend: 'down',
    period: 'Last 30 days',
  },
  {
    category: 'Lesson Plans',
    metric: 'Completion Rate',
    value: 88,
    maxValue: 100,
    trend: 'up',
    period: 'Last 30 days',
  },
  {
    category: 'Student Feedback',
    metric: 'Average Rating',
    value: 4.2,
    maxValue: 5,
    trend: 'up',
    period: 'Last 30 days',
  },
  {
    category: 'Accountability',
    metric: 'Unaddressed Issues',
    value: 3,
    trend: 'down',
    period: 'Current',
  },
];

// Utility functions
export const getDailyDoseStats = () => {
  const total = dailyDoseHistory.length;
  const completed = dailyDoseHistory.filter(d => d.status === 'completed').length;
  const skipped = dailyDoseHistory.filter(d => d.status === 'skipped').length;
  const pending = dailyDoseHistory.filter(d => d.status === 'pending').length;
  const completionRate = (completed / (total - pending)) * 100 || 0;

  return { total, completed, skipped, pending, completionRate };
};

export const getAssessmentStats = () => {
  const completedAssessments = assessmentHistory.filter(a => a.status === 'completed');
  const avgScore = completedAssessments.reduce((acc, a) => acc + (a.score! / a.maxScore) * 100, 0) / completedAssessments.length || 0;
  const upcoming = assessmentHistory.filter(a => a.status === 'upcoming').length;
  const missed = assessmentHistory.filter(a => a.status === 'missed').length;

  return { 
    total: assessmentHistory.length, 
    completed: completedAssessments.length, 
    upcoming, 
    missed,
    avgScore 
  };
};

export const getQueryStats = () => {
  const total = queryAddressHistory.length;
  const addressed = queryAddressHistory.filter(q => q.status === 'addressed').length;
  const notAddressed = queryAddressHistory.filter(q => q.status === 'not_addressed').length;
  const pending = queryAddressHistory.filter(q => q.status === 'pending').length;
  const studentSatisfied = queryAddressHistory.filter(q => q.studentFeedback === 'understood').length;
  const stillConfused = queryAddressHistory.filter(q => q.studentFeedback === 'still_confused').length;

  return { total, addressed, notAddressed, pending, studentSatisfied, stillConfused };
};

export const getLessonPlanStats = () => {
  const total = lessonPlanHistory.length;
  const completed = lessonPlanHistory.filter(lp => lp.status === 'completed').length;
  const partial = lessonPlanHistory.filter(lp => lp.status === 'partial').length;
  const missed = lessonPlanHistory.filter(lp => lp.status === 'missed').length;
  const avgFeedback = lessonPlanHistory
    .filter(lp => lp.feedbackScore !== undefined)
    .reduce((acc, lp) => acc + lp.feedbackScore!, 0) / 
    lessonPlanHistory.filter(lp => lp.feedbackScore !== undefined).length || 0;

  return { total, completed, partial, missed, avgFeedback };
};

export const getPortfolioIssues = () => {
  return queryAddressHistory.filter(q => q.addedToPortfolio);
};
