import { createNextRouteHandler } from "uploadthing/next";

import { fileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createNextRouteHandler({
    router: fileRouter,
});