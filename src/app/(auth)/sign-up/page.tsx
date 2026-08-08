"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Input, SectionHeading, useToast } from "@/components";
import { DEFAULT_POST_AUTH_PATH } from "@/lib/auth/route-gates";
import { useAuth } from "@/lib/auth/auth-context";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function SignUpPage() {
  const router = useRouter();
  const { show } = useToast();
  const { refreshSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  if (!isSupabaseConfigured()) {
    return (
      <SectionHeading
        title="Accounts unavailable"
        description="Accounts are not configured on this deployment. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable Alostra."
        action={<Button href="/">Back</Button>}
      />
    );
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(undefined);
    setLoading(true);
    try {
      const client = createClient();
      const origin = window.location.origin;
      const { data, error: signError } = await client.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: `${origin}/auth/callback` },
      });
      if (signError) {
        setError(signError.message);
        setLoading(false);
        return;
      }
      if (data.session) {
        await refreshSession();
        show({
          title: "Account created",
          description: "Your reading home is ready.",
        });
        router.push(DEFAULT_POST_AUTH_PATH);
        router.refresh();
        return;
      }
      setCheckEmail(true);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account.");
      setLoading(false);
    }
  }

  if (checkEmail) {
    return (
      <SectionHeading
        title="Check your email"
        description="Confirm your address to finish creating your reading home, then sign in."
        action={<Button href="/sign-in">Sign in</Button>}
      />
    );
  }

  return (
    <>
      <SectionHeading
        title="Create your reading home"
        description="An account keeps your books, articles and captures private and available on every device you use."
      />
      <form onSubmit={onSubmit} className="mt-block flex max-w-reading flex-col gap-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          description="At least 6 characters."
          error={error}
          required
          minLength={6}
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" loading={loading} loadingLabel="Creating…">
            Create account
          </Button>
          <Button href="/" variant="ghost">
            Back
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Sign in
          </Link>
        </p>
      </form>
    </>
  );
}
