import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import type { TrpcContext } from "../_core/context";

import { appRouter } from "../routers";



/**

 * Source entrypoint bundled by the Vercel build. Keeping it outside `api/`

 * lets esbuild inline local server modules before Vercel discovers the final

 * Web API function in `api/[...path].js`.

 */

const trpcVercelFunction = {
  
  async fetch(request: Request): Promise<Response> {
    
    const originalUrl = new URL(request.url);
    
    const rewrittenProcedurePath = originalUrl.searchParams.get("trpcPath");
    
    if (rewrittenProcedurePath) {
      
      originalUrl.searchParams.delete("trpcPath");
      
      originalUrl.pathname = `/api/trpc/${rewrittenProcedurePath}`;
      
    }
    

    
    const trpcRequest = rewrittenProcedurePath
    
      ? new Request(originalUrl, request)
      
      : request;
    
    const path = originalUrl.pathname;
    
    if (!path.startsWith("/api/trpc")) {
      
      return Response.json(
        
        { error: "Synthetic prototype API route not found." },
        
        { status: 404 },
        
      );
      
    }
    

    
    return fetchRequestHandler({
      
      endpoint: "/api/trpc",
      
      req: trpcRequest,
      
      router: appRouter,
      
      createContext: (): TrpcContext => ({
        
        req: trpcRequest as unknown as TrpcContext["req"],
        
        res: {} as TrpcContext["res"],
        
        user: null,
        
      }),
      
    });
    
  },
  
};



export default trpcVercelFunction;
































