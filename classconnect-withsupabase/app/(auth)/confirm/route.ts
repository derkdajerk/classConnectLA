import { type EmailOtpType } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  const cookieStore = await cookies();
  const interim = NextResponse.next();

  if (token_hash && type) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              interim.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.verifyOtp({ type, token_hash });

    const redirectUrl = error
      ? `/error?error=${encodeURIComponent(error.message)}`
      : next;

    const response = NextResponse.redirect(new URL(redirectUrl, request.url));
    for (const cookie of interim.cookies.getAll()) {
      response.cookies.set(cookie);
    }
    return response;
  }

  const response = NextResponse.redirect(
    new URL(
      `/error?error=${encodeURIComponent("No token hash or type")}`,
      request.url
    )
  );
  for (const cookie of interim.cookies.getAll()) {
    response.cookies.set(cookie);
  }
  return response;
}
