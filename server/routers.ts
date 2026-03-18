import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { registerUser, loginUser, requestPasswordReset, resetPasswordWithToken } from "./auth";

const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user?.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

auth: router({
    me: publicProcedure.query(opts => {
      const user = opts.ctx.user;
      console.log('[Auth.Me] Consultando usuario actual:', { id: user?.id, email: user?.email, role: user?.role });
      return user;
    }),

    register: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(2),
      }))
      .mutation(async ({ input }) => {
        await registerUser(input.email, input.password, input.name, "user");
        return { success: true, message: "Usuario registrado exitosamente" };
      }),

    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await loginUser(input.email, input.password);

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, user.id.toString(), { ...cookieOptions, maxAge: COOKIE_MAX_AGE });

        console.log('[Auth.Login] Usuario logueado:', { id: user.id, email: user.email, role: user.role });

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),

    requestPasswordReset: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        return await requestPasswordReset(input.email);
      }),

    resetPassword: publicProcedure
      .input(z.object({
        token: z.string(),
        newPassword: z.string().min(6),
      }))
      .mutation(async ({ input }) => {
        return await resetPasswordWithToken(input.token, input.newPassword);
      }),

    setUserRole: adminProcedure
      .input(z.object({ userId: z.number(), role: z.enum(['user', 'admin']) }))
      .mutation(async ({ input }) => {
        await db.updateUserRole(input.userId, input.role);
        return { success: true, message: `Usuario actualizado a rol: ${input.role}` };
      }),
  }),

services: router({
    list: publicProcedure.query(async () => {
      return await db.getServices();
    }),

    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await db.getServiceById(input.id);
    }),

    create: adminProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        basePrice: z.string(),
        icon: z.string().optional(),
        category: z.string(),
        features: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createService({
          name: input.name,
          slug: input.slug,
          description: input.description || null,
          basePrice: parseFloat(input.basePrice) as any,
          icon: input.icon && input.icon.trim() ? input.icon.trim() : null,
          category: input.category,
          features: input.features || null,
          isActive: 1,
        });
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        basePrice: z.string().optional(),
        icon: z.string().optional(),
        category: z.string().optional(),
        features: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updateData } = input;
        const cleanedData = {
          ...updateData,
          basePrice: updateData.basePrice ? parseFloat(updateData.basePrice) : undefined,
          icon: updateData.icon && updateData.icon.trim() ? updateData.icon.trim() : null,
          description: updateData.description || undefined,
          features: updateData.features || undefined,
        };
        return await db.updateService(id, cleanedData as any);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteService(input.id);
      }),
  }),

quotes: router({
    create: publicProcedure
      .input(z.object({
        serviceId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        estimatedPrice: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

        const quote = await db.createQuote({
          clientId: ctx.user.id,
          serviceId: input.serviceId,
          title: input.title,
          description: input.description,
          estimatedPrice: input.estimatedPrice as any,
          status: 'pending',
        });

const quoteId = (quote as any).insertId || (quote as any)[0]?.id || 0;
        if (quoteId) {
          const admins = await db.getAdminUsers();
          const firstAdminId = admins.length > 0 ? admins[0].id : 1;

          await db.createNotification({
            userId: firstAdminId,
            type: 'quote-created',
            title: `Nueva cotización: ${input.title}`,
            message: `${ctx.user.name} ha solicitado una cotización`,
            relatedQuoteId: quoteId,
          });
        }

        return quote;
      }),

    getMyQuotes: protectedProcedure.query(async ({ ctx }) => {
      return await db.getClientQuotes(ctx.user!.id);
    }),

    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await db.getQuoteById(input.id);
    }),

    list: adminProcedure.query(async () => {
      return await db.getAllQuotes();
    }),

    updateStatus: adminProcedure
      .input(z.object({ id: z.number(), status: z.enum(['pending', 'approved', 'rejected', 'completed']) }))
      .mutation(async ({ input, ctx }) => {
        const quote = await db.getQuoteById(input.id);
        if (!quote) throw new TRPCError({ code: 'NOT_FOUND' });

        await db.updateQuoteStatus(input.id, input.status);

const notificationType = input.status === 'approved' ? 'quote-approved' : 'quote-rejected';
        await db.createNotification({
          userId: quote.clientId,
          type: notificationType as any,
          title: `Tu cotización ha sido ${input.status === 'approved' ? 'aprobada' : 'rechazada'}`,
          message: `La cotización "${quote.title}" ha sido ${input.status === 'approved' ? 'aprobada' : 'rechazada'}`,
          relatedQuoteId: input.id,
        });

        return { success: true };
      }),
  }),

projects: router({
    create: protectedProcedure
      .input(z.object({
        quoteId: z.number(),
        serviceId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        dueDate: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

        const project = await db.createProject({
          quoteId: input.quoteId,
          clientId: ctx.user.id,
          serviceId: input.serviceId,
          title: input.title,
          description: input.description,
          status: 'pending',
          priority: 'medium',
          dueDate: input.dueDate ? input.dueDate.toISOString() : null,
        });

const projectId = (project as any).insertId || (project as any)[0]?.id || 0;
        if (projectId) {
          await db.createNotification({
            userId: ctx.user.id,
            type: 'project-started',
            title: `Proyecto creado: ${input.title}`,
            message: 'Tu proyecto ha sido creado y está en cola',
            relatedProjectId: projectId,
          });
        }

        return project;
      }),

    getMyProjects: protectedProcedure.query(async ({ ctx }) => {
      return await db.getClientProjects(ctx.user!.id);
    }),

    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await db.getProjectById(input.id);
    }),

    list: adminProcedure.query(async () => {
      return await db.getAllProjects();
    }),

    updateStatus: adminProcedure
      .input(z.object({ id: z.number(), status: z.enum(['pending', 'in-progress', 'completed', 'on-hold', 'cancelled']) }))
      .mutation(async ({ input }) => {
        const project = await db.getProjectById(input.id);
        if (!project) throw new TRPCError({ code: 'NOT_FOUND' });

        await db.updateProjectStatus(input.id, input.status);

await db.createNotification({
          userId: project.clientId,
          type: 'project-update',
          title: `Tu proyecto ha sido actualizado`,
          message: `El estado de "${project.title}" es ahora: ${input.status}`,
          relatedProjectId: input.id,
        });

        return { success: true };
      }),

    uploadFiles: protectedProcedure
      .input(z.object({ projectId: z.number(), fileUrl: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const project = await db.getProjectById(input.projectId);
        if (!project || project.clientId !== ctx.user!.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }

        await db.updateProjectProgress(input.projectId, { clientFilesUrl: input.fileUrl });

        await db.addProjectUpdate({
          projectId: input.projectId,
          updateType: 'file-upload',
          message: 'Cliente ha subido archivos',
          fileUrl: input.fileUrl,
          createdBy: ctx.user!.id,
        });

        return { success: true };
      }),

    addUpdate: adminProcedure
      .input(z.object({
        projectId: z.number(),
        message: z.string(),
        fileUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const project = await db.getProjectById(input.projectId);
        if (!project) throw new TRPCError({ code: 'NOT_FOUND' });

        await db.addProjectUpdate({
          projectId: input.projectId,
          updateType: 'status-change',
          message: input.message,
          fileUrl: input.fileUrl,
          createdBy: ctx.user!.id,
        });

await db.createNotification({
          userId: project.clientId,
          type: 'project-update',
          title: 'Actualización en tu proyecto',
          message: input.message,
          relatedProjectId: input.projectId,
        });

        return { success: true };
      }),

    getUpdates: publicProcedure.input(z.object({ projectId: z.number() })).query(async ({ input }) => {
      return await db.getProjectUpdates(input.projectId);
    }),
  }),

notifications: router({
    getMyNotifications: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserNotifications(ctx.user!.id);
    }),

    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.markNotificationAsRead(input.id);
        return { success: true };
      }),
  }),

blog: router({
    list: publicProcedure.query(async () => {
      return await db.getBlogArticles(6);
    }),

    getAll: adminProcedure.query(async () => {
      return await db.getAllBlogArticles();
    }),

    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await db.getBlogArticleById(input.id);
    }),

    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      return await db.getBlogArticleBySlug(input.slug);
    }),

    create: adminProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string(),
        category: z.string(),
        excerpt: z.string().optional(),
        content: z.string(),
        thumbnailUrl: z.string().optional(),
        readingTime: z.number().optional(),
        isPublished: z.boolean().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createBlogArticle({
          title: input.title,
          slug: input.slug,
          category: input.category,
          excerpt: input.excerpt,
          content: input.content,
          thumbnailUrl: input.thumbnailUrl,
          readingTime: input.readingTime,
          authorId: ctx.user!.id,
          isPublished: input.isPublished ? 1 : 0,
          publishedAt: input.isPublished ? new Date().toISOString() : undefined,
        });
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        category: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        readingTime: z.number().optional(),
        isPublished: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const article = await db.getBlogArticleById(input.id);
        if (!article) throw new TRPCError({ code: 'NOT_FOUND' });

        const updateData: any = {};
        if (input.title) updateData.title = input.title;
        if (input.slug) updateData.slug = input.slug;
        if (input.category) updateData.category = input.category;
        if (input.excerpt) updateData.excerpt = input.excerpt;
        if (input.content) updateData.content = input.content;
        if (input.thumbnailUrl) updateData.thumbnailUrl = input.thumbnailUrl;
        if (input.readingTime) updateData.readingTime = input.readingTime;
        if (input.isPublished !== undefined) {
          updateData.isPublished = input.isPublished;
          if (input.isPublished && !article.publishedAt) {
            updateData.publishedAt = new Date();
          }
        }

        await db.updateBlogArticle(input.id, updateData);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const article = await db.getBlogArticleById(input.id);
        if (!article) throw new TRPCError({ code: 'NOT_FOUND' });

        await db.deleteBlogArticle(input.id);
        return { success: true };
      }),
  }),

portfolio: router({
    getPublic: publicProcedure.query(async () => {
      return await db.getPublicPortfolioItems();
    }),

    getProjectItems: publicProcedure.input(z.object({ projectId: z.number() })).query(async ({ input }) => {
      return await db.getProjectPortfolioItems(input.projectId);
    }),
  }),
});

export type AppRouter = typeof appRouter;
