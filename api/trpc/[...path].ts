import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import type { TrpcContext } from "../../server/_core/context";

import { appRouter } from "../../server/routers";



/**

 * Vercel's Vite integration invokes Functions through the Web Request/Response

 * signature. The prototype uses public tRPC procedures, so this deliberately

 * creates an anonymous context and does not expose any production identity

 * integration.

 */

export const trpcVercelFunction = {
  
  async fetch(request: Request): Promise<Response> {
    
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



export default trpcVercelFunction;














