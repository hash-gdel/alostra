/**
 * The Alostra component library. **Frozen with Milestone 2.**
 *
 * Import from `@/components`:
 *
 * ```tsx
 * import { BookCard, PageContainer, SectionHeading } from "@/components";
 * ```
 *
 * Every component here is generic: it knows about the design system and about
 * reading, and nothing about any particular screen. Screens are assembled from
 * these; no screen should need to invent a surface, a hairline or a hover
 * behaviour of its own.
 *
 * The public API is documented in `docs/components.md`. A prop, variant or
 * export changes only under the change-control policy in `docs/ux-decisions.md`.
 *
 * `cn.ts`, `styles.ts` and `field.tsx` are internal and deliberately not
 * exported — they are how the components share a rule, not part of the API.
 */

/* Foundation */
export { Button, type ButtonProps, type ButtonSize, type ButtonVariant } from "./button";
export { IconButton, type IconButtonProps } from "./icon-button";
export { Input, type InputProps } from "./input";
export { Textarea, type TextareaProps } from "./textarea";
export { SearchInput, type SearchInputProps } from "./search-input";
export { Label, type LabelProps, type LabelVariant } from "./label";
export { Badge, type BadgeProps, type BadgeTone } from "./badge";
export { Divider, type DividerProps } from "./divider";
export { Thread, type ThreadProps } from "./thread";
export { ProgressBar, type ProgressBarProps } from "./progress-bar";
export { Skeleton, type SkeletonProps } from "./skeleton";
export { EmptyState, type EmptyStateProps } from "./empty-state";

/* Layout */
export {
  PageContainer,
  ContentContainer,
  ReadingContainer,
} from "./containers";
export { Card, type CardProps } from "./card";
export { SectionHeading, type SectionHeadingProps } from "./section-heading";

/* Navigation */
export { SidebarItem, type SidebarItemProps } from "./sidebar-item";
export { MobileNavItem, type MobileNavItemProps } from "./mobile-nav-item";
export { NavigationGroup, type NavigationGroupProps } from "./navigation-group";

/* Reading */
export { BookCover, type BookCoverProps, type BookCoverSize } from "./book-cover";
export { BookCard, type BookCardProps } from "./book-card";
export {
  ContinueReadingCard,
  type ContinueReadingCardProps,
} from "./continue-reading-card";
export {
  ReadingProgress,
  type ReadingProgressProps,
  type ReadingProgressValue,
} from "./reading-progress";

/* Content */
export { ArticleCard, type ArticleCardProps } from "./article-card";
export { CaptureCard, type CaptureCardProps } from "./capture-card";
export { SourceIcon, type SourceIconProps, type SourceType } from "./source-icon";

/* Feedback */
export { Dialog, type DialogProps } from "./dialog";
export {
  ConfirmationDialog,
  type ConfirmationDialogProps,
} from "./confirmation-dialog";
export {
  Toast,
  ToastProvider,
  useToast,
  type ToastInput,
  type ToastProps,
} from "./toast";

/* Icons */
export {
  ArticleIcon,
  BookIcon,
  BookmarkIcon,
  CheckIcon,
  ChevronRightIcon,
  CloseIcon,
  HighlightIcon,
  HomeIcon,
  InboxIcon,
  PlusIcon,
  QueueIcon,
  SearchIcon,
  SettingsIcon,
  type IconProps,
} from "./icons";
