import { db } from '../../db';
import { subjects, homeworkAssignments, homeworkSubmissions, studentNotes, tests, testResults, resources, aiTutorSessions, studentProfiles, teacherClassAssignments, profiles, classes, chatMemory } from '../../db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const AI_TUTOR_WEBHOOKS: Record<string, string> = {
  science: 'https://pradipoza.app.n8n.cloud/webhook/student-tutor',
  math: 'https://pradipoza.app.n8n.cloud/webhook/student-tutor',
  english: 'https://pradipoza.app.n8n.cloud/webhook/student-tutor',
  nepali: 'https://pradipoza.app.n8n.cloud/webhook/student-tutor',
  social: 'https://pradipoza.app.n8n.cloud/webhook/student-tutor',
  computer: 'https://pradipoza.app.n8n.cloud/webhook/student-tutor',
};

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

export const getAiTutorSession = async (subjectCode: string, studentId: string) => {
  const messages = await db
    .select()
    .from(chatMemory)
    .where(and(
      eq(chatMemory.sessionId, studentId),
      eq(chatMemory.subject, subjectCode)
    ))
    .orderBy(asc(chatMemory.createdAt));

  const formattedMessages = messages.map((msg: any) => ({
    role: msg.message?.type === 'human' ? 'user' : 'assistant',
    content: msg.message?.content || '',
    imageUrl: msg.message?.imageUrl || null,
    timestamp: msg.createdAt,
  }));

  return {
    id: studentId,
    subjectCode,
    studentId,
    messages: formattedMessages,
  };
};

export const addAiTutorMessage = async (
  subjectCode: string,
  studentId: string, 
  message: { role: 'user'; content: string; imageUrl?: string }
) => {
  const webhookUrl = AI_TUTOR_WEBHOOKS[subjectCode] || AI_TUTOR_WEBHOOKS.science;
  
  const headers: Record<string, string> = {
    'student_id': studentId,
    'question': message.content,
    'subject': subjectCode,
  };

  if (message.imageUrl) {
    const imageName = path.basename(message.imageUrl);
    const fullPath = path.join(process.cwd(), 'uploads', imageName);
    if (fs.existsSync(fullPath)) {
      const imageBuffer = fs.readFileSync(fullPath);
      const base64Image = imageBuffer.toString('base64');
      const ext = path.extname(imageName).toLowerCase().replace('.', '');
      const mimeType = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
      headers['image'] = `data:${mimeType};base64,${base64Image}`;
    }
  }

  try {
    const response = await axios.post(webhookUrl, '', {
      headers,
      timeout: 60000,
    });

    await new Promise(resolve => setTimeout(resolve, 500));
    
    const messages = await db
      .select()
      .from(chatMemory)
      .where(and(
        eq(chatMemory.sessionId, studentId),
        eq(chatMemory.subject, subjectCode)
      ))
      .orderBy(asc(chatMemory.createdAt));

    const formattedMessages = messages.map((msg: any) => ({
      role: msg.message?.type === 'human' ? 'user' : 'assistant',
      content: msg.message?.content || '',
      imageUrl: msg.message?.imageUrl || null,
      timestamp: msg.createdAt,
    }));

    return {
      id: studentId,
      subjectCode,
      studentId,
      messages: formattedMessages,
      aiResponse: response.data,
    };
  } catch (error: any) {
    console.error('Error calling AI tutor webhook:', error.message);
    throw new Error('Failed to get AI tutor response');
  }
};
