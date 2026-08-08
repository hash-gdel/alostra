import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  isAuthEntryPath,
  isProductPath,
  resolvePostAuthPath,
} from "@/lib/auth/route-gates";
import { getSupabaseEnv } from "./config";

function redirectWithCookies(
  request: NextRequest,
  pathname: string,
  cookieSource: NextResponse,
  searchParams?: Record<string, string>,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value);
    }
  }
  const response = NextResponse.redirect(url);
  for (const cookie of cookieSource.cookies.getAll()) {
    response.cookies.set(cookie);
  }
  return response;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  const env = getSupabaseEnv();
  if (!env) {
    if (isProductPath(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      url.search = "";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        supabaseResponse = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProductPath(pathname) && !user) {
    return redirectWithCookies(request, "/sign-in", supabaseResponse, {
      next: `${pathname}${request.nextUrl.search}`,
    });
  }

  if (isAuthEntryPath(pathname) && user) {
    const next = resolvePostAuthPath(request.nextUrl.searchParams.get("next"));
    return redirectWithCookies(request, next, supabaseResponse);
  }

  return supabaseResponse;
}
