import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "./lib/prisma";

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
      const user = await db.user.findUnique({
        where: {
          clerkUserId: userId,
        },
        select: {
          industry: true,
          skills: true,
        },
      });

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