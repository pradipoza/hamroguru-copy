import { Teacher, ClassInfo, StudentRecord, Submission, TeacherAssignment, ClassPerformance, LessonPlan, StudentQuery, DailyDose, TeacherAssessment } from './teacherTypes';

export const currentTeacher: Teacher = {
  id: 'teacher-1',
  name: 'Ram Prasad Sharma',
  email: 'ram.sharma@school.edu.np',
  phone: '+977-9841234567',
  subjects: ['math'],
};

export const classes: ClassInfo[] = [
  {
    id: 'class-9a',
    name: 'Grade 9A',
    grade: 9,
    section: 'A',
    subjectId: 'math',
    studentCount: 32,
    pendingSubmissions: 8,
    averageScore: 72,
  },
  {
    id: 'class-9b',
    name: 'Grade 9B',
    grade: 9,
    section: 'B',
    subjectId: 'math',
    studentCount: 30,
    pendingSubmissions: 5,
    averageScore: 68,
  },
  {
    id: 'class-10a',
    name: 'Grade 10A',
    grade: 10,
    section: 'A',
    subjectId: 'math',
    studentCount: 28,
    pendingSubmissions: 12,
    averageScore: 75,
  },
];

export const students: StudentRecord[] = [
  {
    id: 'student-1',
    name: 'Aarav Sharma',
    grade: 9,
    section: 'A',
    email: 'aarav.s@school.edu.np',
    averageScore: 78,
    submissionRate: 95,
    lastActive: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: 'student-2',
    name: 'Priya Thapa',
    grade: 9,
    section: 'A',
    email: 'priya.t@school.edu.np',
    averageScore: 92,
    submissionRate: 100,
    lastActive: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: 'student-3',
    name: 'Bikash Gurung',
    grade: 9,
    section: 'A',
    email: 'bikash.g@school.edu.np',
    averageScore: 65,
    submissionRate: 80,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: 'student-4',
    name: 'Sita Rai',
    grade: 9,
    section: 'A',
    email: 'sita.r@school.edu.np',
    averageScore: 85,
    submissionRate: 98,
    lastActive: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: 'student-5',
    name: 'Rajan Karki',
    grade: 9,
    section: 'A',
    email: 'rajan.k@school.edu.np',
    averageScore: 58,
    submissionRate: 70,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: 'student-6',
    name: 'Anita Shrestha',
    grade: 9,
    section: 'B',
    email: 'anita.s@school.edu.np',
    averageScore: 88,
    submissionRate: 100,
    lastActive: new Date(Date.now() - 1000 * 60 * 20),
  },
  {
    id: 'student-7',
    name: 'Dipesh Magar',
    grade: 9,
    section: 'B',
    email: 'dipesh.m@school.edu.np',
    averageScore: 72,
    submissionRate: 85,
    lastActive: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: 'student-8',
    name: 'Maya Tamang',
    grade: 10,
    section: 'A',
    email: 'maya.t@school.edu.np',
    averageScore: 90,
    submissionRate: 100,
    lastActive: new Date(Date.now() - 1000 * 60 * 10),
  },
];

export const submissions: Submission[] = [
  {
    id: 'sub-1',
    homeworkId: 'hw-1',
    homeworkTitle: 'Quadratic Equations Practice',
    studentId: 'student-1',
    studentName: 'Aarav Sharma',
    classId: 'class-9a',
    subjectId: 'math',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: 'pending_review',
    aiSuggestion: '8/10 - Minor calculation error in Q3. Consider partial credit.',
  },
  {
    id: 'sub-2',
    homeworkId: 'hw-1',
    homeworkTitle: 'Quadratic Equations Practice',
    studentId: 'student-2',
    studentName: 'Priya Thapa',
    classId: 'class-9a',
    subjectId: 'math',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    status: 'pending_review',
    aiSuggestion: '10/10 - Excellent work! All solutions correct with clear steps.',
  },
  {
    id: 'sub-3',
    homeworkId: 'hw-1',
    homeworkTitle: 'Quadratic Equations Practice',
    studentId: 'student-3',
    studentName: 'Bikash Gurung',
    classId: 'class-9a',
    subjectId: 'math',
    submittedAt: new Date(Date.now() - 1000 * 60 * 30),
    status: 'pending_review',
    aiSuggestion: '6/10 - Multiple errors in factorization. Recommend review session.',
  },
  {
    id: 'sub-4',
    homeworkId: 'hw-2',
    homeworkTitle: 'Word Problems',
    studentId: 'student-4',
    studentName: 'Sita Rai',
    classId: 'class-9a',
    subjectId: 'math',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    status: 'reviewed',
    grade: 9,
    feedback: 'Great problem-solving approach! Minor arithmetic error in Q2.',
  },
  {
    id: 'sub-5',
    homeworkId: 'hw-1',
    homeworkTitle: 'Quadratic Equations Practice',
    studentId: 'student-6',
    studentName: 'Anita Shrestha',
    classId: 'class-9b',
    subjectId: 'math',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60),
    status: 'pending_review',
    aiSuggestion: '9/10 - Well organized. Small sign error in Q7.',
  },
];

export const teacherAssignments: TeacherAssignment[] = [
  {
    id: 'ta-1',
    title: 'Quadratic Equations Practice',
    description: 'Solve problems 1-10 from Exercise 2.3',
    chapter: 'Chapter 2: Quadratic Equations',
    classId: 'class-9a',
    className: 'Grade 9A',
    subjectId: 'math',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    totalStudents: 32,
    submittedCount: 18,
    gradedCount: 5,
  },
  {
    id: 'ta-2',
    title: 'Word Problems',
    description: 'Complete word problems from page 45',
    chapter: 'Chapter 2: Quadratic Equations',
    classId: 'class-9a',
    className: 'Grade 9A',
    subjectId: 'math',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    totalStudents: 32,
    submittedCount: 8,
    gradedCount: 2,
  },
  {
    id: 'ta-3',
    title: 'Linear Equations Review',
    description: 'Practice problems from Exercise 1.5',
    chapter: 'Chapter 1: Linear Equations',
    classId: 'class-9b',
    className: 'Grade 9B',
    subjectId: 'math',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    totalStudents: 30,
    submittedCount: 22,
    gradedCount: 18,
  },
  {
    id: 'ta-4',
    title: 'Trigonometry Basics',
    description: 'Introduction to sin, cos, tan',
    chapter: 'Chapter 4: Trigonometry',
    classId: 'class-10a',
    className: 'Grade 10A',
    subjectId: 'math',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    createdAt: new Date(Date.now()),
    totalStudents: 28,
    submittedCount: 0,
    gradedCount: 0,
  },
];

export const classPerformance: ClassPerformance[] = [
  {
    classId: 'class-9a',
    className: 'Grade 9A',
    averageScore: 72,
    submissionRate: 88,
    topPerformers: ['Priya Thapa', 'Sita Rai', 'Aarav Sharma'],
    needsAttention: ['Rajan Karki', 'Bikash Gurung'],
  },
  {
    classId: 'class-9b',
    className: 'Grade 9B',
    averageScore: 68,
    submissionRate: 82,
    topPerformers: ['Anita Shrestha', 'Dipesh Magar'],
    needsAttention: [],
  },
  {
    classId: 'class-10a',
    className: 'Grade 10A',
    averageScore: 75,
    submissionRate: 91,
    topPerformers: ['Maya Tamang'],
    needsAttention: [],
  },
];

// Utility functions
export const getClassById = (id: string): ClassInfo | undefined => {
  return classes.find((c) => c.id === id);
};

export const getStudentsByClass = (classId: string): StudentRecord[] => {
  const classInfo = getClassById(classId);
  if (!classInfo) return [];
  return students.filter((s) => s.grade === classInfo.grade && s.section === classInfo.section);
};

export const getSubmissionsByClass = (classId: string): Submission[] => {
  return submissions.filter((s) => s.classId === classId);
};

export const getPendingSubmissions = (): Submission[] => {
  return submissions.filter((s) => s.status === 'pending_review');
};

export const getAssignmentsByClass = (classId: string): TeacherAssignment[] => {
  return teacherAssignments.filter((a) => a.classId === classId);
};

export const getClassPerformance = (classId: string): ClassPerformance | undefined => {
  return classPerformance.find((p) => p.classId === classId);
};

// Lesson Plan Mock Data
export const studentQueries: StudentQuery[] = [
  {
    id: 'query-1',
    studentId: 'student-3',
    studentName: 'Bikash Gurung',
    query: 'I don\'t understand how to find the discriminant in quadratic equations',
    topic: 'Quadratic Equations - Discriminant',
    status: 'pending',
    askedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: 'query-2',
    studentId: 'student-5',
    studentName: 'Rajan Karki',
    query: 'When do we use the quadratic formula vs factorization?',
    topic: 'Quadratic Equations - Methods',
    status: 'pending',
    askedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
  {
    id: 'query-3',
    studentId: 'student-1',
    studentName: 'Aarav Sharma',
    query: 'How to identify if a quadratic equation has real roots?',
    topic: 'Quadratic Equations - Nature of Roots',
    status: 'addressed',
    askedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    addressedAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
    studentFeedback: 'understood',
  },
  {
    id: 'query-4',
    studentId: 'student-7',
    studentName: 'Dipesh Magar',
    query: 'Can you explain completing the square method step by step?',
    topic: 'Quadratic Equations - Completing Square',
    status: 'not_addressed',
    askedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
];

export const dailyDoses: DailyDose[] = [
  {
    id: 'dose-1',
    title: 'Understanding Common Misconceptions in Quadratic Equations',
    description: 'Learn about the most frequent mistakes students make when solving quadratic equations and how to address them.',
    content: `Based on this week's homework analysis, students are struggling with:

1. **Sign errors in the discriminant formula**: Many students forget the formula is b²-4ac, not b²+4ac. Emphasize the subtraction.

2. **Factorization patterns**: Students often miss that (x+a)(x+b) = x² + (a+b)x + ab. Use visual methods to reinforce.

3. **When to use each method**: Create a decision tree:
   - Simple coefficients → Try factorization first
   - Complex or decimal coefficients → Use quadratic formula
   - Need to find vertex → Complete the square

**Recommended exercise**: Start class with a quick 5-min quiz on discriminant calculation.`,
    topics: ['Quadratic Equations', 'Student Misconceptions', 'Teaching Methods'],
    estimatedTime: 10,
    source: 'AI Analysis of Student Homework',
    completed: false,
  },
  {
    id: 'dose-2',
    title: 'New GeoGebra Features for Teaching Parabolas',
    description: 'Explore interactive visualization tools to help students understand the graphical representation of quadratic equations.',
    content: `GeoGebra's latest update includes enhanced features for teaching quadratics:

1. **Dynamic sliders**: Show how a, b, c affect the parabola shape in real-time
2. **Root visualization**: Highlight x-intercepts and connect to algebraic solutions
3. **Vertex form converter**: Automatically convert between standard and vertex form

**Activity idea**: Let students manipulate the parabola and predict the equation.`,
    topics: ['EdTech', 'GeoGebra', 'Visual Learning'],
    estimatedTime: 8,
    source: 'EdTech Weekly',
    completed: true,
  },
];

export const lessonPlans: LessonPlan[] = [
  {
    id: 'lp-1',
    classId: 'class-9a',
    className: 'Grade 9A - Mathematics',
    subjectId: 'math',
    date: new Date(),
    topics: ['Quadratic Equations - Nature of Roots', 'Discriminant Analysis'],
    studentQueries: studentQueries.filter(q => q.status === 'pending'),
    weakAreas: ['Discriminant calculation', 'Choosing solving method'],
    recommendedFocus: 'Focus on discriminant formula and its interpretation. 3 students specifically asked about this topic. Use visual examples on board.',
    dailyDose: dailyDoses[0],
    status: 'upcoming',
  },
  {
    id: 'lp-2',
    classId: 'class-9b',
    className: 'Grade 9B - Mathematics',
    subjectId: 'math',
    date: new Date(),
    topics: ['Linear Equations Review', 'Word Problems'],
    studentQueries: [],
    weakAreas: ['Converting word problems to equations'],
    recommendedFocus: 'Students performed well on direct problems but struggle with word problems. Spend extra time on problem interpretation.',
    dailyDose: dailyDoses[1],
    status: 'upcoming',
  },
  {
    id: 'lp-3',
    classId: 'class-10a',
    className: 'Grade 10A - Mathematics',
    subjectId: 'math',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24),
    topics: ['Trigonometry - Introduction', 'Basic Ratios'],
    studentQueries: [],
    weakAreas: [],
    recommendedFocus: 'New chapter introduction. Start with real-world examples of triangles and angles.',
    dailyDose: dailyDoses[0],
    status: 'upcoming',
  },
];

export const teacherAssessments: TeacherAssessment[] = [
  {
    id: 'ta-1',
    title: 'Quadratic Equations Mastery Test',
    subjectId: 'math',
    totalQuestions: 15,
    duration: 20,
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    status: 'upcoming',
  },
  {
    id: 'ta-2',
    title: 'Modern Teaching Methods Assessment',
    subjectId: 'math',
    totalQuestions: 10,
    duration: 15,
    scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    score: 85,
    status: 'completed',
  },
];

// Utility functions for lesson plans
export const getTodaysLessonPlans = (): LessonPlan[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return lessonPlans.filter(lp => {
    const planDate = new Date(lp.date);
    planDate.setHours(0, 0, 0, 0);
    return planDate >= today && planDate < tomorrow;
  });
};

export const getLessonPlansByClass = (classId: string): LessonPlan[] => {
  return lessonPlans.filter(lp => lp.classId === classId);
};

export const getPendingQueries = (): StudentQuery[] => {
  return studentQueries.filter(q => q.status === 'pending' || q.status === 'not_addressed');
};

export const getUnaddressedQueries = (): StudentQuery[] => {
  return studentQueries.filter(q => q.status === 'not_addressed');
};
