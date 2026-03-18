import { relations } from "drizzle-orm/relations";
import { users, blogarticles, projects, emaillogs, quotes, notifications, portfolioitems, services, projectupdates } from "./schema";

export const blogarticlesRelations = relations(blogarticles, ({one}) => ({
	user: one(users, {
		fields: [blogarticles.authorId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	blogarticles: many(blogarticles),
	notifications: many(notifications),
	projects_clientId: many(projects, {
		relationName: "projects_clientId_users_id"
	}),
	projects_assignedTo: many(projects, {
		relationName: "projects_assignedTo_users_id"
	}),
	projectupdates: many(projectupdates),
	quotes: many(quotes),
}));

export const emaillogsRelations = relations(emaillogs, ({one}) => ({
	project: one(projects, {
		fields: [emaillogs.relatedProjectId],
		references: [projects.id]
	}),
	quote: one(quotes, {
		fields: [emaillogs.relatedQuoteId],
		references: [quotes.id]
	}),
}));

export const projectsRelations = relations(projects, ({one, many}) => ({
	emaillogs: many(emaillogs),
	notifications: many(notifications),
	portfolioitems: many(portfolioitems),
	quote: one(quotes, {
		fields: [projects.quoteId],
		references: [quotes.id]
	}),
	user_clientId: one(users, {
		fields: [projects.clientId],
		references: [users.id],
		relationName: "projects_clientId_users_id"
	}),
	service: one(services, {
		fields: [projects.serviceId],
		references: [services.id]
	}),
	user_assignedTo: one(users, {
		fields: [projects.assignedTo],
		references: [users.id],
		relationName: "projects_assignedTo_users_id"
	}),
	projectupdates: many(projectupdates),
}));

export const quotesRelations = relations(quotes, ({one, many}) => ({
	emaillogs: many(emaillogs),
	notifications: many(notifications),
	projects: many(projects),
	user: one(users, {
		fields: [quotes.clientId],
		references: [users.id]
	}),
	service: one(services, {
		fields: [quotes.serviceId],
		references: [services.id]
	}),
}));

export const notificationsRelations = relations(notifications, ({one}) => ({
	user: one(users, {
		fields: [notifications.userId],
		references: [users.id]
	}),
	project: one(projects, {
		fields: [notifications.relatedProjectId],
		references: [projects.id]
	}),
	quote: one(quotes, {
		fields: [notifications.relatedQuoteId],
		references: [quotes.id]
	}),
}));

export const portfolioitemsRelations = relations(portfolioitems, ({one}) => ({
	project: one(projects, {
		fields: [portfolioitems.projectId],
		references: [projects.id]
	}),
}));

export const servicesRelations = relations(services, ({many}) => ({
	projects: many(projects),
	quotes: many(quotes),
}));

export const projectupdatesRelations = relations(projectupdates, ({one}) => ({
	project: one(projects, {
		fields: [projectupdates.projectId],
		references: [projects.id]
	}),
	user: one(users, {
		fields: [projectupdates.createdBy],
		references: [users.id]
	}),
}));