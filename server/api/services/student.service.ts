import { db } from '../../db';
import { studentProfiles, subjects, homeworkAssignments, homeworkSubmissions, profiles, classes, schools, tests, studentNotes } from '../../db/schema';
import { eq, and, gt, isNull, gte, inArray } from 'drizzle-orm';

export const getDashboardData = async (userId: string) => {
  const [profileData] = await db
    .select({
      fullName: profiles.fullName,
      avatarUrl: profiles.avatarUrl,
      streakDays: studentProfiles.streakDays,
      totalPoints: studentProfiles.totalPoints,
    })
    .from(studentProfiles)
    .leftJoin(profiles, eq(studentProfiles.userId, profiles.id))
    .where(eq(studentProfiles.userId, userId));

  const subjectsData = await db.select().from(subjects);

  const pendingTasksData = await db
    .select({
      id: homeworkAssignments.id,
      title: homeworkAssignments.title,
      subject: subjects.name,
      dueDate: homeworkAssignments.dueDate,
    })
    .from(homeworkAssignments)
    .leftJoin(subjects, eq(homeworkAssignments.subjectId, subjects.id))
    .leftJoin(homeworkSubmissions, and(
      eq(homeworkSubmissions.assignmentId, homeworkAssignments.id),
      eq(homeworkSubmissions.studentId, userId)
    ))
    .where(and(
      gt(homeworkAssignments.dueDate, new Date()),
      eq(homeworkSubmissions.status, 'pending')
    ));

  return {
    profile: profileData,
    subjects: subjectsData,
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
