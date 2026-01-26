import { ChatMessage } from "@/lib/types";

export const mockStudentProfile = {
  id: 'student-Pradip-001',
  full_name: 'Pradip Ojha',
  name: 'Pradip Ojha',
  email: 'madhab@demo.meroguru.com',
  phone: '+977-9841000000',
  grade: 9,
  section: 'A',
  school: 'Shree Janata Secondary School, Kathmandu',
  avatar: null,
  streakDays: 14,
  totalPoints: 3250,
  learningStyle: 'visual',
  intelligenceLevel: 'above_average',
  preferredStudyTime: 'Morning (6-9 AM)',
  studyGoal: 'Score 90%+ in SEE examinations'
};

export const mockSubjects = [
  {
    id: 'math',
    code: 'math',
    name: 'Mathematics',
    nameNepali: 'गणित',
    icon: '📐',
    color: 'math',
    teacher: 'Pradip Ojha',
    teacherAvatar: null,
    pendingHomework: 2,
    pendingNotes: 1,
    upcomingTests: 1,
  },
  {
    id: 'science',
    code: 'science', 
    name: 'Science',
    nameNepali: 'विज्ञान',
    icon: '🔬',
    color: 'science',
    teacher: 'Mrs. Sita Karki',
    pendingHomework: 1,
    pendingNotes: 0,
    upcomingTests: 0,
  },
  {
    id: 'english',
    code: 'english',
    name: 'English',
    nameNepali: 'अंग्रेजी',
    icon: '📚',
    color: 'english',
    teacher: 'Mr. Krishna Adhikari',
    pendingHomework: 0,
    pendingNotes: 2,
    upcomingTests: 1,
  },
  {
    id: 'nepali',
    code: 'nepali',
    name: 'Nepali',
    nameNepali: 'नेपाली',
    icon: '📖',
    color: 'nepali',
    teacher: 'Mrs. Laxmi Thapa',
    pendingHomework: 1,
    pendingNotes: 0,
    upcomingTests: 0,
  },
  {
    id: 'social',
    code: 'social',
    name: 'Social Studies',
    nameNepali: 'सामाजिक अध्ययन',
    icon: '🌍',
    color: 'social',
    teacher: 'Mr. Hari Bahadur',
    pendingHomework: 0,
    pendingNotes: 1,
    upcomingTests: 0,
  },
  {
    id: 'computer',
    code: 'computer',
    name: 'Computer Science',
    nameNepali: 'कम्प्युटर विज्ञान',
    icon: '💻',
    color: 'computer',
    teacher: 'Mr. Sunil Sharma',
    pendingHomework: 1,
    pendingNotes: 0,
    upcomingTests: 1,
  },
];

export const mockPendingTasks = [
  {
    id: 'task-1',
    type: 'homework',
    subjectCode: 'nepali',
    subjectName: 'Nepali',
    title: 'निबन्ध: मेरो देश नेपाल',
    dueDate: new Date(Date.now() - 86400000), // Yesterday - OVERDUE
    isOverdue: true,
  },
  {
    id: 'task-2',
    type: 'homework',
    subjectCode: 'math',
    subjectName: 'Mathematics',
    title: 'Quadratic Equations - Exercise 2.3',
    dueDate: new Date(Date.now() + 86400000), // Tomorrow
    isOverdue: false,
  },
  {
    id: 'task-3',
    type: 'test',
    subjectCode: 'english',
    subjectName: 'English',
    title: 'Grammar Quiz - Tenses',
    dueDate: new Date(Date.now() + 86400000 * 2), // 2 days
    isOverdue: false,
  },
  {
    id: 'task-4',
    type: 'notes',
    subjectCode: 'math',
    subjectName: 'Mathematics',
    title: 'Chapter 2: Factorization Method',
    dueDate: new Date(Date.now() + 86400000 * 3),
    isOverdue: false,
  },
];

export const mockMathHomework = [
  {
    id: 'hw-math-1',
    title: 'Quadratic Equations - Exercise 2.3',
    description: 'Solve problems 1-10 using factorization method',
    chapter: 'Chapter 2: Quadratic Equations',
    dueDate: new Date(Date.now() + 86400000),
    status: 'pending',
    score: undefined,
    maxScore: 20,
    feedback: undefined,
  },
  {
    id: 'hw-math-2',
    title: 'Word Problems Practice',
    description: 'Complete word problems from page 45-47',
    chapter: 'Chapter 2: Quadratic Equations',
    dueDate: new Date(Date.now() + 86400000 * 3),
    status: 'pending',
  },
  {
    id: 'hw-math-3',
    title: 'Linear Equations Revision',
    description: 'Revision exercises from previous chapter',
    chapter: 'Chapter 1: Linear Equations',
    dueDate: new Date(Date.now() - 86400000 * 5),
    status: 'checked',
    score: 18,
    maxScore: 20,
    feedback: 'Excellent work! Minor calculation error in Q7.',
  },
  {
    id: 'hw-math-4',
    title: 'Graph Plotting Assignment',
    description: 'Plot graphs for given equations',
    chapter: 'Chapter 1: Linear Equations',
    dueDate: new Date(Date.now() - 86400000 * 10),
    status: 'submitted',
  },
];

export const mockMathNotes = [
  {
    id: 'note-math-1',
    chapter: 'Chapter 2: Quadratic Equations',
    topic: 'Factorization Method',
    isCompleted: false,
    verified: false,
    submittedAt: null,
  },
  {
    id: 'note-math-2',
    chapter: 'Chapter 2: Quadratic Equations',
    topic: 'Quadratic Formula',
    isCompleted: true,
    verified: true,
    submittedAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: 'note-math-3',
    chapter: 'Chapter 1: Linear Equations',
    topic: 'Slope-Intercept Form',
    isCompleted: true,
    verified: true,
    submittedAt: new Date(Date.now() - 86400000 * 7),
  },
  {
    id: 'note-math-4',
    chapter: 'Chapter 1: Linear Equations',
    topic: 'Word Problems with Linear Equations',
    isCompleted: true,
    verified: false,
    submittedAt: new Date(Date.now() - 86400000 * 5),
  },
];

export const mockMathTests = [
  {
    id: 'test-math-1',
    title: 'Unit Test - Quadratic Equations',
    chapter: 'Chapter 2',
    totalQuestions: 20,
    duration: 45,
    totalMarks: 50,
    scheduledDate: new Date(Date.now() + 86400000 * 5),
    status: 'upcoming',
    score: undefined,
  },
  {
    id: 'test-math-2',
    title: 'Quick Quiz - Factorization',
    chapter: 'Chapter 2',
    totalQuestions: 10,
    duration: 15,
    totalMarks: 20,
    status: 'available',
    score: undefined,
  },
  {
    id: 'test-math-3',
    title: 'Unit Test - Linear Equations',
    chapter: 'Chapter 1',
    totalQuestions: 25,
    duration: 45,
    totalMarks: 50,
    status: 'completed',
    score: 42,
  },
];

export const mockMathChatHistory: ChatMessage[] = [
  {
    id: 'chat-1',
    role: 'assistant',
    content: 'Hello Pradip! I see you\'re working on quadratic equations. Let\'s solve a problem using the **Quadratic Formula**. Are you ready?',
    timestamp: new Date(Date.now() - 3600000 * 2),
  },
  {
    id: 'chat-2',
    role: 'user',
    content: 'Yes, I\'m ready.',
    timestamp: new Date(Date.now() - 3600000 * 1.9),
  },
  {
    id: 'chat-3',
    role: 'assistant',
    content: 'Great! Let\'s solve the equation: \n\n**2x² - 5x - 3 = 0**\n\nFirst, can you identify the values of **a**, **b**, and **c** in this equation?',
    timestamp: new Date(Date.now() - 3600000 * 1.8),
  },
  {
    id: 'chat-4',
    role: 'user',
    content: 'a = 2, b = -5, and c = -3',
    timestamp: new Date(Date.now() - 3600000 * 1.7),
  },
  {
    id: 'chat-5',
    role: 'assistant',
    content: 'Perfect! Now, do you remember the quadratic formula?',
    timestamp: new Date(Date.now() - 3600000 * 1.6),
  },
  {
    id: 'chat-6',
    role: 'user',
    content: 'x = [-b ± sqrt(b² - 4ac)] / 2a',
    timestamp: new Date(Date.now() - 3600000 * 1.5),
  },
  {
    id: 'chat-7',
    role: 'assistant',
    content: 'That\'s it! Now, substitute the values of a, b, and c into the formula and simplify it. Take your time.',
    timestamp: new Date(Date.now() - 3600000 * 1.4),
  },
  {
    id: 'chat-8',
    role: 'user',
    content: 'x = [5 ± sqrt((-5)² - 4*2*(-3))] / (2*2) \n= [5 ± sqrt(25 + 24)] / 4 \n= [5 ± sqrt(49)] / 4 \n= (5 ± 7) / 4',
    timestamp: new Date(Date.now() - 3600000 * 1.3),
  },
  {
    id: 'chat-9',
    role: 'assistant',
    content: 'Brilliant work, Pradip! You\'ve simplified it perfectly. Now, what are the two possible values for x?',
    timestamp: new Date(Date.now() - 3600000 * 1.2),
  },
  {
    id: 'chat-10',
    role: 'user',
    content: 'x = (5 + 7) / 4 = 12 / 4 = 3 \nand \nx = (5 - 7) / 4 = -2 / 4 = -0.5',
    timestamp: new Date(Date.now() - 3600000 * 1.1),
  },
  {
    id: 'chat-11',
    role: 'assistant',
    content: 'सही छ! Excellent! You\'ve found both correct solutions. \n\n**So, the solutions are x = 3 and x = -0.5.**\n\nGreat job! Would you like to try another problem?',
    timestamp: new Date(Date.now() - 3600000 * 1.0),
  },
];

export const mockMathResources = [
  {
    id: 'res-1',
    title: 'Quadratic Formula Explained (Video)',
    chapter: 'Chapter 2: Quadratic Equations',
    type: 'video',
    url: 'https://youtube.com/example',
    isBookmarked: true,
    recommended: true,
  },
  {
    id: 'res-2',
    title: 'Practice Problems Set - 50 Questions',
    chapter: 'Chapter 2: Quadratic Equations',
    type: 'pdf',
    url: '#',
    isBookmarked: false,
    recommended: true,
  },
  {
    id: 'res-3',
    title: 'SEE Model Questions 2080',
    chapter: 'All Chapters',
    type: 'practice',
    url: '#',
    isBookmarked: true,
    recommended: false,
  },
];

export const mockProgressData = {
  overallProgress: 72,
  completedAssignments: 28,
  totalAssignments: 39,
  streakDays: 14,
  totalPoints: 3250,
  subjectProgress: [
    { subject: 'Mathematics', icon: '📐', progress: 78 },
    { subject: 'Science', icon: '🔬', progress: 65 },
    { subject: 'English', icon: '📚', progress: 82 },
    { subject: 'Nepali', icon: '📖', progress: 70 },
    { subject: 'Social Studies', icon: '🌍', progress: 68 },
    { subject: 'Computer Science', icon: '💻', progress: 75 },
  ],
  recentActivity: [
    { action: 'Completed homework', subject: 'Mathematics', time: '2 hours ago' },
    { action: 'Submitted notes', subject: 'Science', time: '1 day ago' },
    { action: 'Scored 84% in quiz', subject: 'English', time: '2 days ago' },
    { action: 'Completed homework', subject: 'Computer Science', time: '3 days ago' },
  ],
};

export const mockConsultantChat: { id: string; role: 'assistant' | 'user'; content: string; timestamp: Date }[] = [
  {
    id: 'c1',
    role: 'assistant',
    content: 'Hello Madhab! I\'m your academic consultant. I can help you with study planning, career guidance, exam preparation tips, or any general questions. How can I help you today?',
    timestamp: new Date(),
  },
];

export const mockTeacherProfile = {
  id: 'teacher-pradip-001',
  full_name: 'Pradip Ojha',
  email: 'pradip@demo.meroguru.com',
  phone: '+977-9841234567',
  employeeId: 'TCH-2024-042',
  qualification: 'M.Sc. Mathematics, B.Ed',
  experience: 8,
  school: 'Shree Janata Secondary School, Kathmandu',
  subjects: ['math'],
  specializations: ['Algebra', 'Geometry', 'SEE Preparation'],
};

export const mockTeacherStats = {
  totalStudents: 35,
  pendingReviews: 8,
  classAverage: 76,
  activeClasses: 2,
};

export const mockTeacherClasses = [
  {
    id: 'class-9a',
    classId: 'class-9a',
    className: 'Grade 9A - Mathematics',
    grade: 9,
    section: 'A',
    subjectCode: 'math',
    subjectName: 'Mathematics',
    studentCount: 18,
    pendingSubmissions: 5,
    averageScore: 78,
  },
  {
    id: 'class-9b',
    classId: 'class-9b',
    className: 'Grade 9B - Mathematics',
    grade: 9,
    section: 'B',
    subjectCode: 'math',
    subjectName: 'Mathematics',
    studentCount: 17,
    pendingSubmissions: 3,
    averageScore: 74,
  },
];

export const mockRecentSubmissions = [
  {
    id: 'sub-1',
    studentName: 'Madhab Ojha',
    homeworkTitle: 'Quadratic Equations - Exercise 2.3',
    submittedAt: new Date(Date.now() - 3600000),
    status: 'pending_review',
    aiSuggestion: 'Good attempt. Minor error in Q5.',
  },
  {
    id: 'sub-2',
    studentName: 'Priya Sharma',
    homeworkTitle: 'Word Problems Practice',
    submittedAt: new Date(Date.now() - 7200000),
    status: 'pending_review',
    aiSuggestion: 'Excellent work!',
  },
  {
    id: 'sub-3',
    studentName: 'Rohan Adhikari',
    homeworkTitle: 'Quadratic Equations - Exercise 2.3',
    submittedAt: new Date(Date.now() - 10800000),
    status: 'pending_review',
    aiSuggestion: null,
  },
];

export const mockClassStudents = [
  {
    id: 'st-1',
    name: 'Pradip Ojha',
    email: 'madhab@demo.com',
    grade: 9,
    section: 'A',
    averageScore: 85,
    submissionRate: 92,
    lastActive: new Date(Date.now() - 3600000),
    status: 'top',
  },
  {
    id: 'st-2',
    name: 'Priya Sharma',
    email: 'priya@demo.com',
    grade: 9,
    section: 'A',
    averageScore: 78,
    submissionRate: 88,
    lastActive: new Date(Date.now() - 7200000),
    status: 'normal',
  },
  {
    id: 'st-3',
    name: 'Rohan Adhikari',
    email: 'rohan@demo.com',
    grade: 9,
    section: 'A',
    averageScore: 62,
    submissionRate: 75,
    lastActive: new Date(Date.now() - 86400000),
    status: 'attention',
  },
  {
    id: 'st-4',
    name: 'Anjali Tamang',
    email: 'anjali@demo.com',
    grade: 9,
    section: 'B',
    averageScore: 91,
    submissionRate: 98,
    lastActive: new Date(Date.now() - 1800000),
    status: 'top',
  },
  {
    id: 'st-5',
    name: 'Bikash Rai',
    email: 'bikash@demo.com',
    grade: 9,
    section: 'B',
    averageScore: 71,
    submissionRate: 85,
    lastActive: new Date(Date.now() - 86400000 * 2),
    status: 'normal',
  },
];

export const mockAssignments = [
  {
    id: 'asgn-1',
    title: 'Quadratic Equations - Exercise 2.3',
    description: 'Solve problems 1-10',
    chapter: 'Chapter 2',
    className: 'Grade 9A',
    dueDate: new Date(Date.now() + 86400000),
    createdAt: new Date(Date.now() - 86400000 * 2),
    totalStudents: 18,
    submittedCount: 12,
    gradedCount: 0,
  },
  {
    id: 'asgn-2',
    title: 'Linear Equations Revision',
    description: 'Revision exercises from previous chapter',
    chapter: 'Chapter 1',
    className: 'Grade 9A',
    dueDate: new Date(Date.now() - 86400000 * 5),
    createdAt: new Date(Date.now() - 86400000 * 7),
    totalStudents: 18,
    submittedCount: 18,
    gradedCount: 18,
  },
];

export const mockSubmissionsToGrade = [
  {
    id: 'sub-1',
    studentName: 'Pradip Ojha',
    homeworkTitle: 'Quadratic Equations - Exercise 2.3',
    submittedAt: new Date(Date.now() - 3600000),
    aiSuggestion: 'Score: 85/100. Good work on factorization.',
  },
];

export const mockTodaysLessonPlans = [
  {
    id: 'lp-1',
    className: 'Grade 9A - Mathematics',
    classId: 'class-9a',
    date: new Date(),
    topics: ['Quadratic Formula', 'Completing the Square'],
    weakAreas: ['Students struggle with negative discriminant cases', 'Word problem application'],
    aiRecommendation: 'Start with a quick 5-min recap of factorization before introducing the formula. Use visual graphs to explain.',
    studentQueries: [
      { studentName: 'Madhab Ojha', query: 'When do we use quadratic formula vs factorization?', topic: 'Quadratic Equations' },
      { studentName: 'Priya Sharma', query: 'I dont understand what discriminant means', topic: 'Quadratic Equations' },
    ],
    status: 'upcoming',
  },
];

export const mockStudentQueries = [
  {
    id: 'q-1',
    studentName: 'Madhab Ojha',
    query: 'When do we use quadratic formula vs factorization?',
    topic: 'Quadratic Equations',
    status: 'pending',
    askedAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'q-2',
    studentName: 'Rohan Adhikari',
    query: 'Can quadratic equations have no solution?',
    topic: 'Quadratic Equations',
    status: 'pending',
    askedAt: new Date(Date.now() - 43200000),
  },
];

export const mockDailyDoses = [
  {
    id: 'dd-1',
    title: 'Effective Strategies for Teaching Quadratic Equations',
    description: 'Research-backed methods to help students visualize quadratic functions and their roots.',
    topics: ['Visualization', 'Common Misconceptions', 'Real-world Applications'],
    estimatedTime: 12,
    source: 'Mathematics Teaching Journal',
    completed: false,
  },
  {
    id: 'dd-2',
    title: 'Handling Different Learning Paces in Math Class',
    description: 'Strategies for differentiated instruction when students have varying comprehension speeds.',
    topics: ['Differentiated Learning', 'Classroom Management'],
    estimatedTime: 8,
    source: 'EdTech Weekly',
    completed: true,
  },
];

export const mockTeacherAssessments = [
  {
    id: 'ta-1',
    title: 'Quadratic Equations - Subject Mastery Test',
    totalQuestions: 25,
    duration: 30,
    status: 'available',
    scheduledDate: null,
    score: undefined,
  },
  {
    id: 'ta-2',
    title: 'Classroom Management Skills',
    totalQuestions: 20,
    duration: 25,
    status: 'completed',
    scheduledDate: new Date(Date.now() - 604800000),
    score: 88,
  },
];

export const mockPortfolioMetrics = [
  { category: 'Daily Dose', metric: 'Completion Rate', value: 85, maxValue: 100, trend: 'up' },
  { category: 'Assessment', metric: 'Avg Score', value: 82, maxValue: 100, trend: 'stable' },
  { category: 'Queries', metric: 'Resolution', value: 94, maxValue: 100, trend: 'up' },
  { category: 'Lessons', metric: 'Completed', value: 48, maxValue: 52, trend: 'stable' },
  { category: 'Feedback', metric: 'Student Rating', value: 4.2, maxValue: 5, trend: 'up' },
  { category: 'Attendance', metric: 'Present Days', value: 95, maxValue: 100, trend: 'stable' },
];

export const mockLearningInsights = [
  {
    subjectId: 'math',
    progressTrend: 'improving',
    engagementLevel: 'high',
    strengths: ['Factorization', 'Problem Solving'],
    weaknesses: ['Word Problems', 'Negative Discriminants'],
    topicsToFocus: ['Quadratic Formula Applications', 'Graphing Inequalities'],
    recommendedResources: ['Video: Advanced Factorization', 'Practice: Word Problems Set 2'],
  },
  {
    subjectId: 'science',
    progressTrend: 'stable',
    engagementLevel: 'medium',
    strengths: ['Chemical Reactions', 'Lab Safety'],
    weaknesses: ['Physics Formulas', 'Biology Diagrams'],
    topicsToFocus: ['Newton\'s Laws of Motion', 'Cellular Respiration'],
    recommendedResources: ['PDF: Physics Formula Sheet', 'Interactive Cell Diagram'],
  },
];

export const mockRecentActivityForProfile = [
  {
    id: 'act-1',
    type: 'test_completed',
    description: 'Scored 42/50 in Unit Test - Linear Equations',
    date: new Date(Date.now() - 86400000 * 2),
    subjectId: 'math',
  },
  {
    id: 'act-2',
    type: 'homework_submitted',
    description: 'Submitted Graph Plotting Assignment',
    date: new Date(Date.now() - 86400000 * 10),
    subjectId: 'math',
  },
  {
    id: 'act-3',
    type: 'note_verified',
    description: 'Note "Quadratic Formula" was verified',
    date: new Date(Date.now() - 86400000 * 2),
    subjectId: 'math',
  },
  {
    id: 'act-4',
    type: 'tutor_session',
    description: 'Had a tutor session about Factorization',
    date: new Date(Date.now() - 1400000),
    subjectId: 'math',
  },
  {
    id: 'act-5',
    type: 'resource_accessed',
    description: 'Accessed "Quadratic Formula Explained (Video)"',
    date: new Date(Date.now() - 86400000),
    subjectId: 'math',
  },
];

export const dailyDoseHistory = [
  {
    id: 'dd-1',
    title: 'Effective Strategies for Teaching Quadratic Equations',
    source: 'Mathematics Teaching Journal',
    status: 'pending',
    assignedDate: new Date(Date.now() - 86400000 * 2),
    estimatedTime: 12,
    completedAt: null,
    topics: ['Visualization', 'Common Misconceptions', 'Real-world Applications'],
  },
  {
    id: 'dd-2',
    title: 'Handling Different Learning Paces in Math Class',
    source: 'EdTech Weekly',
    status: 'completed',
    assignedDate: new Date(Date.now() - 86400000 * 3),
    estimatedTime: 8,
    completedAt: new Date(Date.now() - 86400000 * 3),
    topics: ['Differentiated Learning', 'Classroom Management'],
  },
];

export const assessmentHistory = [
  {
    id: 'ta-1',
    title: 'Quadratic Equations - Subject Mastery Test',
    date: new Date(),
    score: undefined,
    status: 'available',
    performanceLevel: undefined,
    topics: ['Quadratic Formula', 'Factorization', 'Discriminants'],
  },
  {
    id: 'ta-2',
    title: 'Classroom Management Skills',
    date: new Date(Date.now() - 604800000),
    score: 88,
    status: 'completed',
    performanceLevel: 'excellent',
    topics: ['Conflict Resolution', 'Student Engagement'],
  },
];

export const queryAddressHistory = [
  {
    id: 'q-1',
    studentName: 'Pradip Ojha',
    query: 'When do we use quadratic formula vs factorization?',
    topic: 'Quadratic Equations',
    status: 'addressed',
    studentFeedback: 'understood',
    askedAt: new Date(Date.now() - 86400000 * 2),
    addressedAt: new Date(Date.now() - 86400000),
    addedToPortfolio: false,
  },
  {
    id: 'issue-1',
    studentName: 'Pradip Ojha',
    query: 'I still dont understand completing the square method',
    topic: 'Quadratic Equations',
    status: 'not_addressed',
    studentFeedback: 'still_confused',
    askedAt: new Date(Date.now() - 604800000),
    addressedAt: null,
    addedToPortfolio: true,
  },
];

export const lessonPlanHistory = [
  {
    id: 'lp-1',
    className: 'Grade 9A - Mathematics',
    date: new Date(),
    status: 'upcoming',
    feedbackScore: null,
    topicsPlanned: ['Quadratic Formula', 'Completing the Square'],
    topicsCovered: [],
    queriesAssigned: 2,
    queriesAddressed: 0,
  },
  {
    id: 'lp-2',
    className: 'Grade 9A - Mathematics',
    date: new Date(Date.now() - 86400000),
    status: 'completed',
    feedbackScore: 4.5,
    topicsPlanned: ['Factorization Method'],
    topicsCovered: ['Factorization Method'],
    queriesAssigned: 1,
    queriesAddressed: 1,
  },
];

export const mockPortfolioIssues = [
  {
    id: 'issue-1',
    studentName: 'Pradip Ojha',
    query: 'I still dont understand completing the square method',
    status: 'not_addressed',
    studentFeedback: 'still_confused',
    askedAt: new Date(Date.now() - 604800000),
  },
];
