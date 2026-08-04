import { cn } from "./cn";
import { InboxIcon } from "./icons";

/**
 * EmptyState — a place with nothing in it yet.
 *
 * **Purpose.** An empty shelf is the first thing a new user sees, so it is
 * treated as a real screen rather than an apology. One sentence of plain
 * explanation and, where there is something useful to do, exactly one action.
 * The voice is warm and factual: it says what will appear here and how to put
 * something in it. It does not narrate the user's mood.
 *
 * **Props.**
 * - `title` — a short noun phrase. Set in the serif, because it is content.
 * - `description` — one or two sentences at most.
 * - `action` — usually a single `Button`. Two actions means the screen has not
 *   decided what it wants.
 * - `icon` — defaults to an open tray. Pass an icon that matches the place.
 * - `headingLevel` — `2` (default) or `3`, to fit the surrounding outline.
 *
 * ```tsx
 * <EmptyState
 *   icon={<BookIcon className="size-6" />}
 *   title="Your library is empty"
 *   description="Books you add appear here, with whatever you are part-way through at the top."
 *   action={<Button>Add a book</Button>}
 * />
 * ```
 *
 * **Accessibility.** Renders a real heading at the level you choose, so the
 * empty state joins the page outline instead of being a floating paragraph. The
 * icon is decorative. There is no `role="status"`: an empty state is the
 * content of the region, not an announcement about it.
 */
export type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  headingLevel?: 2 | 3;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  icon,
  headingLevel = 2,
  className,
}: EmptyStateProps) {
  const Heading = headingLevel === 3 ? "h3" : "h2";

  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-lg border border-border bg-surface px-gutter py-block text-center",
        className,
      )}
    >
      <span className="text-muted-foreground">
        {icon ?? <InboxIcon className="size-6" />}
      </span>
      <Heading className="mt-4 font-serif text-xl tracking-display text-balance">
        {title}
      </Heading>
      {description ? (
        <p className="mt-2 max-w-reading text-sm text-muted-foreground text-pretty">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
