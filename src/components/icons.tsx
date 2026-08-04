import { cn } from "./cn";

/**
 * The icon set.
 *
 * **Purpose.** A small, closed set of line icons drawn on one 20×20 grid at a
 * single stroke weight, so an icon never looks heavier than the text beside
 * it. There is no icon library dependency: an icon is a few path commands,
 * and owning them keeps the weight, the grid and the bundle under our control.
 *
 * **Props.** `className` only. Colour comes from `currentColor`, so an icon
 * takes the colour of the text it sits with and needs no colour prop. Size is
 * `size-5` (20px) by default and is overridden with a class.
 *
 * **Accessibility.** Every icon renders `aria-hidden`, because in this library
 * an icon always accompanies a label — `IconButton` and `SourceIcon` supply
 * the accessible name. Nothing here should be the only way to read a control.
 *
 * ```tsx
 * <SearchIcon />
 * <BookIcon className="size-6 text-muted-foreground" />
 * ```
 */
export type IconProps = {
  className?: string;
};

function Svg({
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-5 shrink-0", className)}
    >
      {children}
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="8.75" cy="8.75" r="5.25" />
      <path d="m12.75 12.75 3.75 3.75" />
    </Svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m5.5 5.5 9 9" />
      <path d="m14.5 5.5-9 9" />
    </Svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m4.5 10.5 3.5 3.5 7.5-8.5" />
    </Svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m8 4.5 5.5 5.5L8 15.5" />
    </Svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M10 4.5v11" />
      <path d="M4.5 10h11" />
    </Svg>
  );
}

/** A closed book, seen from the front with its spine. */
export function BookIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="5.5" y="2.75" width="9" height="14.5" rx="1.25" />
      <path d="M8.25 2.75v14.5" />
    </Svg>
  );
}

/** A page of text. Used for articles. */
export function ArticleIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="4.25" y="2.5" width="11.5" height="15" rx="1.5" />
      <path d="M7 7h6" />
      <path d="M7 10h6" />
      <path d="M7 13h4" />
    </Svg>
  );
}

/** Lines of text with one of them marked. Used for captures. */
export function HighlightIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4.5 5.5h11" />
      <path d="M4.5 9.9h8" strokeWidth={3.25} />
      <path d="M4.5 14.5h7" />
    </Svg>
  );
}

export function BookmarkIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M6 3.5h8v13l-4-3-4 3z" />
    </Svg>
  );
}

export function HomeIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3.75 9.25 10 3.5l6.25 5.75V16a1 1 0 0 1-1 1H4.75a1 1 0 0 1-1-1z" />
    </Svg>
  );
}

/** A list. Used for the queue. */
export function QueueIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4.5 6h11" />
      <path d="M4.5 10h11" />
      <path d="M4.5 14h7" />
    </Svg>
  );
}

export function SettingsIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3.5 7h8" />
      <path d="M15 7h1.5" />
      <circle cx="13.25" cy="7" r="1.75" />
      <path d="M3.5 13h1.5" />
      <path d="M8.5 13h8" />
      <circle cx="6.75" cy="13" r="1.75" />
    </Svg>
  );
}

/** An open tray. The default mark for an empty state. */
export function InboxIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3.5 11.75 5.9 4.9a1 1 0 0 1 .95-.65h6.3a1 1 0 0 1 .95.65l2.4 6.85V15a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1z" />
      <path d="M3.5 11.75h3.4l1 2h4.2l1-2h3.4" />
    </Svg>
  );
}
