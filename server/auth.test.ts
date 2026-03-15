import { describe, it, expect, beforeEach, vi } from "vitest";
import { hashPassword, verifyPassword, registerUser, loginUser } from "./auth";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

vi.mock("./db", () => ({
  getUserByEmail: vi.fn(),
  createUser: vi.fn(),
  updateUserLastSignedIn: vi.fn(),
}));

describe("Authentication", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("hashPassword", () => {
    it("should hash a password", async () => {
      const password = "testPassword123";
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(20);
    });

    it("should produce different hashes for the same password", async () => {
      const password = "testPassword123";
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("verifyPassword", () => {
    it("should verify a correct password", async () => {
      const password = "testPassword123";
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);

      expect(isValid).toBe(true);
    });

    it("should reject an incorrect password", async () => {
      const password = "testPassword123";
      const hash = await hashPassword(password);
      const isValid = await verifyPassword("wrongPassword", hash);

      expect(isValid).toBe(false);
    });
  });

  describe("registerUser", () => {
    it("should register a new user", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        name: "Test User",
        role: "user",
        password: "hashedPassword",
      };

      vi.mocked(db.getUserByEmail).mockResolvedValue(undefined);
      vi.mocked(db.createUser).mockResolvedValue({ insertId: 1 } as any);

      const result = await registerUser("test@example.com", "password123", "Test User");

      expect(db.getUserByEmail).toHaveBeenCalledWith("test@example.com");
      expect(db.createUser).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it("should reject if user already exists", async () => {
      const existingUser = {
        id: 1,
        email: "test@example.com",
        name: "Existing User",
      };

      vi.mocked(db.getUserByEmail).mockResolvedValue(existingUser as any);

      await expect(
        registerUser("test@example.com", "password123", "Test User")
      ).rejects.toThrow("Este email ya está registrado");
    });

    it("should reject password shorter than 6 characters", async () => {
      vi.mocked(db.getUserByEmail).mockResolvedValue(undefined);

      await expect(
        registerUser("test@example.com", "short", "Test User")
      ).rejects.toThrow("La contraseña debe tener al menos 6 caracteres");
    });
  });

  describe("loginUser", () => {
    it("should login a user with correct credentials", async () => {
      const password = "password123";
      const hash = await hashPassword(password);
      const mockUser = {
        id: 1,
        email: "test@example.com",
        name: "Test User",
        password: hash,
        role: "user",
      };

      vi.mocked(db.getUserByEmail).mockResolvedValue(mockUser as any);
      vi.mocked(db.updateUserLastSignedIn).mockResolvedValue({} as any);

      const result = await loginUser("test@example.com", password);

      expect(result).toBeDefined();
      expect(result.email).toBe("test@example.com");
      expect(db.updateUserLastSignedIn).toHaveBeenCalledWith(1);
    });

    it("should reject if user not found", async () => {
      vi.mocked(db.getUserByEmail).mockResolvedValue(undefined);

      await expect(
        loginUser("notfound@example.com", "password123")
      ).rejects.toThrow("Email o contraseña incorrectos");
    });

    it("should reject if password is incorrect", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: await hashPassword("correctPassword"),
      };

      vi.mocked(db.getUserByEmail).mockResolvedValue(mockUser as any);

      await expect(
        loginUser("test@example.com", "wrongPassword")
      ).rejects.toThrow("Email o contraseña incorrectos");
    });

    it("should reject if user has no password", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: null,
      };

      vi.mocked(db.getUserByEmail).mockResolvedValue(mockUser as any);

      await expect(
        loginUser("test@example.com", "password123")
      ).rejects.toThrow("Este usuario no tiene contraseña configurada");
    });
  });
});
