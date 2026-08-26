import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { TrpcContext } from "../server/_core/context";
import { appRouter } from "../server/routers";

/**
 * Vercel discovers this catch-all file as the public /api/* Function.
 * It intentionally serves only the public synthetic tRPC contract used by
 * the prototype; no real identity, pension, bank, or biometric service is
 * introduced into this deployment.
 */
const handler = {
  async fetch(request: Request): Promise<Response> {
    const path = new URL(request.url).pathname;

    if (!path.startsWith("/api/trpc")) {
      return Response.json(
        { error: "Synthetic prototype API route not found." },
        { status: 404 },
      );
    }

    return fetchRequestHandler({
      endpoint: "/api/trpc",
      req: request,
      router: appRouter,
      createContext: (): TrpcContext => ({
        req: request as unknown as TrpcContext["req"],
        res: {} as TrpcContext["res"],
        user: null,
      }),
    });
  },
};

export default handler;
