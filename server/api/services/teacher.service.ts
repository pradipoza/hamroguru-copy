import { db } from '../../db';
import { teacherProfiles, teacherClassAssignments, classes, subjects, profiles } from '../../db/schema';
import { eq } from 'drizzle-orm';

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
