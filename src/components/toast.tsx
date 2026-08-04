"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "./cn";
import { IconButton } from "./icon-button";
import { CloseIcon } from "./icons";

/**
 * Toast — a brief confirmation that something happened.
 *
 * **Purpose.** "Capture saved." "Backup exported." "12 rows could not be
 * matched." Small, factual acknowledgements that do not deserve a dialog. A
 * toast is never the only record of an outcome: anything the user might need
 * later belongs on the screen, because a message that disappears after five
 * seconds is not a place to put information.
 *
 * **Usage.** Mount `ToastProvider` once, high in the tree, then call `useToast`
 * from anywhere below it.
 *
 * ```tsx
 * <ToastProvider>{children}</ToastProvider>
 *
 * const { show } = useToast();
 * show({ title: "Capture saved" });
 * show({ title: "Import finished", description: "48 books added, 3 rows skipped.", duration: 8000 });
 * ```
 *
 * **Props.**
 * - `ToastProvider`: `duration` — default dismiss delay in milliseconds (5000).
 * - `show({ title, description?, duration? })` — returns the toast's id.
 * - `dismiss(id)` — removes one early.
 * - `Toast` — the presentational panel, exported for layout work and tests. In
 *   the application, prefer the provider: it owns the live region.
 *
 * **Accessibility.** The region is `aria-live="polite"`, so a toast is announced
 * without interrupting whatever the user is doing, and it is rendered
 * *outside* the interactive flow with a real dismiss button in it. The region is
 * always mounted rather than appearing with the first toast, which is what makes
 * announcements reliable — a live region added to the page at the same moment as
 * its content is frequently missed. Each toast is dismissible by pointer and by
 * keyboard, and auto-dismissal never removes the only copy of something
 * important.
 *
 * **Motion.** None. Nothing rises or fades in; the panel is simply present, then
 * gone. That is the system's rule about entrances, and it also means reduced
 * motion needs no special case here.
 */
export type ToastInput = {
  title: string;
  description?: string;
  duration?: number;
};

type ToastRecord = ToastInput & { id: string };

type ToastContextValue = {
  show: (toast: ToastInput) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside a <ToastProvider>.");
  }
  return context;
}

export type ToastProps = {
  title: string;
  description?: string;
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
};

export function Toast({
  title,
  description,
  onDismiss,
  dismissLabel = "Dismiss",
  className,
}: ToastProps) {
  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-96 items-start gap-3 rounded-lg border border-border bg-surface p-4",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground text-pretty">
            {description}
          </p>
        ) : null}
      </div>
      {onDismiss ? (
        <IconButton
          label={dismissLabel}
          size="sm"
          onClick={onDismiss}
          className="-mr-1.5 -mt-1 shrink-0"
        >
          <CloseIcon className="size-4" />
        </IconButton>
      ) : null}
    </div>
  );
}

export function ToastProvider({
  children,
  duration = 5000,
}: {
  children: React.ReactNode;
  duration?: number;
}) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const sequence = useRef(0);

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (toast: ToastInput) => {
      sequence.current += 1;
      const id = `toast-${sequence.current}`;
      setToasts((current) => [...current, { ...toast, id }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), toast.duration ?? duration),
      );
      return id;
    },
    [dismiss, duration],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  const value = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-gutter"
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            description={toast.description}
            onDismiss={() => dismiss(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
