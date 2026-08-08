import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/api/webhooks(.*)"]);

/**
 * Deliberately NOT using `auth.protect()` here. On this deployment its
 * default redirect builds a `redirect_url` search param that gets
 * re-quoted on every hop (`/"/"/"/.../sign-in"`), doubling in size each
 * time until Next's edge runtime throws `MIDDLEWARE_INVOCATION_FAILED`
 * ("response headers exceed 32KB"). A plain, explicit redirect to
 * `/sign-in` — no `redirect_url` forwarding — sidesteps whatever internal
 * Clerk logic builds that param. Trade-off: signing in no longer bounces
 * the user back to the page they originally requested; they land on
 * `/dashboard` instead (see NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL).
 */
export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
