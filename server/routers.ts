import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { validateAdminPassword, generateAdminToken } from "./admin-auth";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  admin: router({
    login: publicProcedure
      .input(z.object({ password: z.string() }))
      .mutation(({ input }) => {
        if (!validateAdminPassword(input.password)) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Senha incorreta" });
        }
        return {
          token: generateAdminToken(),
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        };
      }),
  }),

  books: router({
    categories: publicProcedure.query(() => db.getBookCategories()),
    
    list: publicProcedure
      .input(z.object({ categoryId: z.string().optional() }).optional())
      .query(({ input }) => db.getBooks(input?.categoryId)),
    
    byId: publicProcedure
      .input(z.string())
      .query(({ input }) => db.getBookById(input)),
    
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        purchaseLink: z.string().optional(),
        categoryId: z.string(),
        difficulty: z.enum(["beginner", "intermediate", "advanced"]),
        language: z.string(),
        tags: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return db.createBook(input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        purchaseLink: z.string().optional(),
        categoryId: z.string().optional(),
        difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
        language: z.string().optional(),
        tags: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { id, ...data } = input;
        return db.updateBook(id, data);
      }),
    
    delete: protectedProcedure
      .input(z.string())
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return db.deleteBook(input);
      }),
  }),

  tech: router({
    categories: publicProcedure.query(() => db.getTechCategories()),
    
    list: publicProcedure
      .input(z.object({ categoryId: z.string().optional() }).optional())
      .query(({ input }) => db.getTechProducts(input?.categoryId)),
    
    byId: publicProcedure
      .input(z.string())
      .query(({ input }) => db.getTechProductById(input)),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        purchaseLink: z.string().optional(),
        categoryId: z.string(),
        tags: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return db.createTechProduct(input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        purchaseLink: z.string().optional(),
        categoryId: z.string().optional(),
        tags: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { id, ...data } = input;
        return db.updateTechProduct(id, data);
      }),
    
    delete: protectedProcedure
      .input(z.string())
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return db.deleteTechProduct(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
