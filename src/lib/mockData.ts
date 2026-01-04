import { Subject, Student, Homework, Note, Test, ChatMessage, Resource, PendingTask } from './types';

export const currentStudent: Student = {
  id: 'student-1',
  name: 'Aarav Sharma',
  grade: 9,
  section: 'A',
  school: 'Shree Janata Secondary School',
  streakDays: 12,
  totalPoints: 2450,
};

export const subjects: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    nameNepali: 'गणित',
    teacher: 'Mr. Ram Prasad',
    icon: '📐',
    color: 'math',
    pendingHomework: 2,
    pendingNotes: 1,
    upcomingTests: 1,
  },
  {
    id: 'science',
    name: 'Science',
    nameNepali: 'विज्ञान',
    teacher: 'Mrs. Sita Devi',
    icon: '🔬',
    color: 'science',
    pendingHomework: 1,
    pendingNotes: 0,
    upcomingTests: 0,
  },
  {
    id: 'english',
    name: 'English',
    nameNepali: 'अंग्रेजी',
    teacher: 'Mr. Krishna Adhikari',
    icon: '📚',
    color: 'english',
    pendingHomework: 0,
    pendingNotes: 2,
    upcomingTests: 1,
  },
  {
    id: 'nepali',
    name: 'Nepali',
    nameNepali: 'नेपाली',
    teacher: 'Mrs. Laxmi Thapa',
    icon: '📖',
    color: 'nepali',
    pendingHomework: 1,
    pendingNotes: 0,
    upcomingTests: 0,
  },
  {
    id: 'social',
    name: 'Social Studies',
    nameNepali: 'सामाजिक अध्ययन',
    teacher: 'Mr. Hari Bahadur',
    icon: '🌍',
    color: 'social',
    pendingHomework: 0,
    pendingNotes: 1,
    upcomingTests: 0,
  },
  {
    id: 'computer',
    name: 'Computer Science',
    nameNepali: 'कम्प्युटर विज्ञान',
    teacher: 'Mr. Sunil Karki',
    icon: '💻',
    color: 'computer',
    pendingHomework: 1,
    pendingNotes: 0,
    upcomingTests: 1,
  },
];

export const homeworks: Homework[] = [
  {
    id: 'hw-1',
    subjectId: 'math',
    title: 'Quadratic Equations Practice',
    description: 'Solve problems 1-10 from Exercise 2.3',
    chapter: 'Chapter 2: Quadratic Equations',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
    assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    status: 'pending',
  },
  {
    id: 'hw-2',
    subjectId: 'math',
    title: 'Word Problems',
    description: 'Complete word problems from page 45',
    chapter: 'Chapter 2: Quadratic Equations',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'pending',
  },
  {
    id: 'hw-3',
    subjectId: 'science',
    title: 'Chemical Reactions Lab Report',
    description: 'Write observations from today\'s experiment',
    chapter: 'Chapter 5: Chemical Reactions',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    assignedDate: new Date(Date.now()),
    status: 'pending',
  },
  {
    id: 'hw-4',
    subjectId: 'nepali',
    title: 'निबन्ध लेखन',
    description: '"मेरो देश नेपाल" विषयमा निबन्ध लेख्नुहोस्',
    chapter: 'एकाइ ४: निबन्ध',
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday - overdue
    assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    status: 'pending',
  },
  {
    id: 'hw-5',
    subjectId: 'computer',
    title: 'HTML Practice',
    description: 'Create a simple webpage with forms',
    chapter: 'Chapter 3: HTML & CSS',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
    assignedDate: new Date(Date.now()),
    status: 'pending',
  },
];

export const notes: Note[] = [
  {
    id: 'note-1',
    subjectId: 'math',
    chapter: 'Chapter 2: Quadratic Equations',
    topic: 'Factorization Method',
    isCompleted: false,
    verified: false,
  },
  {
    id: 'note-2',
    subjectId: 'english',
    chapter: 'Chapter 3: Grammar',
    topic: 'Tenses - Past Perfect',
    isCompleted: false,
    verified: false,
  },
  {
    id: 'note-3',
    subjectId: 'english',
    chapter: 'Chapter 4: Literature',
    topic: 'Poetry Analysis',
    isCompleted: false,
    verified: false,
  },
  {
    id: 'note-4',
    subjectId: 'social',
    chapter: 'Chapter 6: Civics',
    topic: 'Constitution of Nepal',
    isCompleted: false,
    verified: false,
  },
];

export const tests: Test[] = [
  {
    id: 'test-1',
    subjectId: 'math',
    title: 'Unit Test - Quadratic Equations',
    chapter: 'Chapter 2',
    totalQuestions: 20,
    duration: 45,
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    totalMarks: 50,
    status: 'upcoming',
  },
  {
    id: 'test-2',
    subjectId: 'english',
    title: 'Grammar Quiz',
    chapter: 'Chapter 3',
    totalQuestions: 15,
    duration: 30,
    totalMarks: 30,
    status: 'available',
  },
  {
    id: 'test-3',
    subjectId: 'computer',
    title: 'HTML Basics Quiz',
    chapter: 'Chapter 3',
    totalQuestions: 10,
    duration: 20,
    totalMarks: 20,
    status: 'available',
  },
];

export const sampleChatHistory: Record<string, ChatMessage[]> = {
  math: [
    {
      id: 'msg-1',
      role: 'assistant',
      content: 'नमस्ते Aarav! I\'m your Mathematics tutor. I\'m here to help you understand concepts, not just solve problems. What would you like to learn today?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: 'msg-2',
      role: 'user',
      content: 'Can you help me solve x² - 5x + 6 = 0?',
      timestamp: new Date(Date.now() - 1000 * 60 * 28),
    },
    {
      id: 'msg-3',
      role: 'assistant',
      content: 'I\'d love to help you understand how to solve this! Instead of giving you the answer directly, let me teach you the factorization method.\n\n**Step 1:** We need to find two numbers that:\n- Multiply to give +6 (the constant term)\n- Add to give -5 (the coefficient of x)\n\n**Think:** What two numbers multiply to 6 and add to -5?\n\nTry to figure this out, and I\'ll guide you from there! 🤔',
      timestamp: new Date(Date.now() - 1000 * 60 * 26),
    },
  ],
};

export const resources: Resource[] = [
  {
    id: 'res-1',
    subjectId: 'math',
    chapter: 'Chapter 2: Quadratic Equations',
    title: 'Quadratic Formula Explained',
    type: 'video',
    url: '#',
    isBookmarked: true,
    recommended: true,
  },
  {
    id: 'res-2',
    subjectId: 'math',
    chapter: 'Chapter 2: Quadratic Equations',
    title: 'Practice Problems Set',
    type: 'pdf',
    url: '#',
    isBookmarked: false,
    recommended: true,
  },
  {
    id: 'res-3',
    subjectId: 'science',
    chapter: 'Chapter 5: Chemical Reactions',
    title: 'Balancing Equations Tutorial',
    type: 'video',
    url: '#',
    isBookmarked: false,
    recommended: true,
  },
];

export const getPendingTasks = (): PendingTask[] => {
  const tasks: PendingTask[] = [];
  const now = new Date();

  homeworks
    .filter((hw) => hw.status === 'pending')
    .forEach((hw) => {
      tasks.push({
        id: hw.id,
        type: 'homework',
        subjectId: hw.subjectId,
        title: hw.title,
        dueDate: hw.dueDate,
        isOverdue: hw.dueDate < now,
      });
    });

  notes
    .filter((note) => !note.isCompleted)
    .forEach((note) => {
      tasks.push({
        id: note.id,
        type: 'notes',
        subjectId: note.subjectId,
        title: note.topic,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // Default 1 week
        isOverdue: false,
      });
    });

  tests
    .filter((test) => test.status !== 'completed')
    .forEach((test) => {
      tasks.push({
        id: test.id,
        type: 'test',
        subjectId: test.subjectId,
        title: test.title,
        dueDate: test.scheduledDate || new Date(),
        isOverdue: false,
      });
    });

  return tasks.sort((a, b) => {
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;
    return a.dueDate.getTime() - b.dueDate.getTime();
  });
};

export const getSubjectById = (id: string): Subject | undefined => {
  return subjects.find((s) => s.id === id);
};

export const getHomeworkBySubject = (subjectId: string): Homework[] => {
  return homeworks.filter((hw) => hw.subjectId === subjectId);
};

export const getNotesBySubject = (subjectId: string): Note[] => {
  return notes.filter((note) => note.subjectId === subjectId);
};

export const getTestsBySubject = (subjectId: string): Test[] => {
  return tests.filter((test) => test.subjectId === subjectId);
};

export const getResourcesBySubject = (subjectId: string): Resource[] => {
  return resources.filter((res) => res.subjectId === subjectId);
};