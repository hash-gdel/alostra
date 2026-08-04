"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "./cn";
import { IconButton } from "./icon-button";
import { CloseIcon } from "./icons";

/**
 * Dialog — a modal panel.
 *
 * **Purpose.** The one way the product interrupts. Built on the native
 * `<dialog>` element rather than a div with a z-index, because the platform
 * already implements the hard parts correctly: the top layer, containing focus
 * inside the panel, making the rest of the page inert, and closing on Escape.
 * A hand-rolled focus trap is a bug waiting to happen; this is a few lines of
 * synchronisation instead.
 *
 * **Props.**
 * - `open`, `onClose` — controlled. `onClose` fires for the close button, the
 *   backdrop, and Escape, so a single handler covers every way out.
 * - `title` — required, and always visible. A modal with no name is
 *   disorienting for everyone and unusable with a screen reader.
 * - `description` — optional sentence under the title, wired to
 *   `aria-describedby`.
 * - `footer` — actions. Put the primary action last, on the right.
 * - `size` — `"sm"` (384px) or `"md"` (576px, default).
 * - `dismissOnBackdrop` — `true` by default. Set `false` for a dialog holding
 *   unsaved input, where a stray click should not discard work.
 *
 * ```tsx
 * const [open, setOpen] = useState(false);
 * <Dialog
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   title="Import from Goodreads"
 *   description="Choose the CSV you exported. Nothing leaves this device."
 *   footer={<Button onClick={start}>Import</Button>}
 * >
 *   <Input label="CSV file" type="file" />
 * </Dialog>
 * ```
 *
 * **Accessibility.** `showModal()` gives focus containment, page inertness and
 * Escape for free, and marks the dialog modal for assistive technology.
 * `aria-labelledby` points at the visible title, so the accessible name and the
 * visible name are the same string. Background scrolling is locked while open.
 * The panel is separated from the page by the scrim rather than by a shadow,
 * since shadows in this system belong to book covers alone.
 *
 * There is no entrance animation, by system rule: the panel is simply there. So
 * nothing needs suppressing under reduced motion, and nothing is mid-flight
 * when focus lands.
 */
export type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  footer?: React.ReactNode;
  size?: "sm" | "md";
  dismissOnBackdrop?: boolean;
  closeLabel?: string;
  className?: string;
  children?: React.ReactNode;
};

const dialogSizes = {
  sm: "max-w-96",
  md: "max-w-144",
} as const;

export function Dialog({
  open,
  onClose,
  title,
  description,
  footer,
  size = "md",
  dismissOnBackdrop = true,
  closeLabel = "Close",
  className,
  children,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const reactId = useId();
  const titleId = `${reactId}-title`;
  const descriptionId = `${reactId}-description`;

  // Keep the element's own open state in step with the prop. The element is
  // the source of truth for the platform; the prop is the source of truth for
  // the application.
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  // Fires for Escape and for `close()`. The guard stops the close we perform
  // ourselves, in the effect above, from calling back into the consumer.
  function handleClose() {
    if (open) onClose();
  }

  function handleClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (!dismissOnBackdrop) return;
    if (event.target === ref.current) onClose();
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={handleClose}
      onClick={handleClick}
      className={cn(
        "m-auto max-h-dvh w-full bg-transparent p-gutter text-foreground backdrop:bg-scrim",
        dialogSizes[size],
        className,
      )}
    >
      <div className="flex max-h-full flex-col rounded-lg border border-border bg-surface">
        <header className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="font-serif text-xl tracking-display text-balance"
            >
              {title}
            </h2>
            {description ? (
              <p
                id={descriptionId}
                className="mt-1.5 text-sm text-muted-foreground text-pretty"
              >
                {description}
              </p>
            ) : null}
          </div>
          <IconButton
            label={closeLabel}
            size="sm"
            onClick={onClose}
            className="-mr-1.5 -mt-0.5 shrink-0"
          >
            <CloseIcon />
          </IconButton>
        </header>

        {children ? (
          <div className="min-h-0 overflow-y-auto p-5">{children}</div>
        ) : null}

        {footer ? (
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border p-5">
            {footer}
          </div>
        ) : null}
      </div>
    </dialog>
  );
}
