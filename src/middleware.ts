import { type NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseMiddlewareClient } from "@/utils/supabase/middleware";
import {
  canAccessAdminConsole,
  normalizeRole,
} from "@/lib/auth/staff-access";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createSupabaseMiddlewareClient(request);

  let finalResponse = response;

  if (supabase) {
    await supabase.auth.getUser();
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const isLogin = request.nextUrl.pathname === "/admin/login";
    let allowed = false;

    const adminSecret = process.env.ADMIN_SECRET;
    const cookie = request.cookies.get("gta6_admin")?.value;
    const header = request.headers.get("x-admin-secret");
    if (adminSecret && (cookie === adminSecret || header === adminSecret)) {
      allowed = true;
    }

    if (!allowed && supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        if (canAccessAdminConsole(normalizeRole(profile?.role))) {
          allowed = true;
        }
      }
    }

    if (isLogin && allowed) {
      const dash = new URL("/admin/dashboard", request.url);
      finalResponse = NextResponse.redirect(dash);
      response.cookies.getAll().forEach((c) => {
        finalResponse.cookies.set(c.name, c.value);
      });
      return finalResponse;
    }

    if (!allowed && !isLogin) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", request.nextUrl.pathname);
      finalResponse = NextResponse.redirect(loginUrl);
      response.cookies.getAll().forEach((c) => {
        finalResponse.cookies.set(c.name, c.value);
      });
    }
  }

  return finalResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};