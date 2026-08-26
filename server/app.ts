import express, { type Express } from "express";

import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { registerOAuthRoutes } from "./_core/oauth";

import { registerStorageProxy } from "./_core/storageProxy";

import { createContext } from "./_core/context";

import { appRouter } from "./routers";



/**

 * Build the stateless Express application shared by local development and

 * Vercel Functions. Listening, Vite middleware, and static-file serving stay

 * outside this factory so a serverless runtime never opens its own port.

 */

export function createApp(): Express {
  
  const app = express();
  

  
  app.use(express.json({ limit: "50mb" }));
  
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  registerStorageProxy(app);
  
  registerOAuthRoutes(app);
  
  app.use(
    
    "/api/trpc",
    
    createExpressMiddleware({
      
      router: appRouter,
      
      createContext,
      
    }),
    
  );
  

  
  return app;
  
}

















