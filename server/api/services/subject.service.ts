import { db } from '../../db';
import { subjects, homeworkAssignments, homeworkSubmissions, studentNotes, tests, testResults, resources, aiTutorSessions, studentProfiles, teacherClassAssignments, profiles, classes } from '../../db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';

export const getAllSubjects = async () => {
  const subjectsData = await db.select().from(subjects).orderBy(asc(subjects.name));
  return subjectsData;
};

export const getSubjectByCode = async (subjectCode: string) => {
  const [subjectData] = await db.select().from(subjects).where(eq(subjects.code, subjectCode));
  return subjectData;
};

export const getSubjectWithTeacherForStudent = async (subjectCode: string, studentId: string) => {
  const [subjectData] = await db.select().from(subjects).where(eq(subjects.code, subjectCode));
  if (!subjectData) return null;

  const [studentProfile] = await db
    .select({ classId: studentProfiles.classId })
    .from(studentProfiles)
    .where(eq(studentProfiles.userId, studentId));

  if (!studentProfile?.classId) {
    return subjectData;
  }

  const [classInfo] = await db
    .select({ grade: classes.grade, section: classes.section })
    .from(classes)
    .where(eq(classes.id, studentProfile.classId));

  const [assignment] = await db
    .select({
      teacherName: profiles.fullName,
    })
    .from(teacherClassAssignments)
    .leftJoin(profiles, eq(teacherClassAssignments.teacherId, profiles.id))
    .where(and(
      eq(teacherClassAssignments.classId, studentProfile.classId),
      eq(teacherClassAssignments.subjectId, subjectData.id)
    ))
    .orderBy(desc(teacherClassAssignments.createdAt))
    .limit(1);

  return {
    ...subjectData,
    teacherName: assignment?.teacherName || null,
    classGrade: classInfo?.grade || null,
    classSection: classInfo?.section || null,
  };
};

export const getHomeworkForSubject = async (subjectId: string, classId: string, studentId: string) => {
  const homeworkData = await db
    .select({
      id: homeworkAssignments.id,
      title: homeworkAssignments.title,
      description: homeworkAssignments.description,
      chapter: homeworkAssignments.chapter,
      dueDate: homeworkAssignments.dueDate,
      status: homeworkSubmissions.status,
      score: homeworkSubmissions.score,
    })
    .from(homeworkAssignments)
    .leftJoin(
      homeworkSubmissions,
      and(
        eq(homeworkAssignments.id, homeworkSubmissions.assignmentId),
        eq(homeworkSubmissions.studentId, studentId)
      )
    )
    .where(and(
      eq(homeworkAssignments.subjectId, subjectId),
      eq(homeworkAssignments.classId, classId)
    ))
    .orderBy(desc(homeworkAssignments.dueDate));

  // Drizzle returns null for status if no submission exists, so we default it to 'pending'.
  return homeworkData.map(hw => ({ ...hw, status: hw.status || 'pending' }));
};

export const getNotesForSubject = async (subjectId: string, studentId: string) => {
  const notesData = await db
    .select()
    .from(studentNotes)
    .where(and(
      eq(studentNotes.subjectId, subjectId),
      eq(studentNotes.studentId, studentId)
    ))
    .orderBy(desc(studentNotes.createdAt));
  return notesData;
};

export const getTestsForSubject = async (subjectId: string, classId: string, studentId: string) => {
  const testsData = await db
    .select({
      id: tests.id,
      title: tests.title,
      chapter: tests.chapter,
      type: tests.type,
      totalQuestions: tests.totalQuestions,
      totalMarks: tests.totalMarks,
      duration: tests.duration,
      scheduledDate: tests.scheduledDate,
      status: tests.status,
      score: testResults.score,
      completedAt: testResults.completedAt,
    })
    .from(tests)
    .leftJoin(
      testResults,
      and(
        eq(tests.id, testResults.testId),
        eq(testResults.studentId, studentId)
      )
    )
    .where(and(
      eq(tests.subjectId, subjectId),
      eq(tests.classId, classId)
    ))
    .orderBy(desc(tests.scheduledDate));
  return testsData;
};

export const getResourcesForSubject = async (subjectId: string) => {
  const resourcesData = await db
    .select()
    .from(resources)
    .where(eq(resources.subjectId, subjectId))
    .orderBy(desc(resources.createdAt));
  return resourcesData;
};

export const getAiTutorSession = async (subjectId: string, studentId: string) => {
  let [session] = await db
    .select()
    .from(aiTutorSessions)
    .where(and(
      eq(aiTutorSessions.subjectId, subjectId),
      eq(aiTutorSessions.studentId, studentId)
    ))
    .orderBy(desc(aiTutorSessions.createdAt))
    .limit(1);

  if (!session) {
    [session] = await db.insert(aiTutorSessions).values({
      subjectId,
      studentId,
      messages: [],
    }).returning();
  }

  return session;
};

export const addAiTutorMessage = async (sessionId: string, message: { role: 'user' | 'assistant', content: string }) => {
  const [session] = await db.select().from(aiTutorSessions).where(eq(aiTutorSessions.id, sessionId));
  if (!session) {
    throw new Error('Session not found');
  }

  const updatedMessages = [...(session.messages || []), message];
  
  // Mock AI Response
  const aiResponse = {
    role: 'assistant',
    content: 'This is a mocked AI response. In a real application, this would be generated by an AI model.',
  };
  updatedMessages.push(aiResponse);

  const [updatedSession] = await db
    .update(aiTutorSessions)
    .set({ messages: updatedMessages })
    .where(eq(aiTutorSessions.id, sessionId))
    .returning();

  return updatedSession;
};
