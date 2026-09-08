import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

// Only run Supabase auth checks on routes that actually gate on the user.
// Public pages (/, /shop, /solutions, /products/*, /categories/*, /about, /faq,
// /contact, /terms, /privacy, /refund-policy, /search, /cart, /packs, /brand,
// /bim-*) skip this entirely — saving one Supabase network call per navigation.
export const config = {
  matcher: [
    "/account/:path*",
    "/checkout/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
