import { db } from '../../db';
import { schools, classes } from '../../db/schema';
import { and, eq } from 'drizzle-orm';
import { DEFAULT_CLASS, DEFAULT_SCHOOL } from '../../lib/config';

export const ensureDefaultSchoolAndClass = async () => {
  let [school] = await db
    .select()
    .from(schools)
    .where(eq(schools.name, DEFAULT_SCHOOL.name));

  if (!school) {
    [school] = await db
      .insert(schools)
      .values({
        name: DEFAULT_SCHOOL.name,
        address: DEFAULT_SCHOOL.address,
        type: DEFAULT_SCHOOL.type,
        contactPhone: DEFAULT_SCHOOL.contactPhone,
        contactEmail: DEFAULT_SCHOOL.contactEmail,
      })
      .returning();
  }

  let [schoolClass] = await db
    .select()
    .from(classes)
    .where(
      and(
        eq(classes.schoolId, school.id),
        eq(classes.grade, DEFAULT_CLASS.grade),
        eq(classes.section, DEFAULT_CLASS.section),
        eq(classes.academicYear, DEFAULT_CLASS.academicYear)
      )
    );

  if (!schoolClass) {
    [schoolClass] = await db
      .insert(classes)
      .values({
        schoolId: school.id,
        grade: DEFAULT_CLASS.grade,
        section: DEFAULT_CLASS.section,
        academicYear: DEFAULT_CLASS.academicYear,
      })
      .returning();
  }

  return { school, schoolClass };
};
