import bcrypt from "bcryptjs";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { users } from "../drizzle/schema";
import { eq, gt, and } from "drizzle-orm";

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Register a new user with email and password
 */
export async function registerUser(email: string, password: string, name: string, role: "user" | "admin" = "user") {
  // Check if user already exists
  const existingUser = await db.getUserByEmail(email);
  if (existingUser) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Este email ya está registrado",
    });
  }

  // Validate password
  if (password.length < 6) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "La contraseña debe tener al menos 6 caracteres",
    });
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const result = await db.createUser({
    email,
    password: hashedPassword,
    name,
    role,
    loginMethod: "email",
  });

  return result;
}

/**
 * Generate a password reset token
 */
export function generateResetToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string) {
  const user = await db.getUserByEmail(email);

  if (!user) {
    // Don't reveal if email exists for security
    return { success: true, message: "Si el email existe, recibirás un enlace de recuperación" };
  }

  const resetToken = generateResetToken();
  const resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

  // Save token to database
  const dbInstance = await db.getDb();
  if (dbInstance) {
    await dbInstance.update(users).set({
      resetToken,
      resetTokenExpires,
    }).where(eq(users.id, user.id));
  }

  // In production, send email with reset link
  // For now, just return the token (in production, never expose this)
  console.log(`[Password Reset] Token for ${email}: ${resetToken}`);

  return { success: true, message: "Si el email existe, recibirás un enlace de recuperación" };
}

/**
 * Reset password with token
 */
export async function resetPasswordWithToken(token: string, newPassword: string) {
  const dbInstance = await db.getDb();
  if (!dbInstance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

  // Find user with valid token
  const foundUsers = await dbInstance.select().from(users).where(
    and(
      eq(users.resetToken, token),
      gt(users.resetTokenExpires, new Date())
    )
  );

  if (foundUsers.length === 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Token inválido o expirado",
    });
  }

  const user = foundUsers[0];

  // Validate new password
  if (newPassword.length < 6) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "La contraseña debe tener al menos 6 caracteres",
    });
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password and clear reset token
  await dbInstance.update(users).set({
    password: hashedPassword,
    resetToken: null,
    resetTokenExpires: null,
  }).where(eq(users.id, user.id));

  return { success: true, message: "Contraseña actualizada exitosamente" };
}

/**
 * Login user with email and password
 */
export async function loginUser(email: string, password: string) {
  const user = await db.getUserByEmail(email);

  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Email o contraseña incorrectos",
    });
  }

  if (!user.password) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Este usuario no tiene contraseña configurada",
    });
  }

  // Verify password
  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Email o contraseña incorrectos",
    });
  }

  // Update last signed in
  await db.updateUserLastSignedIn(user.id);

  return user;
}
