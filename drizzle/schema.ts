import { mysqlTable, mysqlSchema, AnyMySqlColumn, index, foreignKey, unique, int, varchar, text, timestamp, mysqlEnum, datetime, decimal, tinyint } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const blogarticles = mysqlTable("blogarticles", {
	id: int().autoincrement().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	category: varchar({ length: 50 }).notNull(),
	excerpt: text(),
	content: text().notNull(),
	thumbnailUrl: text(),
	readingTime: int(),
	authorId: int().notNull().references(() => users.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	isPublished: tinyint().default(0).notNull(),
	publishedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	index("authorId").on(table.authorId),
	index("idx_blogarticles_slug").on(table.slug),
	unique("slug").on(table.slug),
]);

export const emaillogs = mysqlTable("emaillogs", {
	id: int().autoincrement().primaryKey().notNull(),
	recipientEmail: varchar({ length: 320 }).notNull(),
	subject: varchar({ length: 255 }).notNull(),
	emailType: varchar({ length: 50 }).notNull(),
	status: mysqlEnum(['sent','failed','bounced']).default('sent').notNull(),
	relatedProjectId: int().references(() => projects.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	relatedQuoteId: int().references(() => quotes.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	errorMessage: text(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	index("relatedProjectId").on(table.relatedProjectId),
	index("relatedQuoteId").on(table.relatedQuoteId),
]);

export const notifications = mysqlTable("notifications", {
	id: int().autoincrement().primaryKey().notNull(),
	userId: int().notNull().references(() => users.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	type: mysqlEnum(['quote-created','quote-approved','quote-rejected','project-started','project-update','revision-requested','project-completed','message']).notNull(),
	title: varchar({ length: 255 }).notNull(),
	message: text(),
	relatedProjectId: int().references(() => projects.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	relatedQuoteId: int().references(() => quotes.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	isRead: tinyint().default(0).notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	index("relatedProjectId").on(table.relatedProjectId),
	index("relatedQuoteId").on(table.relatedQuoteId),
	index("idx_notifications_userId").on(table.userId),
	index("idx_notifications_type").on(table.type),
]);

export const portfolioitems = mysqlTable("portfolioitems", {
	id: int().autoincrement().primaryKey().notNull(),
	projectId: int().references(() => projects.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	category: varchar({ length: 50 }).notNull(),
	duration: varchar({ length: 50 }),
	thumbnailUrl: text(),
	videoUrl: text(),
	clientName: varchar({ length: 255 }),
	isPublic: tinyint().default(0).notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	index("idx_portfolioitems_projectId").on(table.projectId),
]);

export const projects = mysqlTable("projects", {
	id: int().autoincrement().primaryKey().notNull(),
	quoteId: int().notNull().references(() => quotes.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	clientId: int().notNull().references(() => users.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	serviceId: int().notNull().references(() => services.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	status: mysqlEnum(['pending','in-progress','completed','on-hold','cancelled']).default('pending').notNull(),
	priority: mysqlEnum(['low','medium','high','urgent']).default('medium').notNull(),
	deliverables: text(),
	timeline: varchar({ length: 100 }),
	clientFilesUrl: text(),
	deliveryFilesUrl: text(),
	startDate: datetime({ mode: 'string'}),
	dueDate: datetime({ mode: 'string'}),
	completedDate: datetime({ mode: 'string'}),
	assignedTo: int().references(() => users.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	index("serviceId").on(table.serviceId),
	index("assignedTo").on(table.assignedTo),
	index("idx_projects_clientId").on(table.clientId),
	index("idx_projects_quoteId").on(table.quoteId),
]);

export const projectupdates = mysqlTable("projectupdates", {
	id: int().autoincrement().primaryKey().notNull(),
	projectId: int().notNull().references(() => projects.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	updateType: mysqlEnum(['revision-request','status-change','file-upload','comment','approval']).notNull(),
	message: text(),
	fileUrl: text(),
	createdBy: int().notNull().references(() => users.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	index("createdBy").on(table.createdBy),
	index("idx_projectupdates_projectId").on(table.projectId),
]);

export const quotes = mysqlTable("quotes", {
	id: int().autoincrement().primaryKey().notNull(),
	clientId: int().notNull().references(() => users.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	serviceId: int().notNull().references(() => services.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	estimatedPrice: decimal({ precision: 10, scale: 2 }),
	finalPrice: decimal({ precision: 10, scale: 2 }),
	status: mysqlEnum(['pending','approved','rejected','completed']).default('pending').notNull(),
	notes: text(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	expiresAt: datetime({ mode: 'string'}),
},
(table) => [
	index("idx_quotes_clientId").on(table.clientId),
	index("idx_quotes_serviceId").on(table.serviceId),
]);

export const services = mysqlTable("services", {
	id: int().autoincrement().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 100 }).notNull(),
	description: text(),
	basePrice: decimal({ precision: 10, scale: 2 }).notNull(),
	icon: varchar({ length: 50 }),
	category: varchar({ length: 50 }).notNull(),
	isActive: tinyint().default(1).notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	features: text(),
},
(table) => [
	unique("slug").on(table.slug),
]);

export const users = mysqlTable("users", {
	id: int().autoincrement().primaryKey().notNull(),
	openId: varchar({ length: 64 }),
	name: text(),
	email: varchar({ length: 320 }).notNull(),
	phone: varchar({ length: 20 }),
	password: text(),
	loginMethod: varchar({ length: 64 }).default('email'),
	role: mysqlEnum(['user','admin']).default('user').notNull(),
	company: text(),
	resetToken: text(),
	resetTokenExpires: timestamp({ mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	lastSignedIn: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	unique("email").on(table.email),
	unique("users_openId_unique").on(table.openId),
]);

// Export types
export type BlogArticle = typeof blogarticles.$inferSelect;
export type InsertBlogArticle = typeof blogarticles.$inferInsert;

export type EmailLog = typeof emaillogs.$inferSelect;
export type InsertEmailLog = typeof emaillogs.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

export type PortfolioItem = typeof portfolioitems.$inferSelect;
export type InsertPortfolioItem = typeof portfolioitems.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

export type ProjectUpdate = typeof projectupdates.$inferSelect;
export type InsertProjectUpdate = typeof projectupdates.$inferInsert;

export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = typeof quotes.$inferInsert;

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
