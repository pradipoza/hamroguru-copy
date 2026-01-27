import { db } from '../../db';
import { users, profiles, userRoles } from '../../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NewUser } from '../../lib/types'; // This type will be created later

export const signup = async (userData: NewUser) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const [newUser] = await db.insert(users).values({
    email: userData.email,
    password: hashedPassword,
  }).returning();

  await db.insert(profiles).values({
    id: newUser.id,
    fullName: userData.fullName,
  });

  await db.insert(userRoles).values({
    userId: newUser.id,
    role: userData.role || 'student',
  });

  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET || 'your_default_secret', {
    expiresIn: '1d',
  });

  return { user: newUser, token };
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

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your_default_secret', {
    expiresIn: '1d',
  });

  return { user, token };
};
