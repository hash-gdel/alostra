"use client";

import { useState } from "react";
import {
  Button,
  ConfirmationDialog,
  Dialog,
  Input,
  SearchInput,
  Textarea,
  ToastProvider,
  useToast,
} from "@/components";

/**
 * The exhibits that need state.
 *
 * Everything else in the catalogue renders on the server; these four are
 * client components because a dialog that cannot be opened is not a
 * demonstration of a dialog.
 */

export function SearchDemo() {
  const [query, setQuery] = useState("");

  return (
    <div className="max-w-80">
      <SearchInput
        value={query}
        onValueChange={setQuery}
        placeholder="Search your library"
        description="Type to reveal the clear control. Escape clears the field."
      />
    </div>
  );
}

export function DialogDemo() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <Button variant="quiet" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Dialog
        open={open}
        onClose={close}
        title="Import from Goodreads"
        description="Choose the CSV you exported. Nothing leaves this device."
        footer={
          <>
            <Button variant="quiet" onClick={close}>
              Cancel
            </Button>
            <Button onClick={close}>Import</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Export file"
            placeholder="goodreads_library_export.csv"
            description="Rows that cannot be matched are reported, never dropped."
          />
          <Textarea label="Note" rows={3} description="Optional." />
        </div>
      </Dialog>
    </>
  );
}

export function ConfirmationDemo() {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  function confirm() {
    setConfirming(true);
    // Stands in for the local write, so the loading state is visible.
    setTimeout(() => {
      setConfirming(false);
      setOpen(false);
    }, 900);
  }

  return (
    <>
      <Button variant="quiet" onClick={() => setOpen(true)}>
        Delete this book
      </Button>
      <ConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={confirm}
        title="Delete this book?"
        description="The book, its reading progress and its notes are removed from this device. This cannot be undone."
        confirmLabel="Delete book"
        confirming={confirming}
      />
    </>
  );
}

function ToastTriggers() {
  const { show } = useToast();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="quiet" onClick={() => show({ title: "Capture saved" })}>
        Show a toast
      </Button>
      <Button
        variant="ghost"
        onClick={() =>
          show({
            title: "Import finished",
            description: "48 books added. 3 rows could not be matched.",
            duration: 8000,
          })
        }
      >
        With a description
      </Button>
    </div>
  );
}

export function ToastDemo() {
  return (
    <ToastProvider>
      <ToastTriggers />
    </ToastProvider>
  );
}
