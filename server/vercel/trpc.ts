import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import type { TrpcContext } from "../_core/context";

import { appRouter } from "../routers";



/**

 * Source entrypoint bundled by the Vercel build. Keeping it outside `api/`

 * lets esbuild inline local server modules before Vercel discovers the final

 * Web API function in `api/trpc/[...path].js`.

 */

const trpcVercelFunction = {
  
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














