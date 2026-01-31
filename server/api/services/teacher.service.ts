import { db } from '../../db';
import {
  teacherProfiles,
  teacherClassAssignments,
  classes,
  subjects,
  profiles,
  studentProfiles,
  homeworkAssignments,
  homeworkSubmissions,
  tests,
  testResults,
  studentNotes,
  lessonPlans,
  dailyDoses,
  teacherAssessments,
  studentQueries,
} from '../../db/schema';
import { eq, and, inArray } from 'drizzle-orm';

export const getProfileData = async (userId: string) => {
  const [profileData] = await db
    .select({
      fullName: profiles.fullName,
      avatarUrl: profiles.avatarUrl,
      qualification: teacherProfiles.qualification,
      yearsExperience: teacherProfiles.yearsExperience,
      subjectsTaught: teacherProfiles.subjectsTaught,
    })
    .from(teacherProfiles)
    .leftJoin(profiles, eq(teacherProfiles.userId, profiles.id))
    .where(eq(teacherProfiles.userId, userId));

  const assignmentsData = await db
    .select({
      class: {
        grade: classes.grade,
        section: classes.section,
      },
      subject: {
        name: subjects.name,
        code: subjects.code,
      },
    })
    .from(teacherClassAssignments)
    .leftJoin(classes, eq(teacherClassAssignments.classId, classes.id))
    .leftJoin(subjects, eq(teacherClassAssignments.subjectId, subjects.id))
    .where(eq(teacherClassAssignments.teacherId, userId));

  return { profile: profileData, assignments: assignmentsData };
};

export const getClasses = async (userId: string) => {
  const classAssignments = await db
    .select({
      id: teacherClassAssignments.id,
      classId: classes.id,
      grade: classes.grade,
      section: classes.section,
      subjectId: subjects.id,
      subjectName: subjects.name,
      subjectCode: subjects.code,
    })
    .from(teacherClassAssignments)
    .leftJoin(classes, eq(teacherClassAssignments.classId, classes.id))
    .leftJoin(subjects, eq(teacherClassAssignments.subjectId, subjects.id))
    .where(eq(teacherClassAssignments.teacherId, userId));

  if (classAssignments.length === 0) {
    return [];
  }

  const classIds = Array.from(new Set(classAssignments.map((item) => item.classId)));
  const subjectIds = Array.from(new Set(classAssignments.map((item) => item.subjectId)));

  const students = await db
    .select({ classId: studentProfiles.classId, studentId: studentProfiles.userId })
    .from(studentProfiles)
    .where(inArray(studentProfiles.classId, classIds));

  const assignments = await db
    .select({
      id: homeworkAssignments.id,
      classId: homeworkAssignments.classId,
      subjectId: homeworkAssignments.subjectId,
    })
    .from(homeworkAssignments)
    .where(and(
      inArray(homeworkAssignments.classId, classIds),
      inArray(homeworkAssignments.subjectId, subjectIds)
    ));

  const assignmentIds = assignments.map((assignment) => assignment.id);
  const submissions = assignmentIds.length > 0
    ? await db
        .select({
          assignmentId: homeworkSubmissions.assignmentId,
          status: homeworkSubmissions.status,
        })
        .from(homeworkSubmissions)
        .where(inArray(homeworkSubmissions.assignmentId, assignmentIds))
    : [];

  const testsForClasses = await db
    .select({
      id: tests.id,
      classId: tests.classId,
      subjectId: tests.subjectId,
      totalMarks: tests.totalMarks,
    })
    .from(tests)
    .where(and(
      inArray(tests.classId, classIds),
      inArray(tests.subjectId, subjectIds)
    ));

  const testIds = testsForClasses.map((test) => test.id);
  const results = testIds.length > 0
    ? await db
        .select({
          testId: testResults.testId,
          score: testResults.score,
        })
        .from(testResults)
        .where(inArray(testResults.testId, testIds))
    : [];

  const studentCountByClass = new Map<string, number>();
  students.forEach((student) => {
    if (!student.classId) return;
    studentCountByClass.set(student.classId, (studentCountByClass.get(student.classId) || 0) + 1);
  });

  const assignmentsByClassSubject = new Map<string, string[]>();
  assignments.forEach((assignment) => {
    const key = `${assignment.classId}-${assignment.subjectId}`;
    const existing = assignmentsByClassSubject.get(key) || [];
    existing.push(assignment.id);
    assignmentsByClassSubject.set(key, existing);
  });

  const pendingByAssignmentId = new Map<string, number>();
  submissions.forEach((submission) => {
    if (submission.status === 'submitted' || submission.status === 'pending') {
      pendingByAssignmentId.set(
        submission.assignmentId,
        (pendingByAssignmentId.get(submission.assignmentId) || 0) + 1
      );
    }
  });

  const testMetaById = new Map<string, { classId: string; subjectId: string; totalMarks: number | null }>();
  testsForClasses.forEach((test) => {
    testMetaById.set(test.id, { classId: test.classId, subjectId: test.subjectId, totalMarks: test.totalMarks });
  });

  const scoreBuckets = new Map<string, { total: number; count: number }>();
  results.forEach((result) => {
    const meta = testMetaById.get(result.testId);
    if (!meta || typeof result.score !== 'number') return;
    const totalMarks = meta.totalMarks || 100;
    const percent = Math.round((result.score / totalMarks) * 100);
    const key = `${meta.classId}-${meta.subjectId}`;
    const bucket = scoreBuckets.get(key) || { total: 0, count: 0 };
    bucket.total += percent;
    bucket.count += 1;
    scoreBuckets.set(key, bucket);
  });

  return classAssignments.map((assignment) => {
    const className = `Grade ${assignment.grade} - ${assignment.section}`;
    const key = `${assignment.classId}-${assignment.subjectId}`;
    const assignmentIdsForKey = assignmentsByClassSubject.get(key) || [];
    const pendingSubmissions = assignmentIdsForKey.reduce(
      (sum, assignmentId) => sum + (pendingByAssignmentId.get(assignmentId) || 0),
      0
    );
    const bucket = scoreBuckets.get(key);
    const averageScore = bucket && bucket.count > 0 ? Math.round(bucket.total / bucket.count) : 0;
    return {
      id: assignment.id,
      classId: assignment.classId,
      className,
      grade: assignment.grade,
      section: assignment.section,
      subjectId: assignment.subjectId,
      subjectName: assignment.subjectName,
      subjectCode: assignment.subjectCode,
      studentCount: studentCountByClass.get(assignment.classId) || 0,
      pendingSubmissions,
      averageScore,
    };
  });
};

export const getStudents = async (userId: string, classId?: string) => {
  const teacherAssignments = await db
    .select({ classId: teacherClassAssignments.classId })
    .from(teacherClassAssignments)
    .where(eq(teacherClassAssignments.teacherId, userId));

  const allowedClassIds = Array.from(new Set(teacherAssignments.map((assignment) => assignment.classId)));
  const targetClassIds = classId ? allowedClassIds.filter((id) => id === classId) : allowedClassIds;

  if (targetClassIds.length === 0) {
    return [];
  }

  const studentRows = await db
    .select({
      userId: studentProfiles.userId,
      classId: studentProfiles.classId,
      fullName: profiles.fullName,
      grade: classes.grade,
      section: classes.section,
    })
    .from(studentProfiles)
    .leftJoin(profiles, eq(studentProfiles.userId, profiles.id))
    .leftJoin(classes, eq(studentProfiles.classId, classes.id))
    .where(inArray(studentProfiles.classId, targetClassIds));

  const assignments = await db
    .select({ id: homeworkAssignments.id, classId: homeworkAssignments.classId })
    .from(homeworkAssignments)
    .where(inArray(homeworkAssignments.classId, targetClassIds));
  const assignmentIds = assignments.map((assignment) => assignment.id);

  const submissions = assignmentIds.length > 0
    ? await db
        .select({
          assignmentId: homeworkSubmissions.assignmentId,
          studentId: homeworkSubmissions.studentId,
          status: homeworkSubmissions.status,
          submittedAt: homeworkSubmissions.submittedAt,
        })
        .from(homeworkSubmissions)
        .where(inArray(homeworkSubmissions.assignmentId, assignmentIds))
    : [];

  const testsForClasses = await db
    .select({
      id: tests.id,
      classId: tests.classId,
      totalMarks: tests.totalMarks,
    })
    .from(tests)
    .where(inArray(tests.classId, targetClassIds));
  const testIds = testsForClasses.map((test) => test.id);

  const results = testIds.length > 0
    ? await db
        .select({
          studentId: testResults.studentId,
          testId: testResults.testId,
          score: testResults.score,
          completedAt: testResults.completedAt,
        })
        .from(testResults)
        .where(inArray(testResults.testId, testIds))
    : [];

  const notes = await db
    .select({
      studentId: studentNotes.studentId,
      updatedAt: studentNotes.updatedAt,
    })
    .from(studentNotes)
    .where(inArray(studentNotes.studentId, studentRows.map((row) => row.userId)));

  const testMeta = new Map<string, { totalMarks: number | null }>();
  testsForClasses.forEach((test) => testMeta.set(test.id, { totalMarks: test.totalMarks }));

  const scoresByStudent = new Map<string, { total: number; count: number }>();
  results.forEach((result) => {
    if (typeof result.score !== 'number') return;
    const meta = testMeta.get(result.testId);
    const totalMarks = meta?.totalMarks || 100;
    const percent = Math.round((result.score / totalMarks) * 100);
    const bucket = scoresByStudent.get(result.studentId) || { total: 0, count: 0 };
    bucket.total += percent;
    bucket.count += 1;
    scoresByStudent.set(result.studentId, bucket);
  });

  const submissionsByStudent = new Map<string, { submitted: number; total: number; lastActive: Date | null }>();
  studentRows.forEach((row) => {
    submissionsByStudent.set(row.userId, { submitted: 0, total: 0, lastActive: null });
  });

  const assignmentsByClass = new Map<string, number>();
  assignments.forEach((assignment) => {
    assignmentsByClass.set(
      assignment.classId,
      (assignmentsByClass.get(assignment.classId) || 0) + 1
    );
  });

  studentRows.forEach((row) => {
    const total = assignmentsByClass.get(row.classId || '') || 0;
    const entry = submissionsByStudent.get(row.userId);
    if (entry) {
      entry.total = total;
    }
  });

  submissions.forEach((submission) => {
    const entry = submissionsByStudent.get(submission.studentId);
    if (!entry) return;
    if (submission.status !== 'missed') {
      entry.submitted += 1;
    }
    if (submission.submittedAt) {
      const date = new Date(submission.submittedAt);
      if (!entry.lastActive || entry.lastActive < date) {
        entry.lastActive = date;
      }
    }
  });

  results.forEach((result) => {
    const entry = submissionsByStudent.get(result.studentId);
    if (!entry) return;
    if (result.completedAt) {
      const date = new Date(result.completedAt);
      if (!entry.lastActive || entry.lastActive < date) {
        entry.lastActive = date;
      }
    }
  });

  notes.forEach((note) => {
    const entry = submissionsByStudent.get(note.studentId);
    if (!entry) return;
    if (note.updatedAt) {
      const date = new Date(note.updatedAt);
      if (!entry.lastActive || entry.lastActive < date) {
        entry.lastActive = date;
      }
    }
  });

  return studentRows.map((row, index) => {
    const scoreBucket = scoresByStudent.get(row.userId);
    const averageScore = scoreBucket && scoreBucket.count > 0 ? Math.round(scoreBucket.total / scoreBucket.count) : 0;
    const submission = submissionsByStudent.get(row.userId);
    const submissionRate = submission && submission.total > 0
      ? Math.round((submission.submitted / submission.total) * 100)
      : 0;
    return {
      id: `${row.userId}-${index}`,
      userId: row.userId,
      name: row.fullName,
      grade: row.grade,
      section: row.section,
      averageScore,
      submissionRate,
      lastActive: submission?.lastActive || new Date(),
    };
  });
};

export const getAssignments = async (userId: string) => {
  const assignments = await db
    .select({
      id: homeworkAssignments.id,
      title: homeworkAssignments.title,
      description: homeworkAssignments.description,
      chapter: homeworkAssignments.chapter,
      classId: homeworkAssignments.classId,
      dueDate: homeworkAssignments.dueDate,
      createdAt: homeworkAssignments.createdAt,
      subjectCode: subjects.code,
      grade: classes.grade,
      section: classes.section,
    })
    .from(homeworkAssignments)
    .leftJoin(subjects, eq(homeworkAssignments.subjectId, subjects.id))
    .leftJoin(classes, eq(homeworkAssignments.classId, classes.id))
    .where(eq(homeworkAssignments.teacherId, userId));

  if (assignments.length === 0) return [];

  const classIds = Array.from(new Set(assignments.map((assignment) => assignment.classId)));
  const students = await db
    .select({ classId: studentProfiles.classId })
    .from(studentProfiles)
    .where(inArray(studentProfiles.classId, classIds));

  const studentCountByClass = new Map<string, number>();
  students.forEach((student) => {
    if (!student.classId) return;
    studentCountByClass.set(student.classId, (studentCountByClass.get(student.classId) || 0) + 1);
  });

  const submissions = await db
    .select({
      assignmentId: homeworkSubmissions.assignmentId,
      status: homeworkSubmissions.status,
    })
    .from(homeworkSubmissions)
    .where(inArray(homeworkSubmissions.assignmentId, assignments.map((assignment) => assignment.id)));

  const submissionByAssignment = new Map<string, { submitted: number; graded: number }>();
  submissions.forEach((submission) => {
    const bucket = submissionByAssignment.get(submission.assignmentId) || { submitted: 0, graded: 0 };
    if (submission.status !== 'missed') {
      bucket.submitted += 1;
    }
    if (submission.status === 'checked' || submission.status === 'reviewed') {
      bucket.graded += 1;
    }
    submissionByAssignment.set(submission.assignmentId, bucket);
  });

  return assignments.map((assignment) => {
    const className = `Grade ${assignment.grade} - ${assignment.section}`;
    const submissionStats = submissionByAssignment.get(assignment.id) || { submitted: 0, graded: 0 };
    return {
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      chapter: assignment.chapter,
      classId: assignment.classId,
      className,
      subjectCode: assignment.subjectCode,
      dueDate: assignment.dueDate,
      createdAt: assignment.createdAt,
      totalStudents: studentCountByClass.get(assignment.classId) || 0,
      submittedCount: submissionStats.submitted,
      gradedCount: submissionStats.graded,
    };
  });
};

export const getSubmissions = async (userId: string, status?: string) => {
  const assignmentRows = await db
    .select({
      id: homeworkAssignments.id,
      title: homeworkAssignments.title,
      subjectCode: subjects.code,
    })
    .from(homeworkAssignments)
    .leftJoin(subjects, eq(homeworkAssignments.subjectId, subjects.id))
    .where(eq(homeworkAssignments.teacherId, userId));

  const assignmentIds = assignmentRows.map((assignment) => assignment.id);
  if (assignmentIds.length === 0) return [];

  const submissions = await db
    .select({
      id: homeworkSubmissions.id,
      assignmentId: homeworkSubmissions.assignmentId,
      studentId: homeworkSubmissions.studentId,
      submittedAt: homeworkSubmissions.submittedAt,
      status: homeworkSubmissions.status,
      score: homeworkSubmissions.score,
      aiFeedback: homeworkSubmissions.aiFeedback,
    })
    .from(homeworkSubmissions)
    .where(inArray(homeworkSubmissions.assignmentId, assignmentIds));

  const filtered = status === 'pending_review'
    ? submissions.filter((submission) => submission.status === 'submitted' || submission.status === 'pending')
    : submissions;

  if (filtered.length === 0) return [];

  const studentIds = Array.from(new Set(filtered.map((submission) => submission.studentId)));
  const studentProfilesData = await db
    .select({ id: profiles.id, fullName: profiles.fullName })
    .from(profiles)
    .where(inArray(profiles.id, studentIds));

  const studentNameById = new Map(studentProfilesData.map((student) => [student.id, student.fullName]));
  const assignmentById = new Map(assignmentRows.map((assignment) => [assignment.id, assignment]));

  return filtered.map((submission) => {
    const assignment = assignmentById.get(submission.assignmentId);
    return {
      id: submission.id,
      assignmentId: submission.assignmentId,
      homeworkTitle: assignment?.title || '',
      studentId: submission.studentId,
      studentName: studentNameById.get(submission.studentId) || '',
      subjectCode: assignment?.subjectCode || '',
      submittedAt: submission.submittedAt,
      status: submission.status,
      score: submission.score,
      aiSuggestion: submission.aiFeedback ? 'AI review available' : null,
    };
  });
};

export const getLessonPlans = async (userId: string) => {
  const plans = await db
    .select({
      id: lessonPlans.id,
      classId: lessonPlans.classId,
      subjectId: lessonPlans.subjectId,
      date: lessonPlans.date,
      topics: lessonPlans.topics,
      studentQueries: lessonPlans.studentQueries,
      weakAreas: lessonPlans.weakAreas,
      aiRecommendation: lessonPlans.aiRecommendation,
      status: lessonPlans.status,
      completedAt: lessonPlans.completedAt,
      grade: classes.grade,
      section: classes.section,
      subjectName: subjects.name,
    })
    .from(lessonPlans)
    .leftJoin(classes, eq(lessonPlans.classId, classes.id))
    .leftJoin(subjects, eq(lessonPlans.subjectId, subjects.id))
    .where(eq(lessonPlans.teacherId, userId));

  return plans.map((plan) => ({
    ...plan,
    className: `Grade ${plan.grade} - ${plan.section} • ${plan.subjectName}`,
  }));
};

export const getDailyDoses = async (userId: string) => {
  return db
    .select({
      id: dailyDoses.id,
      title: dailyDoses.title,
      description: dailyDoses.description,
      topics: dailyDoses.topics,
      estimatedTime: dailyDoses.estimatedTime,
      source: dailyDoses.source,
      completed: dailyDoses.completed,
      date: dailyDoses.date,
      completedAt: dailyDoses.completedAt,
    })
    .from(dailyDoses)
    .where(eq(dailyDoses.teacherId, userId));
};

export const getAssessments = async (userId: string) => {
  return db
    .select({
      id: teacherAssessments.id,
      title: teacherAssessments.title,
      totalQuestions: teacherAssessments.totalQuestions,
      duration: teacherAssessments.duration,
      scheduledDate: teacherAssessments.scheduledDate,
      completedAt: teacherAssessments.completedAt,
      score: teacherAssessments.score,
      status: teacherAssessments.status,
    })
    .from(teacherAssessments)
    .where(eq(teacherAssessments.teacherId, userId));
};

export const createAssignment = async (teacherId: string, assignmentData: {
  title: string;
  description?: string;
  chapter?: string;
  classId: string;
  subjectId: string;
  dueDate: Date;
}) => {
  try {
    const [assignment] = await db
      .insert(homeworkAssignments)
      .values({
        teacherId,
        title: assignmentData.title,
        description: assignmentData.description || null,
        chapter: assignmentData.chapter || null,
        classId: assignmentData.classId,
        subjectId: assignmentData.subjectId,
        dueDate: assignmentData.dueDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({
        id: homeworkAssignments.id,
        sequenceId: homeworkAssignments.sequenceId,
        title: homeworkAssignments.title,
        description: homeworkAssignments.description,
        chapter: homeworkAssignments.chapter,
        classId: homeworkAssignments.classId,
        subjectId: homeworkAssignments.subjectId,
        dueDate: homeworkAssignments.dueDate,
        createdAt: homeworkAssignments.createdAt,
        updatedAt: homeworkAssignments.updatedAt,
      });
    
    return assignment;
  } catch (error) {
    console.error('Error creating assignment in service:', error);
    throw error;
  }
};

export const getQueries = async (userId: string) => {
  const queries = await db
    .select({
      id: studentQueries.id,
      studentId: studentQueries.studentId,
      queryText: studentQueries.queryText,
      topic: studentQueries.topic,
      status: studentQueries.status,
      askedAt: studentQueries.askedAt,
      addressedAt: studentQueries.addressedAt,
      studentName: profiles.fullName,
    })
    .from(studentQueries)
    .leftJoin(profiles, eq(studentQueries.studentId, profiles.id))
    .where(eq(studentQueries.teacherId, userId));

  return queries.map((query) => ({
    id: query.id,
    studentName: query.studentName || 'Student',
    query: query.queryText,
    topic: query.topic,
    status: query.status,
    askedAt: query.askedAt,
    addressedAt: query.addressedAt,
  }));
};
