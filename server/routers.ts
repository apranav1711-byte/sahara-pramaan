import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { listSyntheticCamps } from "./demoStore";
import {
  remoteCreateFamilyLink,
  remoteFamilyLink,
  remoteFingerprint,
  remoteLiveness,
  remoteLogin,
  remotePensioner,
  remoteReminder,
  remoteReset,
  remoteVerifyFamily,
} from "./supabasePrototype";

const pensionerInput = z.object({ pensionerId: z.string().min(1) });

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  prototype: router({
    login: publicProcedure
      .input(z.object({ identifier: z.string().min(1), otp: z.string().min(1) }))
      .mutation(({ input }) => remoteLogin(input.identifier, input.otp)),
    pensioner: publicProcedure.input(pensionerInput).query(({ input }) => remotePensioner(input.pensionerId)),
    fingerprint: publicProcedure.input(pensionerInput).mutation(({ input }) => remoteFingerprint(input.pensionerId)),
    liveness: publicProcedure.input(pensionerInput).mutation(({ input }) => remoteLiveness(input.pensionerId)),
    createFamilyLink: publicProcedure.input(pensionerInput).mutation(({ input }) => remoteCreateFamilyLink(input.pensionerId)),
    familyLink: publicProcedure.input(z.object({ token: z.string().min(1) })).query(({ input }) => remoteFamilyLink(input.token)),
    verifyFamily: publicProcedure
      .input(z.object({ token: z.string().min(1), answer: z.string().min(1) }))
      .mutation(({ input }) => remoteVerifyFamily(input.token, input.answer)),
    camps: publicProcedure.input(z.object({ pincode: z.string().optional() })).query(({ input }) => listSyntheticCamps(input.pincode)),
    reminder: publicProcedure
      .input(pensionerInput.extend({ sms: z.boolean(), voice: z.boolean(), family: z.boolean() }))
      .mutation(({ input }) => remoteReminder(input.pensionerId, { sms: input.sms, voice: input.voice, family: input.family })),
    reset: publicProcedure.mutation(() => remoteReset()),
  }),
});

export type AppRouter = typeof appRouter;
