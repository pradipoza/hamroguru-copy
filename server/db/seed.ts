import * as dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { db } from './index';
import {
  users,
  profiles,
  userRoles,
  schools,
  classes,
  subjects,
  studentProfiles,
  teacherProfiles,
  teacherClassAssignments,
  homeworkAssignments,
  homeworkSubmissions,
  tests,
  testResults,
  studentNotes,
  studentLearningInsights,
  resources,
  lessonPlans,
  dailyDoses,
  teacherAssessments,
  studentQueries,
  aiTutorSessions,
  teacherPortfolio,
  webhookLogs,
  subjectTextbookEmbeddings,
} from './schema';
import { DEFAULT_CLASS, DEFAULT_SCHOOL } from '../lib/config';
import { and, eq, inArray } from 'drizzle-orm';

const mulberry32 = (seed: number) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const rng = mulberry32(20260129);
const randInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
const pick = <T>(items: T[]) => items[Math.floor(rng() * items.length)];
const pickMany = <T>(items: T[], count: number) => {
  const copy = [...items];
  const picked: T[] = [];
  while (picked.length < count && copy.length > 0) {
    const idx = Math.floor(rng() * copy.length);
    picked.push(copy.splice(idx, 1)[0]);
  }
  return picked;
};

const addDays = (date: Date, days: number) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '.');
const makeVector = (length: number) => Array.from({ length }, () => Number((rng() * 2 - 1).toFixed(6)));

const seedSubjects = async () => {
  const existingSubjects = await db.select().from(subjects);
  if (existingSubjects.length > 0) {
    return existingSubjects;
  }

  const inserted = await db.insert(subjects).values([
    {
      name: 'Mathematics',
      nameNepali: 'गणित',
      code: 'math',
      gradeLevel: 10,
      description: 'Basic and advanced mathematics',
      icon: 'calculator',
      color: 'math',
    },
    {
      name: 'Science',
      nameNepali: 'विज्ञान',
      code: 'science',
      gradeLevel: 10,
      description: 'Natural and physical sciences',
      icon: 'flask',
      color: 'science',
    },
    {
      name: 'English',
      nameNepali: 'अंग्रेजी',
      code: 'english',
      gradeLevel: 10,
      description: 'English language and literature',
      icon: 'book-open',
      color: 'english',
    },
    {
      name: 'Nepali',
      nameNepali: 'नेपाली',
      code: 'nepali',
      gradeLevel: 10,
      description: 'Nepali language and literature',
      icon: 'languages',
      color: 'nepali',
    },
    {
      name: 'Social Studies',
      nameNepali: 'सामाजिक अध्ययन',
      code: 'social',
      gradeLevel: 10,
      description: 'History, geography, and civics',
      icon: 'globe',
      color: 'social',
    },
    {
      name: 'Computer Science',
      nameNepali: 'कम्प्युटर विज्ञान',
      code: 'computer',
      gradeLevel: 10,
      description: 'Computer fundamentals and programming',
      icon: 'laptop',
      color: 'computer',
    },
  ]).returning();

  return inserted;
};

const ensureSchoolAndClass = async (classStartDate: Date) => {
  let [school] = await db
    .select()
    .from(schools)
    .where(eq(schools.name, DEFAULT_SCHOOL.name));

  if (!school) {
    [school] = await db.insert(schools).values({
      name: DEFAULT_SCHOOL.name,
      address: DEFAULT_SCHOOL.address,
      type: DEFAULT_SCHOOL.type,
      contactPhone: DEFAULT_SCHOOL.contactPhone,
      contactEmail: DEFAULT_SCHOOL.contactEmail,
      createdAt: classStartDate,
      updatedAt: classStartDate,
    }).returning();
  }

  let [schoolClass] = await db
    .select()
    .from(classes)
    .where(and(
      eq(classes.schoolId, school.id),
      eq(classes.grade, DEFAULT_CLASS.grade),
      eq(classes.section, DEFAULT_CLASS.section),
      eq(classes.academicYear, DEFAULT_CLASS.academicYear)
    ));

  if (!schoolClass) {
    [schoolClass] = await db.insert(classes).values({
      schoolId: school.id,
      grade: DEFAULT_CLASS.grade,
      section: DEFAULT_CLASS.section,
      academicYear: DEFAULT_CLASS.academicYear,
      createdAt: classStartDate,
      updatedAt: classStartDate,
    }).returning();
  }

  return { school, schoolClass };
};

const seedAcademicData = async () => {
  const existingSeedUsers = await db
    .select()
    .from(userRoles)
    .where(inArray(userRoles.role, ['student', 'teacher']))
    .limit(1);

  if (existingSeedUsers.length > 0) {
    console.log('Teachers/students already seeded. Skipping...');
    return;
  }

  const now = new Date();
  const classStartDate = addDays(now, -60);
  const subjectsData = await seedSubjects();
  const subjectByCode = new Map(subjectsData.map((subject) => [subject.code, subject]));
  const { school, schoolClass } = await ensureSchoolAndClass(classStartDate);

  const teacherSeed = [
    { fullName: 'Ram Prasad Adhikari', qualification: 'M.Ed. Mathematics', yearsExperience: 12, subjectCode: 'math' },
    { fullName: 'Sita Devi Kandel', qualification: 'M.Sc. Physics', yearsExperience: 9, subjectCode: 'science' },
    { fullName: 'Krishna Raj Sharma', qualification: 'M.A. English', yearsExperience: 10, subjectCode: 'english' },
    { fullName: 'Laxmi Kumari Thapa', qualification: 'M.A. Nepali', yearsExperience: 11, subjectCode: 'nepali' },
    { fullName: 'Hari Bahadur Gurung', qualification: 'M.Ed. Social Studies', yearsExperience: 14, subjectCode: 'social' },
    { fullName: 'Sunil Manandhar', qualification: 'M.Sc. Computer Science', yearsExperience: 7, subjectCode: 'computer' },
  ];

  const teacherPassword = await bcrypt.hash('Teacher@123', 10);
  const teacherUsers = teacherSeed.map((teacher, index) => ({
    email: `${slugify(teacher.fullName)}@hamroguru.edu.np`,
    password: teacherPassword,
  }));
  const insertedTeachers = await db.insert(users).values(teacherUsers).returning();

  await db.insert(profiles).values(insertedTeachers.map((teacher, index) => ({
    id: teacher.id,
    fullName: teacherSeed[index].fullName,
    phone: `+977-98${randInt(10000000, 99999999)}`,
    createdAt: addDays(classStartDate, randInt(0, 5)),
    updatedAt: addDays(classStartDate, randInt(20, 55)),
  })));

  await db.insert(userRoles).values(insertedTeachers.map((teacher) => ({
    userId: teacher.id,
    role: 'teacher',
    createdAt: classStartDate,
  })));

  const teacherProfilesData = insertedTeachers.map((teacher, index) => ({
    userId: teacher.id,
    schoolId: school.id,
    employeeId: `T-${1001 + index}`,
    qualification: teacherSeed[index].qualification,
    subjectsTaught: [subjectByCode.get(teacherSeed[index].subjectCode)?.name || ''],
    yearsExperience: teacherSeed[index].yearsExperience,
    joinDate: classStartDate.toISOString().split('T')[0], // Convert to date string YYYY-MM-DD
    createdAt: classStartDate,
    updatedAt: addDays(classStartDate, randInt(10, 50)),
  }));
  await db.insert(teacherProfiles).values(teacherProfilesData);

  await db.insert(teacherClassAssignments).values(teacherSeed.map((teacher, index) => {
    const subject = subjectByCode.get(teacher.subjectCode);
    if (!subject) {
      throw new Error(`Missing subject for ${teacher.subjectCode}`);
    }
    return {
      teacherId: insertedTeachers[index].id,
      classId: schoolClass.id,
      subjectId: subject.id,
      academicYear: schoolClass.academicYear,
      createdAt: classStartDate,
    };
  }));

  const studentNames = [
    'Aarav Sharma',
    'Pooja Adhikari',
    'Sanjay Karki',
    'Nisha Gurung',
    'Prabin Shrestha',
    'Shruti Khatri',
    'Niraj Bhandari',
    'Sushma Rai',
    'Bikash Thapa',
    'Ritika Poudel',
    'Anil Joshi',
    'Suyog Tamang',
    'Rojina Basnet',
    'Kiran Gautam',
    'Anusha Lama',
    'Dipesh Acharya',
    'Nirmala Khadka',
    'Bibek Dahal',
    'Isha Shahi',
    'Roshan Baral',
    'Manisha Ghimire',
    'Sagar Bhusal',
    'Samikshya Maharjan',
    'Ujjwal Pandey',
    'Sneha Regmi',
    'Ritesh Magar',
    'Sabina KC',
    'Sanjeev Panta',
    'Aashish Chaudhary',
    'Lina Roka',
  ];

  const learningStyles = ['visual', 'auditory', 'reading', 'kinesthetic'];
  const studyGoals = [
    'Prepare for SEE and score 3.6+ GPA',
    'Strengthen fundamentals for +2 science entrance',
    'Improve consistency and avoid missing assignments',
    'Build confidence in problem solving',
  ];
  const studyTimes = [
    'Early Morning (6-8 AM)',
    'Evening (6-8 PM)',
    'Night (8-10 PM)',
    'Afternoon (2-4 PM)',
  ];
  const motivationTriggers = ['parent check-ins', 'short quizzes', 'reward points', 'peer competition', 'project work'];
  const supportNeeds = ['step-by-step examples', 'extra practice sets', 'concept revision', 'visual aids', 'frequent feedback'];
  const interests = ['football', 'music', 'drawing', 'coding', 'debate', 'dance', 'reading', 'cricket', 'science fairs'];

  const studentPassword = await bcrypt.hash('Student@123', 10);
  const studentUsers = studentNames.map((name, index) => ({
    email: `${slugify(name)}.${index + 1}@student.hamroguru.edu.np`,
    password: studentPassword,
  }));
  const insertedStudents = await db.insert(users).values(studentUsers).returning();

  await db.insert(profiles).values(insertedStudents.map((student, index) => ({
    id: student.id,
    fullName: studentNames[index],
    phone: `+977-98${randInt(10000000, 99999999)}`,
    createdAt: addDays(classStartDate, randInt(0, 10)),
    updatedAt: addDays(classStartDate, randInt(15, 55)),
  })));

  await db.insert(userRoles).values(insertedStudents.map((student) => ({
    userId: student.id,
    role: 'student',
    createdAt: classStartDate,
  })));

  const studentProfilesData = insertedStudents.map((student, index) => {
    const tier = index < 5 ? 'top' : index < 20 ? 'mid' : 'weak';
    const baseScore = tier === 'top' ? randInt(88, 97) : tier === 'mid' ? randInt(66, 84) : randInt(40, 64);
    const streakDays = tier === 'top' ? randInt(20, 35) : tier === 'mid' ? randInt(10, 25) : randInt(3, 12);
    const totalPoints = Math.max(300, Math.round(baseScore * 22 + randInt(-120, 300)));
    const learningStyle = pick(learningStyles);
    const learningProfile = {
      preferredStudyTime: pick(studyTimes),
      studyGoal: pick(studyGoals),
      learningPace: pick(['fast', 'steady', 'needs reinforcement']),
      attentionSpanMinutes: randInt(20, 55),
      motivationTriggers: pickMany(motivationTriggers, 2),
      supportNeeds: pickMany(supportNeeds, 2),
      tutoringPreference: pick(['1:1', 'small group', 'guided self-study']),
      deviceAccess: pick(['shared smartphone', 'personal smartphone', 'laptop at home']),
      languagePreference: pick(['Nepali', 'English', 'Mix']),
      noteTakingStyle: pick(['outline', 'mind-map', 'cornell', 'flashcards']),
      confidenceBySubject: {
        math: Math.max(30, Math.min(95, baseScore + randInt(-10, 8))),
        science: Math.max(30, Math.min(95, baseScore + randInt(-12, 10))),
        english: Math.max(30, Math.min(95, baseScore + randInt(-8, 12))),
        nepali: Math.max(30, Math.min(95, baseScore + randInt(-8, 12))),
        social: Math.max(30, Math.min(95, baseScore + randInt(-6, 10))),
        computer: Math.max(30, Math.min(95, baseScore + randInt(-5, 12))),
      },
      strengths: tier === 'top'
        ? ['quick recall', 'problem solving', 'consistent practice']
        : tier === 'mid'
        ? ['steady progress', 'good class participation']
        : ['curious in class', 'improves with guidance'],
      weakPoints: tier === 'weak'
        ? ['concept retention', 'time management']
        : tier === 'mid'
        ? ['exam pressure', 'needs revision']
        : ['silly mistakes under speed'],
    };

    return {
      userId: student.id,
      classId: schoolClass.id,
      rollNumber: index + 1,
      learningStyle,
      learningProfile,
      goals: pickMany(studyGoals, 2),
      interests: pickMany(interests, 2),
      parentContact: `+977-98${randInt(10000000, 99999999)}`,
      address: pick(['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan']),
      streakDays,
      totalPoints,
      createdAt: addDays(classStartDate, randInt(0, 8)),
      updatedAt: addDays(classStartDate, randInt(25, 55)),
    };
  });

  await db.insert(studentProfiles).values(studentProfilesData);

  const assignmentsCatalog: Record<string, { title: string; description: string; chapter: string }[]> = {
    math: [
      { title: 'Quadratic Equations Practice', description: 'Solve Exercise 2.1 and 2.2', chapter: 'Chapter 2' },
      { title: 'Linear Equations Review', description: 'Mixed word problems', chapter: 'Chapter 1' },
      { title: 'Polynomial Factorization', description: 'Factorize expressions 1-12', chapter: 'Chapter 3' },
    ],
    science: [
      { title: 'Chemical Reactions Report', description: 'Lab observations and conclusions', chapter: 'Chapter 5' },
      { title: 'Physics Motion Worksheet', description: 'Solve numericals 1-15', chapter: 'Chapter 4' },
      { title: 'Acids and Bases Notes', description: 'Summarize key concepts', chapter: 'Chapter 6' },
    ],
    english: [
      { title: 'Grammar Quiz Prep', description: 'Practice tense exercises', chapter: 'Chapter 3' },
      { title: 'Essay: My Village', description: 'Write 250 words essay', chapter: 'Chapter 2' },
      { title: 'Reading Comprehension', description: 'Answer questions from Unit 4', chapter: 'Chapter 4' },
    ],
    nepali: [
      { title: 'निबन्ध लेखन', description: '"मेरो देश नेपाल" विषयमा निबन्ध लेख्नुहोस्', chapter: 'एकाइ ४' },
      { title: 'व्याकरण अभ्यास', description: 'कारक सम्बन्धी अभ्यास', chapter: 'एकाइ ३' },
      { title: 'कविता विश्लेषण', description: 'पाठ ६ को कविता विश्लेषण', chapter: 'एकाइ ६' },
    ],
    social: [
      { title: 'Constitution Summary', description: 'Summarize key articles', chapter: 'Chapter 6' },
      { title: 'Geography Map Work', description: 'Label provinces and rivers', chapter: 'Chapter 4' },
      { title: 'Civic Duties', description: 'Short notes with examples', chapter: 'Chapter 5' },
    ],
    computer: [
      { title: 'HTML Basics', description: 'Create a simple webpage', chapter: 'Chapter 3' },
      { title: 'Algorithms Flowchart', description: 'Draw flowchart for tasks', chapter: 'Chapter 2' },
      { title: 'Spreadsheet Practice', description: 'Create table with formulas', chapter: 'Chapter 1' },
    ],
  };

  const teacherBySubject = new Map<string, string>();
  teacherSeed.forEach((teacher, index) => {
    teacherBySubject.set(teacher.subjectCode, insertedTeachers[index].id);
  });

  const assignmentRows: any[] = [];
  Object.entries(assignmentsCatalog).forEach(([subjectCode, templates], subjectIndex) => {
    const subject = subjectByCode.get(subjectCode);
    if (!subject) return;
    templates.forEach((template, index) => {
      const baseDue = addDays(classStartDate, 12 + subjectIndex * 3 + index * 10);
      const dueDate = baseDue > now ? baseDue : index === templates.length - 1 ? addDays(now, randInt(5, 14)) : baseDue;
      assignmentRows.push({
        classId: schoolClass.id,
        subjectId: subject.id,
        teacherId: teacherBySubject.get(subjectCode) || null,
        title: template.title,
        description: template.description,
        chapter: template.chapter,
        dueDate,
        createdAt: addDays(dueDate, -5),
        updatedAt: addDays(dueDate, -2),
      });
    });
  });

  const insertedAssignments = await db.insert(homeworkAssignments).values(assignmentRows).returning();

  const studentTier = new Map<string, 'top' | 'mid' | 'weak'>();
  insertedStudents.forEach((student, index) => {
    studentTier.set(student.id, index < 5 ? 'top' : index < 20 ? 'mid' : 'weak');
  });

  const homeworkSubmissionRows: any[] = [];
  insertedAssignments.forEach((assignment) => {
    insertedStudents.forEach((student, index) => {
      const tier = studentTier.get(student.id) || 'mid';
      const submissionChance = tier === 'top' ? 0.95 : tier === 'mid' ? 0.8 : 0.6;
      if (rng() > submissionChance) {
        if (assignment.dueDate < now && rng() < 0.4) {
          homeworkSubmissionRows.push({
            assignmentId: assignment.id,
            studentId: student.id,
            status: 'missed',
            score: null,
            submittedAt: null,
            createdAt: assignment.dueDate,
            updatedAt: assignment.dueDate,
          });
        }
        return;
      }

      const late = assignment.dueDate < now && rng() < (tier === 'weak' ? 0.35 : 0.15);
      const statusPool = assignment.dueDate < now
        ? late ? 'late' : rng() < 0.55 ? 'checked' : 'submitted'
        : 'submitted';

      const baseScore = tier === 'top' ? randInt(8, 10) : tier === 'mid' ? randInt(6, 9) : randInt(3, 7);
      const score = statusPool === 'submitted' || statusPool === 'checked' ? baseScore : null;

      homeworkSubmissionRows.push({
        assignmentId: assignment.id,
        studentId: student.id,
        submittedAt: late ? addDays(assignment.dueDate, randInt(1, 3)) : addDays(assignment.dueDate, -randInt(0, 2)),
        status: statusPool,
        score,
        aiFeedback: score && score >= 8 ? { summary: 'Great work, keep practicing!' } : null,
        teacherFeedback: score && score < 6 ? 'Needs more practice on key steps.' : null,
        createdAt: assignment.dueDate,
        updatedAt: assignment.dueDate,
      });
    });
  });

  if (homeworkSubmissionRows.length > 0) {
    await db.insert(homeworkSubmissions).values(homeworkSubmissionRows);
  }

  const testRows: any[] = [];
  Object.entries(assignmentsCatalog).forEach(([subjectCode], subjectIndex) => {
    const subject = subjectByCode.get(subjectCode);
    if (!subject) return;
    const completedDate = addDays(classStartDate, 18 + subjectIndex * 4);
    const upcomingDate = addDays(now, 7 + subjectIndex);
    testRows.push({
      classId: schoolClass.id,
      subjectId: subject.id,
      teacherId: teacherBySubject.get(subjectCode) || null,
      title: `${subject.name} Unit Test`,
      chapter: `Unit ${subjectIndex + 1}`,
      type: 'unit',
      totalQuestions: 20,
      totalMarks: 100,
      duration: 60,
      scheduledDate: completedDate,
      status: 'completed',
      createdAt: addDays(completedDate, -6),
    });
    testRows.push({
      classId: schoolClass.id,
      subjectId: subject.id,
      teacherId: teacherBySubject.get(subjectCode) || null,
      title: `${subject.name} Weekly Quiz`,
      chapter: `Unit ${subjectIndex + 2}`,
      type: 'quiz',
      totalQuestions: 10,
      totalMarks: 50,
      duration: 30,
      scheduledDate: upcomingDate,
      status: 'upcoming',
      createdAt: addDays(now, -3),
    });
  });

  const insertedTests = await db.insert(tests).values(testRows).returning();

  const completedTests = insertedTests.filter((test) => test.status === 'completed');
  const testResultRows: any[] = [];
  completedTests.forEach((test) => {
    insertedStudents.forEach((student, index) => {
      const tier = studentTier.get(student.id) || 'mid';
      const basePercent = tier === 'top' ? randInt(78, 96) : tier === 'mid' ? randInt(60, 82) : randInt(35, 65);
      const score = Math.max(15, Math.round((basePercent / 100) * (test.totalMarks || 100)));
      const percentage = ((score / (test.totalMarks || 100)) * 100).toFixed(2);
      testResultRows.push({
        testId: test.id,
        studentId: student.id,
        score,
        percentage,
        grade: score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : 'D',
        topicScores: { fundamentals: score, application: Math.max(10, score - 10) },
        weakAreas: score < 60 ? ['concept clarity', 'time management'] : [],
        completedAt: addDays(test.scheduledDate || classStartDate, randInt(0, 2)),
      });
    });
  });

  if (testResultRows.length > 0) {
    await db.insert(testResults).values(testResultRows);
  }

  const noteRows: any[] = [];
  insertedStudents.forEach((student, index) => {
    const tier = studentTier.get(student.id) || 'mid';
    const subjectCodes = pickMany(Array.from(subjectByCode.keys()), 2);
    subjectCodes.forEach((code) => {
      const subject = subjectByCode.get(code);
      if (!subject) return;
      const status = tier === 'top' ? 'verified' : tier === 'mid' ? (rng() < 0.5 ? 'completed' : 'verified') : 'pending';
      const submittedAt = addDays(classStartDate, randInt(20, 45));
      const verifiedBy = status === 'verified' ? teacherBySubject.get(code) || null : null;
      noteRows.push({
        studentId: student.id,
        subjectId: subject.id,
        chapter: `Chapter ${randInt(1, 6)}`,
        topic: pick(['Key concepts', 'Examples', 'Exercises', 'Summary notes']),
        content: 'Summary notes prepared by student.',
        status,
        verifiedBy,
        verifiedAt: status === 'verified' ? addDays(submittedAt, 1) : null,
        createdAt: submittedAt,
        updatedAt: addDays(submittedAt, randInt(1, 3)),
      });
    });
  });
  if (noteRows.length > 0) {
    await db.insert(studentNotes).values(noteRows);
  }

  const insightRows: any[] = [];
  const strengthsBySubject: Record<string, string[]> = {
    math: ['algebra', 'set theory', 'linear equations'],
    science: ['lab skills', 'observations', 'basic concepts'],
    english: ['reading comprehension', 'vocabulary', 'grammar basics'],
    nepali: ['कविता विश्लेषण', 'व्याकरण', 'निबन्ध लेखन'],
    social: ['civics', 'map skills', 'history recall'],
    computer: ['html basics', 'logic building', 'software tools'],
  };
  const weaknessesBySubject: Record<string, string[]> = {
    math: ['word problems', 'quadratic formula'],
    science: ['theory recall', 'numericals'],
    english: ['essay structure', 'tense usage'],
    nepali: ['शुद्ध लेखन', 'विस्तृत उत्तर'],
    social: ['case studies', 'current affairs'],
    computer: ['debugging', 'program flow'],
  };

  insertedStudents.forEach((student, index) => {
    const tier = studentTier.get(student.id) || 'mid';
    subjectByCode.forEach((subject, code) => {
      insightRows.push({
        studentId: student.id,
        subjectId: subject.id,
        strengths: pickMany(strengthsBySubject[code] || [], 2),
        weaknesses: pickMany(weaknessesBySubject[code] || [], 2),
        recommendedTopics: pickMany(['revision set', 'practice quiz', 'concept map', 'daily recap'], 2),
        progressTrend: tier === 'top' ? 'improving' : tier === 'mid' ? 'stable' : 'declining',
        lastUpdated: addDays(now, -randInt(2, 20)),
      });
    });
  });
  if (insightRows.length > 0) {
    await db.insert(studentLearningInsights).values(insightRows);
  }

  const resourceRows: any[] = [];
  subjectByCode.forEach((subject) => {
    resourceRows.push(
      {
        subjectId: subject.id,
        chapter: 'Chapter 1',
        title: `${subject.name} Quick Revision Notes`,
        type: 'pdf',
        url: '#',
        isBookmarked: false,
        recommended: true,
        createdAt: addDays(classStartDate, 10),
      },
      {
        subjectId: subject.id,
        chapter: 'Chapter 2',
        title: `${subject.name} Concept Video`,
        type: 'video',
        url: '#',
        isBookmarked: true,
        recommended: true,
        createdAt: addDays(classStartDate, 20),
      },
      {
        subjectId: subject.id,
        chapter: 'Chapter 3',
        title: `${subject.name} Practice Set`,
        type: 'pdf',
        url: '#',
        isBookmarked: false,
        recommended: false,
        createdAt: addDays(classStartDate, 30),
      }
    );
  });
  if (resourceRows.length > 0) {
    await db.insert(resources).values(resourceRows);
  }

  const lessonPlanRows: any[] = [];
  
  // Define realistic lesson topics by subject
  const lessonTopicsBySubject: Record<string, string[]> = {
    math: [
      'Linear Equations and Graphing',
      'Quadratic Functions', 
      'Trigonometry Basics',
      'Probability and Statistics',
      'Geometry Proofs',
      'Calculus Introduction',
      'Word Problem Strategies',
      'Mathematical Reasoning'
    ],
    science: [
      'Cell Biology and Division',
      'Chemical Reactions',
      'Physics Laws and Formulas',
      'Environmental Science',
      'Human Anatomy',
      'Scientific Method',
      'Laboratory Techniques',
      'Energy and Matter'
    ],
    english: [
      'Essay Writing Structure',
      'Poetry Analysis',
      'Grammar and Punctuation',
      'Reading Comprehension',
      'Creative Writing',
      'Literary Devices',
      'Vocabulary Building',
      'Public Speaking'
    ],
    nepali: [
      'नेपाली व्याकरण',
      'कविता विश्लेषण',
      'निबन्ध लेखन',
      'कथा वाचन',
      'शुद्ध उच्चारण',
      'साहित्यिक परिभाषा',
      'अनुवाद कौशल',
      'भाषण कला'
    ],
    social: [
      'Nepalese History',
      'Geography of Nepal',
      'Civics and Citizenship',
      'Economics Basics',
      'World History',
      'Map Reading Skills',
      'Current Affairs',
      'Social Studies'
    ],
    computer: [
      'Programming Fundamentals',
      'Web Development Basics',
      'Database Concepts',
      'Computer Hardware',
      'Software Applications',
      'Internet and Security',
      'Algorithm Design',
      'Problem Solving'
    ]
  };
  
  // Define realistic student queries by subject
  const studentQueriesBySubject: Record<string, string[]> = {
    math: [
      'How do we solve word problems systematically?',
      'Why is the quadratic formula important?',
      'Can you explain the proof of this theorem?',
      'What are real-world applications of calculus?',
      'How can I improve my problem-solving speed?'
    ],
    science: [
      'Why does this chemical reaction occur?',
      'How do we calculate velocity properly?',
      'What are the steps in the scientific method?',
      'Can you explain the cell division process?',
      'How does energy transfer work in ecosystems?'
    ],
    english: [
      'How should I structure my thesis statement?',
      'What are the rules for comma usage?',
      'How do I analyze poetry effectively?',
      'Can you help me with vocabulary building?',
      'What makes a good argumentative essay?'
    ],
    nepali: [
      'कविताको भावपक्ष कसरी बुझ्ने?',
      'निबन्धमा परिचय कसरी लेख्ने?',
      'व्याकरणका नियमहरू के हुन्?',
      'शुद्ध लेखनका लागि के ध्यान दिने?',
      'भाषणमा आत्मविश्वास कसरी बढाउने?'
    ],
    social: [
      'What were the main causes of this historical event?',
      'How do we read political maps effectively?',
      'What are our rights and responsibilities?',
      'How does supply and demand affect prices?',
      'Why is geography important in daily life?'
    ],
    computer: [
      'How do we debug programs efficiently?',
      'What is the difference between HTML and CSS?',
      'How do databases store information?',
      'Why is cybersecurity important?',
      'What makes good algorithm design?'
    ]
  };
  
  // Define AI recommendations by teaching scenario
  const aiRecommendations = [
    'Use visual aids and diagrams to explain complex concepts.',
    'Start with a 5-minute recap of previous lesson.',
    'Incorporate real-world examples and case studies.',
    'Use peer teaching and group activities.',
    'Assign short exit tickets for immediate feedback.',
    'Use interactive demonstrations and hands-on activities.',
    'Provide differentiated materials for varying skill levels.',
    'Include formative assessments throughout the lesson.',
    'Use questioning techniques to check understanding.',
    'Provide additional practice problems for homework.'
  ];
  
  teacherSeed.forEach((teacher, teacherIndex) => {
    const subject = subjectByCode.get(teacher.subjectCode);
    if (!subject) return;
    
    const topics = lessonTopicsBySubject[teacher.subjectCode] || [];
    const queries = studentQueriesBySubject[teacher.subjectCode] || [];
    
    // Generate 5 lesson plans per teacher with different statuses and dates
    for (let i = 0; i < 5; i++) {
      const lessonDate = addDays(now, -10 + (i * 3)); // Spread over 15 days
      const status = i === 0 ? 'completed' : i === 1 ? 'completed' : i === 2 ? 'upcoming' : i === 3 ? 'upcoming' : 'missed';
      const isCompleted = status === 'completed';
      const hasFeedback = isCompleted && rng() > 0.3; // 70% of completed lessons have feedback
      
      // Generate realistic student queries for completed lessons
      const studentQueriesData = isCompleted ? pickMany(queries, randInt(2, 4)).map(query => ({
        studentId: pick(insertedStudents).id,
        question: query,
        timestamp: addDays(lessonDate, randInt(-1, 1)),
        addressed: rng() > 0.4
      })) : [];
      
      lessonPlanRows.push({
        teacherId: insertedTeachers[teacherIndex].id,
        classId: schoolClass.id,
        subjectId: subject.id,
        date: lessonDate.toISOString().split('T')[0],
        topics: pickMany(topics, randInt(2, 3)),
        studentQueries: studentQueriesData,
        weakAreas: pickMany(weaknessesBySubject[teacher.subjectCode] || [], randInt(1, 2)),
        aiRecommendation: pick(aiRecommendations),
        status: status,
        completedAt: isCompleted ? addDays(lessonDate, randInt(0, 1)) : null,
        feedbackCollected: hasFeedback,
        createdAt: addDays(lessonDate, -randInt(2, 5)),
        updatedAt: isCompleted ? addDays(lessonDate, randInt(0, 2)) : addDays(lessonDate, -randInt(1, 3))
      });
    }
  });
  if (lessonPlanRows.length > 0) {
    await db.insert(lessonPlans).values(lessonPlanRows);
  }

  const dailyDoseRows: any[] = [];
  teacherSeed.forEach((teacher, index) => {
    const subject = subjectByCode.get(teacher.subjectCode);
    if (!subject) return;
    const completed = rng() < 0.6;
    dailyDoseRows.push({
      teacherId: insertedTeachers[index].id,
      subjectId: subject.id,
      date: addDays(now, -randInt(0, 4)),
      title: `${subject.name} Teaching Tip`,
      description: 'Short strategy to improve student engagement.',
      content: 'Use quick checks and visual examples to reinforce learning.',
      topics: pickMany(['engagement', 'concept check', 'revision'], 2),
      estimatedTime: randInt(10, 20),
      source: 'HamroGuru',
      completed,
      completedAt: completed ? addDays(now, -1) : null,
      createdAt: addDays(now, -5),
    });
  });
  if (dailyDoseRows.length > 0) {
    await db.insert(dailyDoses).values(dailyDoseRows);
  }

  const assessmentRows: any[] = [];
  teacherSeed.forEach((teacher, index) => {
    const subject = subjectByCode.get(teacher.subjectCode);
    if (!subject) return;
    assessmentRows.push(
      {
        teacherId: insertedTeachers[index].id,
        subjectId: subject.id,
        title: `${subject.name} Skill Check`,
        totalQuestions: 10,
        duration: 30,
        scheduledDate: addDays(now, 3),
        status: 'upcoming',
        createdAt: addDays(now, -2),
      },
      {
        teacherId: insertedTeachers[index].id,
        subjectId: subject.id,
        title: `${subject.name} Practice Assessment`,
        totalQuestions: 12,
        duration: 35,
        completedAt: addDays(now, -7),
        score: randInt(65, 95),
        status: 'completed',
        createdAt: addDays(now, -12),
      }
    );
  });
  if (assessmentRows.length > 0) {
    await db.insert(teacherAssessments).values(assessmentRows);
  }

  const studentQueryRows: any[] = [];
  const subjectCodes = Array.from(subjectByCode.keys());
  for (let i = 0; i < 18; i += 1) {
    const student = pick(insertedStudents);
    const subjectCode = pick(subjectCodes);
    const subject = subjectByCode.get(subjectCode);
    const teacherId = teacherBySubject.get(subjectCode);
    if (!subject || !teacherId) continue;
    const isAddressed = rng() >= 0.6;
    studentQueryRows.push({
      studentId: student.id,
      teacherId,
      subjectId: subject.id,
      queryText: pick([
        'Can you explain this topic again?',
        'I got confused in today’s class.',
        'How to solve similar problems quickly?',
        'Which steps should I remember for the exam?',
      ]),
      topic: pick(weaknessesBySubject[subjectCode] || ['general']),
      source: 'ai_tutor',
      status: isAddressed ? 'addressed' : 'pending',
      askedAt: addDays(now, -randInt(1, 12)),
      addressedAt: isAddressed ? addDays(now, -randInt(0, 5)) : null,
      studentFeedback: isAddressed ? pick(['understood', 'still_confused']) : null,
      addedToPortfolio: rng() < 0.2,
      createdAt: addDays(now, -randInt(1, 12)),
    });
  }
  if (studentQueryRows.length > 0) {
    await db.insert(studentQueries).values(studentQueryRows);
  }

  const aiTutorSessionRows: any[] = [];
  for (let i = 0; i < 24; i += 1) {
    const student = pick(insertedStudents);
    const subjectCode = pick(subjectCodes);
    const subject = subjectByCode.get(subjectCode);
    if (!subject) continue;
    const sessionStart = addDays(now, -randInt(3, 55));
    const duration = randInt(12, 35);
    aiTutorSessionRows.push({
      studentId: student.id,
      subjectId: subject.id,
      messages: [
        {
          role: 'student',
          content: 'I am stuck on this topic. Can you help?',
          timestamp: sessionStart.toISOString(),
        },
        {
          role: 'tutor',
          content: 'Sure. Let us break it into steps and try an example.',
          timestamp: addDays(sessionStart, 0).toISOString(),
        },
        {
          role: 'student',
          content: 'That makes sense now. Can we do one more?',
          timestamp: addDays(sessionStart, 0).toISOString(),
        },
      ],
      sessionSummary: 'Reviewed key steps and practiced one example.',
      topicsDiscussed: pickMany(['revision set', 'practice quiz', 'concept map', 'daily recap'], 2),
      understandingLevel: { before: randInt(1, 3), after: randInt(3, 5) },
      createdAt: sessionStart,
      endedAt: addDays(sessionStart, 0),
    });
  }
  if (aiTutorSessionRows.length > 0) {
    await db.insert(aiTutorSessions).values(aiTutorSessionRows);
  }

  const portfolioRows: any[] = [];
  insertedTeachers.forEach((teacher, index) => {
    const subject = subjectByCode.get(teacherSeed[index].subjectCode);
    if (!subject) return;
    for (let week = 0; week < 8; week += 1) {
      const metricDate = addDays(classStartDate, week * 7 + 3);
      if (metricDate > now) continue;
      portfolioRows.push(
        {
          teacherId: teacher.id,
          metricType: 'class_engagement',
          value: Number((60 + week * 3 + randInt(-4, 6)).toFixed(2)),
          date: metricDate,
          details: { classId: schoolClass.id, subjectId: subject.id, note: 'Participation index' },
          createdAt: metricDate,
        },
        {
          teacherId: teacher.id,
          metricType: 'assignment_completion',
          value: Number((55 + week * 4 + randInt(-6, 8)).toFixed(2)),
          date: metricDate,
          details: { classId: schoolClass.id, subjectId: subject.id, note: 'On-time submission rate' },
          createdAt: metricDate,
        },
        {
          teacherId: teacher.id,
          metricType: 'avg_test_score',
          value: Number((65 + week * 2 + randInt(-5, 7)).toFixed(2)),
          date: metricDate,
          details: { classId: schoolClass.id, subjectId: subject.id, note: 'Rolling 4-week average' },
          createdAt: metricDate,
        }
      );
    }
  });
  if (portfolioRows.length > 0) {
    await db.insert(teacherPortfolio).values(portfolioRows);
  }

  const webhookRows: any[] = [];
  for (let i = 0; i < 8; i += 1) {
    const payload = {
      event: pick(['payment_success', 'subscription_renewal', 'sms_delivery', 'email_delivery']),
      schoolId: school.id,
      timestamp: addDays(now, -randInt(1, 50)).toISOString(),
    };
    webhookRows.push({
      webhookType: payload.event,
      payload,
      response: { status: 200, message: 'ok' },
      status: rng() < 0.85 ? 'success' : 'failed',
      createdAt: addDays(now, -randInt(1, 50)),
    });
  }
  if (webhookRows.length > 0) {
    await db.insert(webhookLogs).values(webhookRows);
  }

  const embeddingRows: any[] = [];
  subjectByCode.forEach((subject) => {
    for (let i = 0; i < 2; i += 1) {
      embeddingRows.push({
        subjectId: subject.id,
        chapter: `Chapter ${i + 1}`,
        topic: pick(['definitions', 'examples', 'practice', 'summary']),
        chunkIndex: i + 1,
        content: `${subject.name} textbook chunk ${i + 1} content for retrieval.`,
        embedding: makeVector(1536),
        metadata: { source: 'seed', tokens: randInt(120, 260) },
        createdAt: addDays(classStartDate, 5 + i * 7),
      });
    }
  });
  if (embeddingRows.length > 0) {
    await db.insert(subjectTextbookEmbeddings).values(embeddingRows);
  }

  console.log('✅ Teachers, students, and academic data seeded successfully!');
};

seedAcademicData()
  .then(() => {
    console.log('Seed completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
