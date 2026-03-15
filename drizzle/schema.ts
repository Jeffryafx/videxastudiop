import { 
  int, 
  mysqlEnum, 
  mysqlTable, 
  text, 
  timestamp, 
  varchar,
  decimal,
  boolean,
  datetime
} from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";

/**
 * VIDEXA STUDIO Database Schema
 * Full-stack project management system with authentication, quotes, projects, payments, and notifications
 */

// ==================== USERS & AUTHENTICATION ====================

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  password: text("password"), // For email/password auth
  loginMethod: varchar("loginMethod", { length: 64 }).default("email"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  company: text("company"),
  resetToken: text("resetToken"), // Password reset token
  resetTokenExpires: timestamp('resetTokenExpires'),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ==================== SERVICES ====================

export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  basePrice: decimal("basePrice", { precision: 10, scale: 2 }).notNull(),
  icon: varchar("icon", { length: 50 }),
  category: varchar("category", { length: 50 }).notNull(), // motion-edit, motion-graphics, brand-pack, captions, color-grading
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

// ==================== QUOTES (COTIZACIONES) ====================

export const quotes = mysqlTable("quotes", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  serviceId: int("serviceId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  estimatedPrice: decimal("estimatedPrice", { precision: 10, scale: 2 }),
  finalPrice: decimal("finalPrice", { precision: 10, scale: 2 }),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "completed"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  expiresAt: datetime("expiresAt"),
});

export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = typeof quotes.$inferInsert;

// ==================== PROJECTS ====================

export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  quoteId: int("quoteId").notNull(),
  clientId: int("clientId").notNull(),
  serviceId: int("serviceId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "in-progress", "completed", "on-hold", "cancelled"]).default("pending").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  
  // Project details
  deliverables: text("deliverables"), // JSON array of deliverables
  timeline: varchar("timeline", { length: 100 }), // e.g., "48h", "1 week"
  
  // File management
  clientFilesUrl: text("clientFilesUrl"), // S3 URL to uploaded files
  deliveryFilesUrl: text("deliveryFilesUrl"), // S3 URL to completed files
  
  // Tracking
  startDate: datetime("startDate"),
  dueDate: datetime("dueDate"),
  completedDate: datetime("completedDate"),
  
  // Team assignment
  assignedTo: int("assignedTo"), // Admin user ID
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// ==================== PROJECT UPDATES (REVISION ROUNDS) ====================

export const projectUpdates = mysqlTable("projectUpdates", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  updateType: mysqlEnum("updateType", ["revision-request", "status-change", "file-upload", "comment", "approval"]).notNull(),
  message: text("message"),
  fileUrl: text("fileUrl"), // S3 URL if applicable
  createdBy: int("createdBy").notNull(), // User ID
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProjectUpdate = typeof projectUpdates.$inferSelect;
export type InsertProjectUpdate = typeof projectUpdates.$inferInsert;

// ==================== PAYMENTS ====================

export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  quoteId: int("quoteId").notNull(),
  clientId: int("clientId").notNull(),
  
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  
  paymentMethod: mysqlEnum("paymentMethod", ["paypal", "stripe", "bank-transfer", "cash"]).notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "processing", "completed", "failed", "refunded"]).default("pending").notNull(),
  
  // PayPal/Stripe transaction IDs
  transactionId: varchar("transactionId", { length: 255 }),
  paypalOrderId: varchar("paypalOrderId", { length: 255 }),
  
  // Invoice tracking
  invoiceNumber: varchar("invoiceNumber", { length: 50 }).unique(),
  invoiceUrl: text("invoiceUrl"), // S3 URL to PDF invoice
  
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  paidAt: datetime("paidAt"),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

// ==================== NOTIFICATIONS ====================

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", [
    "quote-created",
    "quote-approved",
    "quote-rejected",
    "project-started",
    "project-update",
    "revision-requested",
    "payment-received",
    "project-completed",
    "message"
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  relatedProjectId: int("relatedProjectId"),
  relatedQuoteId: int("relatedQuoteId"),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// ==================== EMAIL LOGS ====================

export const emailLogs = mysqlTable("emailLogs", {
  id: int("id").autoincrement().primaryKey(),
  recipientEmail: varchar("recipientEmail", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  emailType: varchar("emailType", { length: 50 }).notNull(), // quote-confirmation, project-update, etc.
  status: mysqlEnum("status", ["sent", "failed", "bounced"]).default("sent").notNull(),
  relatedProjectId: int("relatedProjectId"),
  relatedQuoteId: int("relatedQuoteId"),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailLog = typeof emailLogs.$inferSelect;
export type InsertEmailLog = typeof emailLogs.$inferInsert;

// ==================== BLOG ARTICLES ====================

export const blogArticles = mysqlTable("blogArticles", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  category: varchar("category", { length: 50 }).notNull(), // Tutorial, Tendencias, Negocio, etc
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  thumbnailUrl: text("thumbnailUrl"), // S3 URL
  readingTime: int("readingTime"), // in minutes
  authorId: int("authorId").notNull(),
  isPublished: boolean("isPublished").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogArticle = typeof blogArticles.$inferSelect;
export type InsertBlogArticle = typeof blogArticles.$inferInsert;

// ==================== PORTFOLIO ITEMS ====================

export const portfolioItems = mysqlTable("portfolioItems", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull(), // reel, motion-graphics, brand-pack, captions, promo
  duration: varchar("duration", { length: 50 }), // e.g., "60s", "30s"
  thumbnailUrl: text("thumbnailUrl"), // S3 URL
  videoUrl: text("videoUrl"), // S3 URL or YouTube embed
  clientName: varchar("clientName", { length: 255 }),
  isPublic: boolean("isPublic").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type InsertPortfolioItem = typeof portfolioItems.$inferInsert;

// ==================== RELATIONS ====================

export const usersRelations = relations(users, ({ many }) => ({
  quotes: many(quotes),
  projects: many(projects),
  notifications: many(notifications),
  payments: many(payments),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  quotes: many(quotes),
  projects: many(projects),
}));

export const quotesRelations = relations(quotes, ({ one, many }) => ({
  client: one(users, { fields: [quotes.clientId], references: [users.id] }),
  service: one(services, { fields: [quotes.serviceId], references: [services.id] }),
  projects: many(projects),
  payments: many(payments),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  client: one(users, { fields: [projects.clientId], references: [users.id] }),
  quote: one(quotes, { fields: [projects.quoteId], references: [quotes.id] }),
  service: one(services, { fields: [projects.serviceId], references: [services.id] }),
  assignee: one(users, { fields: [projects.assignedTo], references: [users.id] }),
  updates: many(projectUpdates),
  payments: many(payments),
  portfolioItems: many(portfolioItems),
}));

export const projectUpdatesRelations = relations(projectUpdates, ({ one }) => ({
  project: one(projects, { fields: [projectUpdates.projectId], references: [projects.id] }),
  creator: one(users, { fields: [projectUpdates.createdBy], references: [users.id] }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  project: one(projects, { fields: [payments.projectId], references: [projects.id] }),
  quote: one(quotes, { fields: [payments.quoteId], references: [quotes.id] }),
  client: one(users, { fields: [payments.clientId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
  project: one(projects, { fields: [notifications.relatedProjectId], references: [projects.id] }),
  quote: one(quotes, { fields: [notifications.relatedQuoteId], references: [quotes.id] }),
}));

export const portfolioItemsRelations = relations(portfolioItems, ({ one }) => ({
  project: one(projects, { fields: [portfolioItems.projectId], references: [projects.id] }),
}));
