import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    '/',
    '/api/webhook/register',
    '/sign-up(.*)',
    '/sign-in(.*)',
    '/public/(.*)',
    '/api/public/(.*)'
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
    const { userId } = await auth();

    // 1. Unauthenticated users only allowed on public routes
    if (!userId) {
        if (isPublicRoute(req)) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // 2. Authenticated users — handle role-based redirects
    try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const role = user.publicMetadata.role as string | undefined;

        // Redirect admin users trying to access regular dashboard
        if (role === "admin" && req.nextUrl.pathname === "/dashboard") {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }

        // Block non-admins from accessing /admin routes
        if (role !== "admin" && req.nextUrl.pathname.startsWith("/admin")) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        // Prevent logged-in users from visiting auth pages, but allow public ASCII art viewing
        if (isPublicRoute(req) && !req.nextUrl.pathname.startsWith('/public') && !req.nextUrl.pathname.startsWith('/api/public')) {
            return NextResponse.redirect(
                new URL(role === "admin" ? "/admin/dashboard" : "/dashboard", req.url)
            );
        }

        // Allow access by default if authenticated and not redirected above
        return NextResponse.next();
    } catch (error) {
        console.error("Middleware error:", error);
        return NextResponse.redirect(new URL("/error", req.url));
    }
});

export const config = {
    matcher: ["/((?!_next|_static|favicon.ico).*)"],
};