import { AppShell } from "@/app/_components/app-shell";
import { DatabaseBootstrap } from "@/app/_components/database-bootstrap";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DatabaseBootstrap>
      <AppShell>{children}</AppShell>
    </DatabaseBootstrap>
  );
}
