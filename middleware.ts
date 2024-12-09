import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Add any custom middleware logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
      error: "/error",
      signOut: "/logout",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/start/:path*",
    "/plans/:path*",
    "/profile/:path*",
  ],
};
