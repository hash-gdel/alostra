"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Button,
  ContentContainer,
  Input,
  SectionHeading,
  useToast,
} from "@/components";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { show } = useToast();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  if (!isSupabaseConfigured()) {
    return (
      <ContentContainer className="py-section">
        <SectionHeading
          title="Reset unavailable"
          description="Accounts are not configured on this deployment. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable Alostra."
          action={<Button href="/">Back</Button>}
        />
      </ContentContainer>
    );
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(undefined);
    setLoading(true);
    try {
      const client = createClient();
      const { error: updateError } = await client.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }
      show({ title: "Password updated" });
      router.push("/home");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update password.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-canvas text-foreground">
      <ContentContainer className="flex min-h-dvh flex-col justify-center py-section">
        <SectionHeading
          title="Choose a new password"
          description="This keeps your reading home reachable only by you."
        />
        <form
          onSubmit={onSubmit}
          className="mt-block flex max-w-reading flex-col gap-4"
        >
          <Input
            label="New password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
            required
            minLength={6}
          />
          <Button type="submit" loading={loading} loadingLabel="Saving…">
            Save password
          </Button>
        </form>
      </ContentContainer>
    </div>
  );
}
