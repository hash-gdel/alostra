"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Input, SectionHeading, useToast } from "@/components";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function ForgotPasswordPage() {
  const { show } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isSupabaseConfigured()) {
    return (
      <SectionHeading
        title="Reset unavailable"
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
      const { error: resetError } = await client.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: `${window.location.origin}/auth/reset-password` },
      );
      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }
      setSent(true);
      show({ title: "Check your email" });
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset email.");
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <SectionHeading
        title="Check your email"
        description="If an account exists for that address, a reset link is on its way."
        action={<Button href="/sign-in">Back to sign in</Button>}
      />
    );
  }

  return (
    <>
      <SectionHeading
        title="Forgot password"
        description="We’ll send a link to choose a new password for your reading home."
      />
      <form onSubmit={onSubmit} className="mt-block flex max-w-reading flex-col gap-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          required
        />
        <div className="flex flex-wrap gap-3">
          <Button type="submit" loading={loading} loadingLabel="Sending…">
            Send reset link
          </Button>
          <Button href="/sign-in" variant="ghost">
            Cancel
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          <Link
            href="/sign-in"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Back to sign in
          </Link>
        </p>
      </form>
    </>
  );
}
