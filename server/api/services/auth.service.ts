import { db } from '../../db';
import { users, profiles, userRoles, studentProfiles, teacherProfiles, subjects, teacherClassAssignments } from '../../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NewUser } from '../../lib/types'; // This type will be created later
import { ensureDefaultSchoolAndClass } from './school.service';

export const signup = async (userData: NewUser) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const [newUser] = await db.insert(users).values({
    email: userData.email,
    password: hashedPassword,
  }).returning();

  const [newProfile] = await db.insert(profiles).values({
    id: newUser.id,
    fullName: userData.fullName,
  }).returning();

  const [newRole] = await db.insert(userRoles).values({
    userId: newUser.id,
    role: userData.role || 'student',
  }).returning();

  const role = newRole.role;
  const { school, schoolClass } = await ensureDefaultSchoolAndClass();

  // Create role-specific profile
  if (role === 'student') {
    await db.insert(studentProfiles).values({
      userId: newUser.id,
      classId: schoolClass.id,
    });
  } else if (role === 'teacher') {
    if (!userData.subjectCode) {
      throw new Error('Subject selection is required for teachers');
    }

    const [subject] = await db
      .select()
      .from(subjects)
      .where(eq(subjects.code, userData.subjectCode));

    if (!subject) {
      throw new Error('Invalid subject selected');
    }

    await db.insert(teacherProfiles).values({
      userId: newUser.id,
      schoolId: school.id,
      subjectsTaught: [subject.name],
    });

    await db.insert(teacherClassAssignments).values({
      teacherId: newUser.id,
      classId: schoolClass.id,
      subjectId: subject.id,
      academicYear: schoolClass.academicYear,
    });
  }

  const token = jwt.sign({ id: newUser.id, role }, process.env.JWT_SECRET || 'your_default_secret', {
    expiresIn: '1d',
  });

  // Remove password from user object
  const { password, ...userWithoutPassword } = newUser;

  return { 
    user: userWithoutPassword, 
    profile: newProfile,
    role,
    token 
  };
};

export const signin = async (credentials: Pick<NewUser, 'email' | 'password'>) => {
  const [user] = await db.select().from(users).where(eq(users.email, credentials.email));

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Fetch profile and role
  const [userProfile] = await db.select().from(profiles).where(eq(profiles.id, user.id));
  const [userRole] = await db.select().from(userRoles).where(eq(userRoles.userId, user.id));

  if (!userRole) {
    throw new Error('User role not found');
  }

  const role = userRole.role;
  const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET || 'your_default_secret', {
    expiresIn: '1d',
  });

  // Remove password from user object
  const { password, ...userWithoutPassword } = user;

  return { 
    user: userWithoutPassword, 
    profile: userProfile || null,
    role,
    token 
  };
};
