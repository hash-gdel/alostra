import Link from "next/link";
import {
  buttonBase,
  buttonVariants,
  type ButtonBehaviour,
  type ButtonSize,
  type ButtonVariant,
  type SharedAttributes,
} from "./button";
import { cn } from "./cn";
import { controlDisabled, transitionQuick } from "./styles";

/**
 * IconButton — a square control carrying a single icon.
 *
 * **Purpose.** Actions that are understood without a written label and would
 * otherwise crowd a row: closing a dialog, clearing a search field, opening
 * an overflow. It shares `Button`'s variants and geometry exactly, so the two
 * sit together in a toolbar without a seam. `ghost` is the default, because an
 * icon control usually sits inside a surface that is already bordered.
 *
 * **Props.**
 * - `label` — **required.** The accessible name, also used as the `title`.
 * - `variant` — as `Button`, default `"ghost"`.
 * - `size` — `"md"` (44px, touch-safe) or `"sm"` (36px).
 * - `children` — exactly one icon.
 * - `href`, `disabled`, `loading` and shared HTML attributes behave as on
 *   `Button`.
 *
 * ```tsx
 * <IconButton label="Close" onClick={close}><CloseIcon /></IconButton>
 * ```
 *
 * **Accessibility.** An icon alone is never an accessible name, so `label` is
 * required by the type rather than optional. The icons themselves are
 * `aria-hidden`, leaving exactly one name on the control. At `md` the target
 * is 44px, which is the minimum for touch; `sm` is for pointer-dense contexts.
 */
export type IconButtonProps = SharedAttributes &
  ButtonBehaviour & {
    label: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
    children: React.ReactNode;
  };

const iconButtonSizes: Record<ButtonSize, string> = {
  sm: "size-9",
  md: "size-11",
};

export function IconButton(props: IconButtonProps) {
  const {
    label,
    variant = "ghost",
    size = "md",
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
    iconButtonSizes[size],
    buttonVariants[variant],
    transitionQuick,
    controlDisabled,
    className,
  );

  if (href !== undefined) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        download={download}
        aria-label={label}
        title={label}
        className={classes}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={label}
      title={label}
      className={classes}
      {...rest}
    >
      {children}
    </button>
  );
}
