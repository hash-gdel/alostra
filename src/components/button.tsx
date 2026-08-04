import Link from "next/link";
import { cn } from "./cn";
import { controlDisabled, transitionQuick } from "./styles";

/**
 * Button — the primary control.
 *
 * **Purpose.** Every affordance that performs an action. Three variants cover
 * the whole product: one `action` per screen at most, `quiet` for everything
 * secondary, `ghost` where a control sits inside another surface and a border
 * would be noise. `action` is the only text-bearing fill in the system, so a
 * screen with two of them has no primary action at all.
 *
 * **Props.**
 * - `variant` — `"action" | "quiet" | "ghost"`, default `"action"`.
 * - `size` — `"md"` (44px, the default and the touch-safe size) or `"sm"`
 *   (36px, for dense toolbars that are never the primary path).
 * - `loading` / `loadingLabel` — see accessibility below.
 * - `leadingIcon` / `trailingIcon` — an icon from `icons.tsx`.
 * - `href` — renders a `next/link` anchor instead of a button, with identical
 *   styling, so navigation stays client-side. A link cannot be `disabled` or
 *   `loading`; the types enforce this, because an unavailable destination
 *   should not be rendered as a link at all.
 * - Standard shared HTML attributes (events, `aria-*`, `id`, `title`) are
 *   forwarded. Form-only attributes are not: use `type="submit"`.
 *
 * ```tsx
 * <Button onClick={save}>Add to queue</Button>
 * <Button variant="quiet" leadingIcon={<PlusIcon />}>Import</Button>
 * <Button href="/queue" variant="ghost">Open the queue</Button>
 * ```
 *
 * **Accessibility.** Renders a real `<button type="button">` or `<a href>`,
 * so keyboard activation, focus order and the global focus ring come for
 * free. `loading` sets `aria-busy`, disables the control, and swaps the label
 * for `loadingLabel` — there is no spinner, because reduced-motion is
 * honoured globally and a frozen spinner communicates nothing. The disabled
 * treatment drops to the sunken surface rather than fading the label, since
 * the system never reduces text with opacity.
 */
export type ButtonVariant = "action" | "quiet" | "ghost";
export type ButtonSize = "sm" | "md";

/** Attributes valid on both `<button>` and `<a>`. */
export type SharedAttributes = Omit<
  React.HTMLAttributes<HTMLElement>,
  "className" | "children"
>;

/**
 * Either a link or a button, never a link that claims to be disabled.
 * Shared by `Button` and `IconButton`.
 */
export type ButtonBehaviour =
  | {
      href: string;
      target?: string;
      rel?: string;
      download?: boolean | string;
      type?: never;
      disabled?: never;
      loading?: never;
    }
  | {
      href?: never;
      target?: never;
      rel?: never;
      download?: never;
      type?: "button" | "submit" | "reset";
      disabled?: boolean;
      loading?: boolean;
    };

export const buttonBase =
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium";

export const buttonVariants: Record<ButtonVariant, string> = {
  action: "bg-action text-action-foreground hover:bg-action-hover",
  quiet: "border border-border bg-surface text-foreground hover:bg-surface-hover",
  ghost: "text-foreground hover:bg-surface-hover",
};

export const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3",
  md: "h-11 px-4",
};

export type ButtonProps = SharedAttributes &
  ButtonBehaviour & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loadingLabel?: string;
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
    className?: string;
    children: React.ReactNode;
  };

export function Button(props: ButtonProps) {
  const {
    variant = "action",
    size = "md",
    loadingLabel = "Working…",
    leadingIcon,
    trailingIcon,
    className,
    children,
    href,
    target,
    rel,
    download,
    type = "button",
    disabled = false,
    loading = false,
    ...rest
  } = props;

  const classes = cn(
    buttonBase,
    buttonSizes[size],
    buttonVariants[variant],
    transitionQuick,
    controlDisabled,
    className,
  );

  const content = (
    <>
      {leadingIcon}
      <span>{loading ? loadingLabel : children}</span>
      {trailingIcon}
    </>
  );

  if (href !== undefined) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        download={download}
        className={classes}
        {...rest}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes}
      {...rest}
    >
      {content}
    </button>
  );
}
