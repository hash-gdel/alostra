import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export class AuthenticationRequiredError extends Error {
  constructor(message = "Authentication required.") {
    super(message);
    this.name = "AuthenticationRequiredError";
  }
}

export type AuthedContext = {
  client: SupabaseClient;
  user: User;
  userId: string;
};

type RequireUserOptions = {
  /** Injectable for tests. Defaults to the browser Supabase client. */
  createClient?: () => SupabaseClient;
};

/**
 * Resolve the authenticated browser session for repository calls.
 * Middleware should prevent unsigned product access; repositories stay defensive.
 */
export async function requireUser(
  options: RequireUserOptions = {},
): Promise<AuthedContext> {
  if (!isSupabaseConfigured() && !options.createClient) {
    throw new AuthenticationRequiredError(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  const client = (options.createClient ?? createClient)();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) {
    throw new AuthenticationRequiredError();
  }

  return {
    client,
    user: data.user,
    userId: data.user.id,
  };
}
