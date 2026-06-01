import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/studio(.*)"]);
const isPublicApiRoute = createRouteMatcher(["/api/webhooks(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Webhook endpoints harus bisa diakses tanpa autentikasi
  // karena menerima request dari layanan eksternal (Clerk, Stripe, dll.)
  if (isPublicApiRoute(req)) {
    return;
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
