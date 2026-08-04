import { Button } from "./button";
import { Dialog } from "./dialog";

/**
 * ConfirmationDialog — asking before something irreversible.
 *
 * **Purpose.** Deleting a book, clearing captures, restoring a backup over
 * existing data. In a local-first product there is no server-side undo, so the
 * question has to be asked properly and exactly once. It is a thin arrangement
 * of `Dialog`: same panel, same behaviour, a fixed pair of actions, so every
 * confirmation in the product reads the same way.
 *
 * **Props.**
 * - `open`, `onClose`, `onConfirm` — controlled. `onClose` covers cancel,
 *   Escape and the backdrop.
 * - `title` — phrase it as the question, e.g. `"Delete this book?"`.
 * - `description` — say what will actually happen, including anything that
 *   cannot be undone.
 * - `confirmLabel` — **name the action**, e.g. `"Delete book"`. Never "OK": the
 *   button label is what carries the consequence.
 * - `confirming` — puts the confirm button in its loading state.
 *
 * ```tsx
 * <ConfirmationDialog
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   onConfirm={deleteBook}
 *   title="Delete this book?"
 *   description="The book, its progress and its notes are removed from this device. This cannot be undone."
 *   confirmLabel="Delete book"
 * />
 * ```
 *
 * **Accessibility.** Focus starts on Cancel, so an accidental Return does not
 * confirm. The backdrop is not dismissible, because a stray click should not be
 * an answer to a destructive question. Escape still cancels, which is the
 * expected escape hatch and matches the safe default.
 *
 * **On colour.** The system deliberately has no destructive red. Giving the
 * action colour a second meaning was a pre-freeze finding, and a red button is
 * in any case the least reliable part of a warning: the words do the work. The
 * gravity lives in the title, the description and the verb on the button.
 */
export type ConfirmationDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirming?: boolean;
};

export function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirming = false,
}: ConfirmationDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      dismissOnBackdrop={false}
      footer={
        <>
          <Button variant="quiet" onClick={onClose} autoFocus>
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm} loading={confirming}>
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}
