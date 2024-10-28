import { type Cookies } from "@sveltejs/kit";
import { db } from "$lib/database";
import { randomBytes } from "crypto";
import { eq, getTableColumns } from "drizzle-orm";
import { sessionTable, userTable, type Session, type User } from "$lib/schema";

export function generateSessionToken(): string {
  return randomBytes(20).toString("base64url");
}

export async function generateSessionId(token: string): Promise<string> {
  const hasher = new Bun.CryptoHasher("sha256");
  return hasher.update(token).digest("hex");
}

export async function hashPassword(password: string): Promise<string> {
  return Bun.password.hash(password, {
    algorithm: "argon2id",
    memoryCost: 19 * 1024,
    timeCost: 2,
  });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return Bun.password.verify(password, hash);
}

export async function createSession(token: string, userId: number): Promise<Session> {
  // Create session and insert into database
  const sessionId = await generateSessionId(token);
  const sessions = await db
    .insert(sessionTable)
    .values({
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    })
    .returning();
  return sessions[0];
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
  // Check if session exists
  const sessionId = await generateSessionId(token);
  const { passwordHash, ...safeUserTable } = getTableColumns(userTable);
  const result = await db
    .select({ user: safeUserTable, session: sessionTable })
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(eq(sessionTable.id, sessionId));
  if (result.length < 1) return { session: null, user: null };
  const { user, session } = result[0];

  // If session has expired, delete it
  if (Date.now() >= session.expiresAt.getTime()) {
    await logout(sessionId);
    await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
    return { session: null, user: null };
  }

  // Extend session if it's recent
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 14) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 28);
    await db
      .update(sessionTable)
      .set({
        expiresAt: session.expiresAt,
      })
      .where(eq(sessionTable.id, session.id));
  }
  return { session, user };
}

export async function logout(sessionId: string): Promise<void> {
  // Remove session from database
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export async function register(email: string, password: string): Promise<void> {
  // Insert into database
  const passwordHash = await hashPassword(password);
  await db.insert(userTable).values({ email, passwordHash });
}

export async function login(email: string, password: string, cookies: Cookies): Promise<void> {
  // Get user from database
  const users = await db.select().from(userTable).where(eq(userTable.email, email));
  if (users.length == 0) throw new Error("E-mail or password is invalid");
  const user = users[0];

  // Verify password
  const correctPassword = await verifyPassword(password, user.passwordHash);
  if (!correctPassword) throw new Error("E-mail or password is invalid");

  // Create token and session
  const token = generateSessionToken();
  const session = await createSession(token, user.id);
  setSessionToken(token, session.expiresAt, cookies);
}

function setSessionToken(token: string, expiresAt: Date, cookies: Cookies): void {
  cookies.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

function removeSessionToken(cookies: Cookies): void {
  cookies.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export async function getUserAndSession(cookies: Cookies): Promise<SessionValidationResult> {
  // Check session cookie
  const token = cookies.get("session");
  if (!token) return { user: null, session: null };

  // Validate token
  const { user, session } = await validateSessionToken(token);
  if (user && session) {
    setSessionToken(token, session.expiresAt, cookies);
    return { user, session };
  } else {
    removeSessionToken(cookies);
  }
  return { user: null, session: null };
}

export type SessionValidationResult = { session: Session; user: User } | { session: null; user: null };
