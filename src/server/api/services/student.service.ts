import { db } from '../../db';
import { studentProfiles, subjects, homeworkAssignments, homeworkSubmissions, profiles } from '../../db/schema';
import { eq, and, gt } from 'drizzle-orm';

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
