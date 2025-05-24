import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/interview(.*)",
  "/ai-cover-letter(.*)",
  "/onboarding(.*)",
]);

const isProfileUpdateRoute = createRouteMatcher([
  "/profile/update(.*)",
]);

const isAuthRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (!userId && isProtectedRoute(req)) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }

  // If user is authenticated and coming from auth routes (sign-in/sign-up)
  if (userId && isAuthRoute(req)) {
    return NextResponse.redirect(new URL("/profile/update", req.url));
  }

  // If user is authenticated, check if they need to complete their profile
  if (userId && isProtectedRoute(req) && !isProfileUpdateRoute(req)) {
    try {
      // Instead of using Prisma directly in middleware, we'll make an API call
      const response = await fetch(`${req.nextUrl.origin}/api/user/profile`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const user = await response.json();

      // If user hasn't completed their profile, redirect to profile update
      if (!user?.industry || !user?.skills) {
        return NextResponse.redirect(new URL("/profile/update", req.url));
      }
    } catch (error) {
      console.error("Error checking user profile:", error);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};