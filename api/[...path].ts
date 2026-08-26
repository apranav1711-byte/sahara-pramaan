import { createApp } from "../server/app";



// Vercel invokes this single, catch-all Function for the existing public API.

// The frontend continues to call same-origin /api/trpc endpoints; no real

// pensioner, biometric, government, or banking data is introduced here.

export default createApp();

