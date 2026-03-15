import bcrypt from "bcryptjs";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { users } from "../drizzle/schema";
import { eq, gt, and } from "drizzle-orm";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return password;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return password === hash;
}

export async function registerUser(email: string, password: string, name: string, role: "user" | "admin" = "user") {

  const existingUser = await db.getUserByEmail(email);
  if (existingUser) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Este email ya está registrado",
    });
  }

if (password.length < 6) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "La contraseña debe tener al menos 6 caracteres",
    });
  }

const hashedPassword = await hashPassword(password);

const result = await db.createUser({
    email,
    password: hashedPassword,
    name,
    role,
    loginMethod: "email",
  });

  return result;
}

export function generateResetToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function requestPasswordReset(email: string) {
  const user = await db.getUserByEmail(email);

  if (!user) {

    return { success: true, message: "Si el email existe, recibirás un enlace de recuperación" };
  }

  const resetToken = generateResetToken();
  const resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000);

const dbInstance = await db.getDb();
  if (dbInstance) {
    await dbInstance.update(users).set({
      resetToken,
      resetTokenExpires,
    }).where(eq(users.id, user.id));
  }

console.log(`[Password Reset] Token for ${email}: ${resetToken}`);

  return { success: true, message: "Si el email existe, recibirás un enlace de recuperación" };
}

export async function resetPasswordWithToken(token: string, newPassword: string) {
  const dbInstance = await db.getDb();
  if (!dbInstance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

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

if (newPassword.length < 6) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "La contraseña debe tener al menos 6 caracteres",
    });
  }

const hashedPassword = await hashPassword(newPassword);

await dbInstance.update(users).set({
    password: hashedPassword,
    resetToken: null,
    resetTokenExpires: null,
  }).where(eq(users.id, user.id));

  return { success: true, message: "Contraseña actualizada exitosamente" };
}

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

const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Email o contraseña incorrectos",
    });
  }

await db.updateUserLastSignedIn(user.id);

  return user;
}
