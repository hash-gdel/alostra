"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button, Input, SectionHeading, useToast } from "@/components";
import { resolvePostAuthPath } from "@/lib/auth/route-gates";
import { useAuth } from "@/lib/auth/auth-context";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { show } = useToast();
  const { refreshSession, configured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  if (!configured && !isSupabaseConfigured()) {
    return (
      <SectionHeading
        title="Sign in unavailable"
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
      const { error: signError } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signError) {
        setError(signError.message);
        setLoading(false);
        return;
      }
      await refreshSession();
      show({ title: "Signed in" });
      router.push(resolvePostAuthPath(searchParams.get("next")));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setLoading(false);
    }
  }

  return (
    <>
      <SectionHeading
        title="Sign in"
        description="Open your private reading home. Your books, articles and captures stay with your account."
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
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error}
          required
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" loading={loading} loadingLabel="Signing in…">
            Sign in
          </Button>
          <Button href="/" variant="ghost">
            Back
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          <Link
            href="/forgot-password"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Forgot password
          </Link>
          {" · "}
          <Link
            href="/sign-up"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Create an account
          </Link>
        </p>
      </form>
    </>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <SectionHeading title="Sign in" description="Opening…" />
      }
    >
      <SignInForm />
    </Suspense>
  );
}
