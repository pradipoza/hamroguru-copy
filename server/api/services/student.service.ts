import { db } from '../../db';
import {
  studentProfiles,
  subjects,
  homeworkAssignments,
  homeworkSubmissions,
  profiles,
  classes,
  schools,
  tests,
  studentNotes,
  teacherClassAssignments,
  users,
  testResults,
  studentLearningInsights,
  resources,
} from '../../db/schema';
import { eq, and, gte, inArray, desc, or, isNull } from 'drizzle-orm';

const isUndefinedColumnError = (error: unknown, columnName: string) => {
  if (!error || typeof error !== 'object') return false;
  const code = (error as { code?: string }).code;
  const message = (error as { message?: string }).message;
  return code === '42703' && typeof message === 'string' && message.includes(columnName);
};

const isUndefinedTableError = (error: unknown, tableName?: string) => {
  if (!error || typeof error !== 'object') return false;
  const code = (error as { code?: string }).code;
  const message = (error as { message?: string }).message;
  if (code !== '42P01' || typeof message !== 'string') return false;
  return tableName ? message.includes(tableName) : true;
};

const isSchemaMismatchError = (error: unknown, columnName?: string, tableName?: string) => {
  if (columnName && isUndefinedColumnError(error, columnName)) return true;
  if (tableName && isUndefinedTableError(error, tableName)) return true;
  if (!columnName && !tableName) {
    if (!error || typeof error !== 'object') return false;
    const code = (error as { code?: string }).code;
    return code === '42703' || code === '42P01';
  }
  return false;
};

export const getDashboardData = async (userId: string) => {
  const [profileData] = await db
    .select({
      fullName: profiles.fullName,
      avatarUrl: profiles.avatarUrl,
      streakDays: studentProfiles.streakDays,
      totalPoints: studentProfiles.totalPoints,
      classId: studentProfiles.classId,
    })
    .from(studentProfiles)
    .leftJoin(profiles, eq(studentProfiles.userId, profiles.id))
    .where(eq(studentProfiles.userId, userId));

  if (!profileData?.classId) {
    return {
      profile: profileData,
      subjects: [],
      pendingTasks: [],
    };
  }

  const [classInfo] = await db
    .select({ id: classes.id, grade: classes.grade, section: classes.section })
    .from(classes)
    .where(eq(classes.id, profileData.classId));

  const studentsInClass = await db
    .select({ id: studentProfiles.id })
    .from(studentProfiles)
    .where(eq(studentProfiles.classId, profileData.classId));

  const subjectsData = await db
    .select()
    .from(subjects)
    .where(or(
      isNull(subjects.gradeLevel),
      eq(subjects.gradeLevel, classInfo?.grade || 0)
    ));

  const teacherAssignments = await db
    .select({
      subjectId: teacherClassAssignments.subjectId,
      teacherName: profiles.fullName,
    })
    .from(teacherClassAssignments)
    .leftJoin(profiles, eq(teacherClassAssignments.teacherId, profiles.id))
    .where(eq(teacherClassAssignments.classId, profileData.classId))
    .orderBy(desc(teacherClassAssignments.createdAt));

  const teacherBySubject = new Map<string, string>();
  teacherAssignments.forEach((assignment) => {
    if (!teacherBySubject.has(assignment.subjectId) && assignment.teacherName) {
      teacherBySubject.set(assignment.subjectId, assignment.teacherName);
    }
  });

  const classAssignments = await db
    .select({
      id: homeworkAssignments.id,
      subjectId: homeworkAssignments.subjectId,
      dueDate: homeworkAssignments.dueDate,
      title: homeworkAssignments.title,
    })
    .from(homeworkAssignments)
    .where(eq(homeworkAssignments.classId, profileData.classId));

  const assignmentIds = classAssignments.map((assignment) => assignment.id);
  const submissions = assignmentIds.length > 0
    ? await db
        .select({ assignmentId: homeworkSubmissions.assignmentId })
        .from(homeworkSubmissions)
        .where(and(
          eq(homeworkSubmissions.studentId, userId),
          inArray(homeworkSubmissions.assignmentId, assignmentIds)
        ))
    : [];

  const submittedIds = new Set(submissions.map((submission) => submission.assignmentId));
  const pendingHomeworkBySubject = new Map<string, number>();

  classAssignments.forEach((assignment) => {
    if (!submittedIds.has(assignment.id)) {
      pendingHomeworkBySubject.set(
        assignment.subjectId,
        (pendingHomeworkBySubject.get(assignment.subjectId) || 0) + 1
      );
    }
  });

  const pendingNotes = await db
    .select({ subjectId: studentNotes.subjectId })
    .from(studentNotes)
    .where(and(
      eq(studentNotes.studentId, userId),
      eq(studentNotes.status, 'pending')
    ));

  const pendingNotesBySubject = new Map<string, number>();
  pendingNotes.forEach((note) => {
    pendingNotesBySubject.set(
      note.subjectId,
      (pendingNotesBySubject.get(note.subjectId) || 0) + 1
    );
  });

  const upcomingTests = await db
    .select({ subjectId: tests.subjectId })
    .from(tests)
    .where(and(
      eq(tests.classId, profileData.classId),
      inArray(tests.status, ['upcoming', 'available'])
    ));

  const upcomingTestsBySubject = new Map<string, number>();
  upcomingTests.forEach((test) => {
    upcomingTestsBySubject.set(
      test.subjectId,
      (upcomingTestsBySubject.get(test.subjectId) || 0) + 1
    );
  });

  const pendingTasksData = classAssignments
    .filter((assignment) => !submittedIds.has(assignment.id))
    .map((assignment) => {
      const subject = subjectsData.find((s) => s.id === assignment.subjectId);
      return {
        id: assignment.id,
        title: assignment.title,
        subject: subject?.name || '',
        dueDate: assignment.dueDate,
      };
    });

  const subjectsWithCounts = subjectsData.map((subject) => ({
    ...subject,
    teacherName: teacherBySubject.get(subject.id) || null,
    pendingHomework: pendingHomeworkBySubject.get(subject.id) || 0,
    pendingNotes: pendingNotesBySubject.get(subject.id) || 0,
    upcomingTests: upcomingTestsBySubject.get(subject.id) || 0,
    classGrade: classInfo?.grade || null,
    classSection: classInfo?.section || null,
    studentCount: studentsInClass.length,
  }));

  return {
    profile: profileData,
    subjects: subjectsWithCounts,
    pendingTasks: pendingTasksData,
  };
};

export const getStudentProfile = async (userId: string) => {
  const [profileData] = await db
    .select({
      id: studentProfiles.id,
      userId: studentProfiles.userId,
      classId: studentProfiles.classId,
      rollNumber: studentProfiles.rollNumber,
      streakDays: studentProfiles.streakDays,
      totalPoints: studentProfiles.totalPoints,
      fullName: profiles.fullName,
      avatarUrl: profiles.avatarUrl,
      phone: profiles.phone,
      grade: classes.grade,
      section: classes.section,
      schoolName: schools.name,
    })
    .from(studentProfiles)
    .leftJoin(profiles, eq(studentProfiles.userId, profiles.id))
    .leftJoin(classes, eq(studentProfiles.classId, classes.id))
    .leftJoin(schools, eq(classes.schoolId, schools.id))
    .where(eq(studentProfiles.userId, userId));

  return profileData;
};

export const getPendingTasks = async (userId: string) => {
  const now = new Date();
  const tasks: any[] = [];

  const [studentProfile] = await db
    .select({ classId: studentProfiles.classId })
    .from(studentProfiles)
    .where(eq(studentProfiles.userId, userId));

  if (!studentProfile?.classId) {
    return [];
  }

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const assignments = await db
    .select({
      id: homeworkAssignments.id,
      title: homeworkAssignments.title,
      dueDate: homeworkAssignments.dueDate,
      subjectName: subjects.name,
      subjectCode: subjects.code,
    })
    .from(homeworkAssignments)
    .leftJoin(subjects, eq(homeworkAssignments.subjectId, subjects.id))
    .where(and(
      eq(homeworkAssignments.classId, studentProfile.classId),
      gte(homeworkAssignments.dueDate, weekAgo)
    ));

  const assignmentIds = assignments.map(a => a.id);
  
  const submissions = assignmentIds.length > 0 
    ? await db
        .select({ assignmentId: homeworkSubmissions.assignmentId })
        .from(homeworkSubmissions)
        .where(and(
          eq(homeworkSubmissions.studentId, userId),
          inArray(homeworkSubmissions.assignmentId, assignmentIds)
        ))
    : [];

  const submittedIds = new Set(submissions.map(s => s.assignmentId));

  assignments.forEach(assignment => {
    if (!submittedIds.has(assignment.id)) {
      const dueDate = new Date(assignment.dueDate);
      tasks.push({
        id: assignment.id,
        type: 'homework',
        subjectCode: assignment.subjectCode || '',
        subjectName: assignment.subjectName || '',
        title: assignment.title,
        dueDate,
        isOverdue: dueDate < now,
      });
    }
  });

  const pendingNotes = await db
    .select({
      id: studentNotes.id,
      topic: studentNotes.topic,
      subjectName: subjects.name,
      subjectCode: subjects.code,
    })
    .from(studentNotes)
    .leftJoin(subjects, eq(studentNotes.subjectId, subjects.id))
    .where(and(
      eq(studentNotes.studentId, userId),
      eq(studentNotes.status, 'pending')
    ));

  pendingNotes.forEach(note => {
    tasks.push({
      id: note.id,
      type: 'notes',
      subjectCode: note.subjectCode || '',
      subjectName: note.subjectName || '',
      title: note.topic,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isOverdue: false,
    });
  });

  const upcomingTests = await db
    .select({
      id: tests.id,
      title: tests.title,
      scheduledDate: tests.scheduledDate,
      subjectName: subjects.name,
      subjectCode: subjects.code,
    })
    .from(tests)
    .leftJoin(subjects, eq(tests.subjectId, subjects.id))
    .where(and(
      eq(tests.classId, studentProfile.classId),
      inArray(tests.status, ['upcoming', 'available'])
    ));

  upcomingTests.forEach(test => {
    tasks.push({
      id: test.id,
      type: 'test',
      subjectCode: test.subjectCode || '',
      subjectName: test.subjectName || '',
      title: test.title,
      dueDate: test.scheduledDate ? new Date(test.scheduledDate) : new Date(),
      isOverdue: false,
    });
  });

  return tasks.sort((a, b) => {
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;
    return a.dueDate.getTime() - b.dueDate.getTime();
  });
};

const buildRecentActivity = async (userId: string) => {
  let homeworkActivity: {
    id: string;
    submittedAt: Date | null;
    title: string;
    subjectId: string;
  }[] = [];
  let testActivity: {
    id: string;
    completedAt: Date | null;
    score: number | null;
    totalMarks: number | null;
    title: string;
    subjectId: string;
  }[] = [];
  let noteActivity: {
    id: string;
    updatedAt: Date | null;
    topic: string;
    status: string | null;
    subjectId: string;
  }[] = [];

  try {
    homeworkActivity = await db
      .select({
        id: homeworkSubmissions.id,
        submittedAt: homeworkSubmissions.submittedAt,
        title: homeworkAssignments.title,
        subjectId: homeworkAssignments.subjectId,
      })
      .from(homeworkSubmissions)
      .leftJoin(homeworkAssignments, eq(homeworkSubmissions.assignmentId, homeworkAssignments.id))
      .where(eq(homeworkSubmissions.studentId, userId));
  } catch (error) {
    if (!isSchemaMismatchError(error)) {
      throw error;
    }
  }

  try {
    testActivity = await db
      .select({
        id: testResults.id,
        completedAt: testResults.completedAt,
        score: testResults.score,
        totalMarks: tests.totalMarks,
        title: tests.title,
        subjectId: tests.subjectId,
      })
      .from(testResults)
      .leftJoin(tests, eq(testResults.testId, tests.id))
      .where(eq(testResults.studentId, userId));
  } catch (error) {
    if (!isSchemaMismatchError(error)) {
      throw error;
    }
  }

  try {
    noteActivity = await db
      .select({
        id: studentNotes.id,
        updatedAt: studentNotes.updatedAt,
        topic: studentNotes.topic,
        status: studentNotes.status,
        subjectId: studentNotes.subjectId,
      })
      .from(studentNotes)
      .where(eq(studentNotes.studentId, userId));
  } catch (error) {
    if (!isSchemaMismatchError(error)) {
      throw error;
    }
  }

  const activity = [
    ...homeworkActivity
      .filter((item) => item.submittedAt)
      .map((item) => ({
        id: item.id,
        type: 'homework_submitted',
        description: `Submitted "${item.title}"`,
        date: new Date(item.submittedAt as Date),
        subjectId: item.subjectId,
      })),
    ...testActivity
      .filter((item) => item.completedAt)
      .map((item) => ({
        id: item.id,
        type: 'test_completed',
        description: item.score !== null && typeof item.score !== 'undefined'
          ? `Completed "${item.title}" - ${item.score}/${item.totalMarks || 100}`
          : `Completed "${item.title}"`,
        date: new Date(item.completedAt as Date),
        subjectId: item.subjectId,
      })),
    ...noteActivity.map((item) => ({
      id: item.id,
      type: item.status === 'verified' ? 'note_verified' : 'resource_accessed',
      description: item.status === 'verified'
        ? `Notes verified for "${item.topic}"`
        : `Updated notes for "${item.topic}"`,
      date: new Date(item.updatedAt),
      subjectId: item.subjectId,
    })),
  ];

  return activity.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);
};

export const getProfileDetails = async (userId: string) => {
  let profileData: any;
  try {
    [profileData] = await db
      .select({
        id: studentProfiles.id,
        userId: studentProfiles.userId,
        classId: studentProfiles.classId,
        rollNumber: studentProfiles.rollNumber,
        streakDays: studentProfiles.streakDays,
        totalPoints: studentProfiles.totalPoints,
        learningStyle: studentProfiles.learningStyle,
        learningProfile: studentProfiles.learningProfile,
        goals: studentProfiles.goals,
        interests: studentProfiles.interests,
        parentContact: studentProfiles.parentContact,
        address: studentProfiles.address,
        fullName: profiles.fullName,
        avatarUrl: profiles.avatarUrl,
        phone: profiles.phone,
        email: users.email,
        grade: classes.grade,
        section: classes.section,
        schoolName: schools.name,
      })
      .from(studentProfiles)
      .leftJoin(profiles, eq(studentProfiles.userId, profiles.id))
      .leftJoin(users, eq(studentProfiles.userId, users.id))
      .leftJoin(classes, eq(studentProfiles.classId, classes.id))
      .leftJoin(schools, eq(classes.schoolId, schools.id))
      .where(eq(studentProfiles.userId, userId));
  } catch (error) {
    if (!isSchemaMismatchError(error, 'learning_profile') && !isSchemaMismatchError(error, 'learning_style')) {
      throw error;
    }

    try {
      const [legacyProfile] = await db
        .select({
          id: studentProfiles.id,
          userId: studentProfiles.userId,
          classId: studentProfiles.classId,
          rollNumber: studentProfiles.rollNumber,
          streakDays: studentProfiles.streakDays,
          totalPoints: studentProfiles.totalPoints,
          goals: studentProfiles.goals,
          interests: studentProfiles.interests,
          parentContact: studentProfiles.parentContact,
          address: studentProfiles.address,
          fullName: profiles.fullName,
          avatarUrl: profiles.avatarUrl,
          phone: profiles.phone,
          email: users.email,
          grade: classes.grade,
          section: classes.section,
          schoolName: schools.name,
        })
        .from(studentProfiles)
        .leftJoin(profiles, eq(studentProfiles.userId, profiles.id))
        .leftJoin(users, eq(studentProfiles.userId, users.id))
        .leftJoin(classes, eq(studentProfiles.classId, classes.id))
        .leftJoin(schools, eq(classes.schoolId, schools.id))
        .where(eq(studentProfiles.userId, userId));

      profileData = legacyProfile
        ? { ...legacyProfile, learningStyle: null, learningProfile: null }
        : legacyProfile;
    } catch (legacyError) {
      if (!isSchemaMismatchError(legacyError)) {
        throw legacyError;
      }

      try {
        const [minimalProfile] = await db
          .select({
            id: studentProfiles.id,
            userId: studentProfiles.userId,
            classId: studentProfiles.classId,
            rollNumber: studentProfiles.rollNumber,
            streakDays: studentProfiles.streakDays,
            totalPoints: studentProfiles.totalPoints,
            fullName: profiles.fullName,
            avatarUrl: profiles.avatarUrl,
            phone: profiles.phone,
            email: users.email,
            grade: classes.grade,
            section: classes.section,
            schoolName: schools.name,
          })
          .from(studentProfiles)
          .leftJoin(profiles, eq(studentProfiles.userId, profiles.id))
          .leftJoin(users, eq(studentProfiles.userId, users.id))
          .leftJoin(classes, eq(studentProfiles.classId, classes.id))
          .leftJoin(schools, eq(classes.schoolId, schools.id))
          .where(eq(studentProfiles.userId, userId));

        profileData = minimalProfile
          ? { ...minimalProfile, learningStyle: null, learningProfile: null, goals: null, interests: null, parentContact: null, address: null }
          : minimalProfile;
      } catch (minimalError) {
        if (!isSchemaMismatchError(minimalError)) {
          throw minimalError;
        }

        const [baseProfile] = await db
          .select({
            id: studentProfiles.id,
            userId: studentProfiles.userId,
            classId: studentProfiles.classId,
            rollNumber: studentProfiles.rollNumber,
            streakDays: studentProfiles.streakDays,
            totalPoints: studentProfiles.totalPoints,
            fullName: profiles.fullName,
            avatarUrl: profiles.avatarUrl,
            phone: profiles.phone,
          })
          .from(studentProfiles)
          .leftJoin(profiles, eq(studentProfiles.userId, profiles.id))
          .where(eq(studentProfiles.userId, userId));

        profileData = baseProfile
          ? {
              ...baseProfile,
              learningStyle: null,
              learningProfile: null,
              goals: null,
              interests: null,
              parentContact: null,
              address: null,
              email: null,
              grade: null,
              section: null,
              schoolName: null,
            }
          : baseProfile;
      }
    }
  }

  if (!profileData?.classId) {
    return {
      profile: profileData,
      homeworkHistory: [],
      testHistory: [],
      noteHistory: [],
      learningInsights: [],
      recentActivity: [],
    };
  }

  let subjectsData: typeof subjects.$inferSelect[] = [];
  try {
    subjectsData = await db
      .select()
      .from(subjects)
      .where(or(
        isNull(subjects.gradeLevel),
        eq(subjects.gradeLevel, profileData.grade || 0)
      ));
  } catch (error) {
    if (!isSchemaMismatchError(error)) {
      throw error;
    }
  }

  let homeworkHistory: {
    id: string;
    subjectId: string;
    title: string;
    assignedDate: Date | null;
    dueDate: Date | null;
    submittedAt: Date | null;
    status: string | null;
    score: number | null;
    aiFeedback: unknown;
    teacherFeedback: string | null;
  }[] = [];
  try {
    homeworkHistory = await db
      .select({
        id: homeworkAssignments.id,
        subjectId: homeworkAssignments.subjectId,
        title: homeworkAssignments.title,
        assignedDate: homeworkAssignments.createdAt,
        dueDate: homeworkAssignments.dueDate,
        submittedAt: homeworkSubmissions.submittedAt,
        status: homeworkSubmissions.status,
        score: homeworkSubmissions.score,
        aiFeedback: homeworkSubmissions.aiFeedback,
        teacherFeedback: homeworkSubmissions.teacherFeedback,
      })
      .from(homeworkAssignments)
      .leftJoin(
        homeworkSubmissions,
        and(
          eq(homeworkAssignments.id, homeworkSubmissions.assignmentId),
          eq(homeworkSubmissions.studentId, userId)
        )
      )
      .where(eq(homeworkAssignments.classId, profileData.classId))
      .orderBy(desc(homeworkAssignments.dueDate));
  } catch (error) {
    if (!isSchemaMismatchError(error)) {
      throw error;
    }
  }

  let testHistory: {
    id: string;
    subjectId: string;
    title: string;
    type: string | null;
    date: Date | null;
    status: string | null;
    score: number | null;
    maxScore: number | null;
    duration: number | null;
  }[] = [];
  try {
    testHistory = await db
      .select({
        id: tests.id,
        subjectId: tests.subjectId,
        title: tests.title,
        type: tests.type,
        date: tests.scheduledDate,
        status: tests.status,
        score: testResults.score,
        maxScore: tests.totalMarks,
        duration: tests.duration,
      })
      .from(tests)
      .leftJoin(
        testResults,
        and(
          eq(tests.id, testResults.testId),
          eq(testResults.studentId, userId)
        )
      )
      .where(eq(tests.classId, profileData.classId))
      .orderBy(desc(tests.scheduledDate));
  } catch (error) {
    if (!isSchemaMismatchError(error)) {
      throw error;
    }
  }

  let noteHistory: {
    id: string;
    subjectId: string;
    chapter: string;
    topic: string;
    status: string | null;
    submittedAt: Date | null;
    verifiedAt: Date | null;
  }[] = [];
  try {
    noteHistory = await db
      .select({
        id: studentNotes.id,
        subjectId: studentNotes.subjectId,
        chapter: studentNotes.chapter,
        topic: studentNotes.topic,
        status: studentNotes.status,
        submittedAt: studentNotes.createdAt,
        verifiedAt: studentNotes.verifiedAt,
      })
      .from(studentNotes)
      .where(eq(studentNotes.studentId, userId))
      .orderBy(desc(studentNotes.createdAt));
  } catch (error) {
    if (!isSchemaMismatchError(error)) {
      throw error;
    }
  }

  let rawInsights: {
    subjectId: string;
    strengths: string[] | null;
    weaknesses: string[] | null;
    recommendedTopics: string[] | null;
    progressTrend: string | null;
  }[] = [];
  try {
    rawInsights = await db
      .select({
        subjectId: studentLearningInsights.subjectId,
        strengths: studentLearningInsights.strengths,
        weaknesses: studentLearningInsights.weaknesses,
        recommendedTopics: studentLearningInsights.recommendedTopics,
        progressTrend: studentLearningInsights.progressTrend,
      })
      .from(studentLearningInsights)
      .where(eq(studentLearningInsights.studentId, userId));
  } catch (error) {
    if (!isSchemaMismatchError(error)) {
      throw error;
    }
  }

  const subjectIds = Array.from(new Set(rawInsights.map((insight) => insight.subjectId)));
  let resourcesBySubject: { subjectId: string; title: string }[] = [];
  if (subjectIds.length > 0) {
    try {
      resourcesBySubject = await db
        .select({
          subjectId: resources.subjectId,
          title: resources.title,
        })
        .from(resources)
        .where(inArray(resources.subjectId, subjectIds))
        .orderBy(desc(resources.createdAt));
    } catch (error) {
      if (!isSchemaMismatchError(error)) {
        throw error;
      }
    }
  }

  const resourcesMap = new Map<string, string[]>();
  resourcesBySubject.forEach((resource) => {
    const existing = resourcesMap.get(resource.subjectId) || [];
    if (existing.length < 3) {
      existing.push(resource.title);
      resourcesMap.set(resource.subjectId, existing);
    }
  });

  const engagementLevel = profileData.streakDays && profileData.streakDays >= 20
    ? 'high'
    : profileData.streakDays && profileData.streakDays >= 10
    ? 'medium'
    : 'low';

  const learningInsights = rawInsights.map((insight) => ({
    subjectId: insight.subjectId,
    strengths: insight.strengths || [],
    weaknesses: insight.weaknesses || [],
    topicsToFocus: insight.recommendedTopics || [],
    recommendedResources: resourcesMap.get(insight.subjectId) || [],
    progressTrend: insight.progressTrend || 'stable',
    engagementLevel,
  }));

  const recentActivity = await buildRecentActivity(userId);

  return {
    profile: profileData,
    subjects: subjectsData,
    homeworkHistory: homeworkHistory.map((item) => ({
      ...item,
      status: item.status || 'pending',
      maxScore: 10,
      feedback: item.teacherFeedback || (item.aiFeedback ? 'AI feedback available' : null),
    })),
    testHistory: testHistory.map((item) => ({
      ...item,
      maxScore: item.maxScore || 100,
      topicsAssessed: [],
    })),
    noteHistory,
    learningInsights,
    recentActivity,
  };
};

export const getProgressSummary = async (userId: string) => {
  const [studentProfile] = await db
    .select({
      classId: studentProfiles.classId,
      streakDays: studentProfiles.streakDays,
      totalPoints: studentProfiles.totalPoints,
    })
    .from(studentProfiles)
    .where(eq(studentProfiles.userId, userId));

  if (!studentProfile?.classId) {
    return {
      overallProgress: 0,
      completedAssignments: 0,
      totalAssignments: 0,
      streakDays: studentProfile?.streakDays || 0,
      totalPoints: studentProfile?.totalPoints || 0,
      subjectProgress: [],
      recentActivity: [],
    };
  }

  const [classInfo] = await db
    .select({ grade: classes.grade })
    .from(classes)
    .where(eq(classes.id, studentProfile.classId));

  const subjectsData = await db
    .select()
    .from(subjects)
    .where(or(isNull(subjects.gradeLevel), eq(subjects.gradeLevel, classInfo?.grade || 0)));

  const assignments = await db
    .select({
      id: homeworkAssignments.id,
      subjectId: homeworkAssignments.subjectId,
    })
    .from(homeworkAssignments)
    .where(eq(homeworkAssignments.classId, studentProfile.classId));

  const assignmentIds = assignments.map((assignment) => assignment.id);
  const submissions = assignmentIds.length > 0
    ? await db
        .select({
          assignmentId: homeworkSubmissions.assignmentId,
          status: homeworkSubmissions.status,
        })
        .from(homeworkSubmissions)
        .where(and(
          eq(homeworkSubmissions.studentId, userId),
          inArray(homeworkSubmissions.assignmentId, assignmentIds)
        ))
    : [];

  const completedAssignments = submissions.filter((submission) => submission.status !== 'missed').length;
  const totalAssignments = assignments.length;

  const testsData = await db
    .select({
      id: tests.id,
      subjectId: tests.subjectId,
      totalMarks: tests.totalMarks,
    })
    .from(tests)
    .where(eq(tests.classId, studentProfile.classId));

  const testIds = testsData.map((test) => test.id);
  const results = testIds.length > 0
    ? await db
        .select({
          testId: testResults.testId,
          score: testResults.score,
        })
        .from(testResults)
        .where(and(
          eq(testResults.studentId, userId),
          inArray(testResults.testId, testIds)
        ))
    : [];

  const testMeta = new Map<string, { totalMarks: number | null; subjectId: string }>();
  testsData.forEach((test) => {
    testMeta.set(test.id, { totalMarks: test.totalMarks, subjectId: test.subjectId });
  });

  const subjectBuckets = new Map<string, { homeworkTotal: number; homeworkDone: number; testTotal: number; testScore: number }>();
  subjectsData.forEach((subject) => {
    subjectBuckets.set(subject.id, { homeworkTotal: 0, homeworkDone: 0, testTotal: 0, testScore: 0 });
  });

  assignments.forEach((assignment) => {
    const bucket = subjectBuckets.get(assignment.subjectId);
    if (bucket) {
      bucket.homeworkTotal += 1;
    }
  });

  submissions.forEach((submission) => {
    if (submission.status === 'missed') return;
    const assignment = assignments.find((item) => item.id === submission.assignmentId);
    if (!assignment) return;
    const bucket = subjectBuckets.get(assignment.subjectId);
    if (bucket) {
      bucket.homeworkDone += 1;
    }
  });

  results.forEach((result) => {
    if (typeof result.score !== 'number') return;
    const meta = testMeta.get(result.testId);
    if (!meta) return;
    const bucket = subjectBuckets.get(meta.subjectId);
    if (!bucket) return;
    const totalMarks = meta.totalMarks || 100;
    bucket.testTotal += 1;
    bucket.testScore += Math.round((result.score / totalMarks) * 100);
  });

  const subjectProgress = subjectsData.map((subject) => {
    const bucket = subjectBuckets.get(subject.id);
    if (!bucket) return { subject: subject.name, progress: 0, icon: subject.icon };
    const homeworkProgress = bucket.homeworkTotal > 0 ? (bucket.homeworkDone / bucket.homeworkTotal) * 100 : 0;
    const testAverage = bucket.testTotal > 0 ? bucket.testScore / bucket.testTotal : 0;
    const progress = Math.round(homeworkProgress * 0.6 + testAverage * 0.4);
    return {
      subject: subject.name,
      progress,
      icon: subject.icon,
    };
  });

  const overallProgress = subjectProgress.length > 0
    ? Math.round(subjectProgress.reduce((sum, item) => sum + item.progress, 0) / subjectProgress.length)
    : 0;

  const recentActivity = await buildRecentActivity(userId);

  return {
    overallProgress,
    completedAssignments,
    totalAssignments,
    streakDays: studentProfile.streakDays || 0,
    totalPoints: studentProfile.totalPoints || 0,
    subjectProgress,
    recentActivity: recentActivity.map((activity) => ({
      action: activity.description,
      subject: subjectsData.find((subject) => subject.id === activity.subjectId)?.name || 'General',
      time: activity.date.toISOString(),
    })),
  };
};
