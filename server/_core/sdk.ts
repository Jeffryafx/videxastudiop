import { COOKIE_NAME } from "@shared/const";
import { ForbiddenError } from "@shared/_core/errors";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

class SDKServer {
  constructor() {
    // Session-based authentication only
  }

  private parseCookies(cookieHeader: string | undefined) {
    if (!cookieHeader) {
      return new Map<string, string>();
    }

    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }

  async authenticateRequest(req: Request): Promise<User> {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);

    if (!sessionCookie) {
      throw ForbiddenError("Missing session cookie");
    }

    try {
      // Try to parse as user ID (email/password auth)
      const userId = parseInt(sessionCookie, 10);
      if (!isNaN(userId)) {
        const user = await db.getUserById(userId);
        if (user) {
          await db.updateUserLastSignedIn(userId);
          return user;
        }
      }
    } catch (error) {
      console.warn("[Auth] Failed to authenticate with user ID:", error);
    }

    throw ForbiddenError("Invalid session cookie");
  }
}

export const sdk = new SDKServer();
