import app, { bootPromise } from "../server/index";

// Ensure routes are registered before handling requests
await bootPromise;

export default app;
