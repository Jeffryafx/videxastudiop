import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import {
  InsertUser,
  users,
  quotes,
  projects,
  payments,
  services,
  notifications,
  projectUpdates,
  emailLogs,
  portfolioItems,
  blogArticles,
  InsertQuote,
  InsertProject,
  InsertPayment,
  InsertNotification,
  InsertProjectUpdate,
  InsertEmailLog,
  InsertService,
  InsertPortfolioItem,
  InsertBlogArticle,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: any = null;

export async function getDb() {
  if (!_db) {
    const connectionConfig = process.env.DATABASE_URL ? process.env.DATABASE_URL : {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "videxa",
    };
    const pool = mysql.createPool(connectionConfig as any);
    _db = drizzle(pool) as any;
  }
  return _db;
}

export async function upsertUser(user: Partial<InsertUser> & { openId: string }): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: Partial<InsertUser> = {
      openId: user.openId,
      email: user.email || `user-${user.openId}@videxa.studio`,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "phone", "company", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field as keyof typeof user];
      if (value === undefined) return;
      const normalized = value ?? null;
      (values as Record<string, unknown>)[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

await db.insert(users).values(values as InsertUser).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUser(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(users).values({
    email: data.email,
    password: data.password,
    name: data.name,
    role: data.role || 'user',
    loginMethod: data.loginMethod || 'email',
    lastSignedIn: new Date(),
  });
  return result;
}

export async function updateUserLastSignedIn(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, id));
}

export async function updateUserRole(id: number, role: 'user' | 'admin') {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(users).set({ role }).where(eq(users.id, id));
}

export async function getAdminUsers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(users).where(eq(users.role, 'admin'));
}

export async function getServices() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(services).where(eq(services.isActive, true));
}

export async function getServiceById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createService(data: InsertService) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(services).values(data);
  const insertedId = result[0].insertId;
  const service = await db.select().from(services).where(eq(services.id, insertedId as any)).limit(1);
  return service[0];
}

export async function updateService(id: number, data: Partial<InsertService>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.update(services).set(data).where(eq(services.id, id));
  return result;
}

export async function deleteService(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.update(services).set({ isActive: false }).where(eq(services.id, id));
  return result;
}

export async function createQuote(data: InsertQuote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(quotes).values(data);
  return result;
}

export async function getQuoteById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(quotes).where(eq(quotes.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getClientQuotes(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(quotes).where(eq(quotes.clientId, clientId)).orderBy(desc(quotes.createdAt));
}

export async function getAllQuotes() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(quotes).orderBy(desc(quotes.createdAt));
}

export async function updateQuoteStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(quotes).set({ status: status as any }).where(eq(quotes.id, id));
}

export async function createProject(data: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(projects).values(data);
  return result;
}

export async function getProjectById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getClientProjects(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(projects).where(eq(projects.clientId, clientId)).orderBy(desc(projects.createdAt));
}

export async function getAllProjects() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(projects).orderBy(desc(projects.createdAt));
}

export async function updateProjectStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(projects).set({ status: status as any, updatedAt: new Date() }).where(eq(projects.id, id));
}

export async function updateProjectProgress(id: number, data: Partial<typeof projects.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(projects).set({ ...data, updatedAt: new Date() }).where(eq(projects.id, id));
}

export async function addProjectUpdate(data: InsertProjectUpdate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(projectUpdates).values(data);
}

export async function getProjectUpdates(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(projectUpdates).where(eq(projectUpdates.projectId, projectId)).orderBy(desc(projectUpdates.createdAt));
}

export async function createPayment(data: InsertPayment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(payments).values(data);
}

export async function getPaymentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(payments).where(eq(payments.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProjectPayments(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(payments).where(eq(payments.projectId, projectId));
}

export async function updatePaymentStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(payments).set({
    paymentStatus: status as any,
    paidAt: status === 'completed' ? new Date() : undefined,
    updatedAt: new Date()
  }).where(eq(payments.id, id));
}

export async function createNotification(data: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(notifications).values(data);
}

export async function getUserNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
}

export async function logEmail(data: InsertEmailLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(emailLogs).values(data);
}

export async function getEmailLogs(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(emailLogs).orderBy(desc(emailLogs.createdAt)).limit(limit);
}

export async function createPortfolioItem(data: InsertPortfolioItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(portfolioItems).values(data);
  const insertedId = result[0].insertId;
  const item = await db.select().from(portfolioItems).where(eq(portfolioItems.id, insertedId as any)).limit(1);
  return item[0];
}

export async function getPublicPortfolioItems() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(portfolioItems).where(eq(portfolioItems.isPublic, true)).orderBy(desc(portfolioItems.createdAt));
}

export async function getProjectPortfolioItems(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(portfolioItems).where(eq(portfolioItems.projectId, projectId));
}

export async function updatePortfolioItem(id: number, data: Partial<InsertPortfolioItem>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(portfolioItems).set(data).where(eq(portfolioItems.id, id));
}

export async function deletePortfolioItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(portfolioItems).where(eq(portfolioItems.id, id));
}

export async function createBlogArticle(data: InsertBlogArticle) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(blogArticles).values(data);
  // Retrieve the created article
  const insertedId = result[0].insertId;
  const article = await getBlogArticleById(insertedId as any);
  return article;
}

export async function getBlogArticles(limit?: number) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(blogArticles).where(eq(blogArticles.isPublished, true)).orderBy(desc(blogArticles.publishedAt));
  if (limit) {
    query = query.limit(limit) as any;
  }
  return await query;
}

export async function getAllBlogArticles() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(blogArticles).orderBy(desc(blogArticles.publishedAt));
}

export async function getBlogArticleBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(blogArticles).where(eq(blogArticles.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getBlogArticleById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(blogArticles).where(eq(blogArticles.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateBlogArticle(id: number, data: Partial<InsertBlogArticle>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(blogArticles).set(data).where(eq(blogArticles.id, id));
}

export async function deleteBlogArticle(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(blogArticles).where(eq(blogArticles.id, id));
}
