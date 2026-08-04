import {
  ArticleCard,
  Badge,
  BookCard,
  BookCover,
  BookIcon,
  Button,
  CaptureCard,
  Card,
  CheckIcon,
  ChevronRightIcon,
  CloseIcon,
  ContentContainer,
  ContinueReadingCard,
  Divider,
  EmptyState,
  HighlightIcon,
  HomeIcon,
  IconButton,
  Input,
  Label,
  MobileNavItem,
  NavigationGroup,
  PageContainer,
  PlusIcon,
  ProgressBar,
  QueueIcon,
  ReadingContainer,
  ReadingProgress,
  SectionHeading,
  SettingsIcon,
  SidebarItem,
  Skeleton,
  SourceIcon,
  Textarea,
  Thread,
  Toast,
} from "@/components";
import { ConfirmationDemo, DialogDemo, SearchDemo, ToastDemo } from "./_demos";
import { Cell, Group, Specimen } from "./_ui";

/**
 * The component catalogue.
 *
 * Rendered twice by the page — once on a light canvas, once inside `.dark` —
 * so every component is exhibited in both modes without being written twice.
 *
 * Sample titles and authors are real books with their real authors. Cover
 * artwork must never contradict its own metadata, and a reference page that
 * mis-attributes its examples teaches the mistake.
 */

const BOOKS = [
  { title: "The History of Reading", author: "Alberto Manguel" },
  { title: "Ex Libris", author: "Anne Fadiman" },
  { title: "How to Read a Book", author: "Mortimer J. Adler" },
  { title: "Reading in the Brain", author: "Stanislas Dehaene" },
] as const;

export function ComponentCatalogue({ mode }: { mode: "light" | "dark" }) {
  return (
    <div className="flex flex-col gap-9">
      {/* ------------------------------------------------------ foundation --- */}
      <Group title="Foundation">
        <Specimen
          name="Button"
          purpose="Every action. One action variant per screen at most — it is the only text-bearing fill in the system, so two of them means no primary action at all."
        >
          <Cell label="Variants">
            <Button>Add to queue</Button>
            <Button variant="quiet">Import</Button>
            <Button variant="ghost">Skip</Button>
          </Cell>
          <Cell label="Sizes · 44px and 36px">
            <Button size="md">Medium</Button>
            <Button size="sm">Small</Button>
          </Cell>
          <Cell label="With icons">
            <Button leadingIcon={<PlusIcon />}>Add a book</Button>
            <Button variant="quiet" trailingIcon={<ChevronRightIcon />}>
              Open the queue
            </Button>
          </Cell>
          <Cell label="Disabled · sunken, never faded">
            <Button disabled>Add to queue</Button>
            <Button variant="quiet" disabled>
              Import
            </Button>
            <Button variant="ghost" disabled>
              Skip
            </Button>
          </Cell>
          <Cell label="Loading · label swap, no spinner">
            <Button loading>Save</Button>
            <Button variant="quiet" loading loadingLabel="Importing…">
              Import
            </Button>
          </Cell>
          <Cell label="As a link">
            <Button href="#components" variant="quiet">
              Back to the catalogue
            </Button>
          </Cell>
        </Specimen>

        <Specimen
          name="IconButton"
          purpose="A square control carrying one icon, sharing Button's geometry exactly. The label is required: an icon is never an accessible name."
        >
          <Cell label="Variants">
            <IconButton label="Close">
              <CloseIcon />
            </IconButton>
            <IconButton label="Add" variant="quiet">
              <PlusIcon />
            </IconButton>
            <IconButton label="Confirm" variant="action">
              <CheckIcon />
            </IconButton>
          </Cell>
          <Cell label="Sizes · 44px and 36px">
            <IconButton label="Close, medium" variant="quiet">
              <CloseIcon />
            </IconButton>
            <IconButton label="Close, small" variant="quiet" size="sm">
              <CloseIcon className="size-4" />
            </IconButton>
          </Cell>
          <Cell label="Disabled">
            <IconButton label="Add, unavailable" variant="quiet" disabled>
              <PlusIcon />
            </IconButton>
          </Cell>
        </Specimen>

        <Specimen
          name="Input"
          purpose="A whole field: label, control, help text, validation message. Set at 16px so a phone does not zoom when it is focused."
        >
          <Cell label="Default · with description · invalid · disabled" layout="stack">
            <div className="flex max-w-80 flex-col gap-4">
              <Input label="Title" placeholder="The History of Reading" />
              <Input
                label="Page"
                type="number"
                inputMode="numeric"
                placeholder="214"
                description="Optional. Page progress is never required."
              />
              <Input
                label="Article URL"
                defaultValue="not-a-link"
                error="That does not look like a link."
              />
              <Input label="Author" placeholder="Alberto Manguel" disabled />
            </div>
          </Cell>
        </Specimen>

        <Specimen
          name="Textarea"
          purpose="Multi-line text: book notes, the note on a capture, feedback. Same anatomy and wiring as Input."
        >
          <Cell label="Default · disabled" layout="stack">
            <div className="flex max-w-80 flex-col gap-4">
              <Textarea
                label="Note"
                rows={3}
                description="Kept on this device."
              />
              <Textarea label="Note" rows={2} disabled />
            </div>
          </Cell>
        </Specimen>

        <Specimen
          name="SearchInput"
          purpose="Filtering a library, a queue or a set of captures. A filter rather than a form: no submit, results as you type."
        >
          <Cell label="Live · clear control appears with a value" layout="stack">
            <SearchDemo />
          </Cell>
        </Specimen>

        <Specimen
          name="Label"
          purpose="The two sanctioned ways to name something, and there is deliberately no third. Shown here as spans, because a label with nothing to point at is a lie to a screen reader — the field components bind the real ones with htmlFor."
        >
          <Cell label="Field · eyebrow">
            <Label as="span">Title</Label>
            <Label as="span" variant="eyebrow">
              Recently added
            </Label>
          </Cell>
        </Specimen>

        <Specimen
          name="Badge"
          purpose="A short, static piece of state. Never interactive, and never the only carrier of what it says."
        >
          <Cell label="Tones">
            <Badge>Want to read</Badge>
            <Badge tone="status">Finished</Badge>
            <Badge tone="emphasis">Reading</Badge>
          </Cell>
          <Cell label="With an icon">
            <Badge tone="status" icon={<CheckIcon className="size-3" />}>
              Imported
            </Badge>
          </Cell>
        </Specimen>

        <Specimen
          name="Divider"
          purpose="A hairline at full strength. A border faded to sixty percent is not a subtle border, it is an uncertain one."
        >
          <Cell label="Horizontal · default and strong" layout="stack">
            <Divider />
            <Divider tone="strong" />
          </Cell>
          <Cell label="Vertical">
            <div className="flex items-stretch gap-3 text-sm">
              <span>Books</span>
              <Divider orientation="vertical" />
              <span>Articles</span>
              <Divider orientation="vertical" />
              <span>Captures</span>
            </div>
          </Cell>
        </Specimen>

        <Specimen
          name="Thread"
          purpose="The Bookmark Thread. Active navigation, reading progress, selected book, selected capture, important emphasis — that is the whole list. Inside this library it appears in exactly five places."
        >
          <Cell label="Vertical · a fixed mark">
            <div className="flex h-8 items-center">
              <Thread className="h-5" />
            </div>
          </Cell>
          <Cell label="Horizontal · extent 0.62" layout="stack">
            <div className="max-w-80">
              <Thread orientation="horizontal" extent={0.62} />
            </div>
          </Cell>
        </Specimen>

        <Specimen
          name="ProgressBar"
          purpose="The generic progress primitive: a hairline track with the thread laid along it. Two pixels tall on purpose — a ribbon in a book, not a loading bar in a dashboard."
        >
          <Cell label="Empty · part-way · complete" layout="stack">
            <div className="flex max-w-80 flex-col gap-4">
              <ProgressBar value={0} label="Import progress, not started" />
              <ProgressBar value={38} label="Import progress, part-way" />
              <ProgressBar value={100} label="Import progress, complete" />
            </div>
          </Cell>
        </Specimen>

        <Specimen
          name="Skeleton"
          purpose="The shape of content that has not arrived. Deliberately static: reduced motion is honoured globally, and a frozen shimmer communicates nothing."
        >
          <Cell label="Text · block · cover">
            <div aria-busy className="flex w-full flex-wrap items-start gap-5">
              <Skeleton lines={3} className="w-48" />
              <Skeleton variant="block" className="w-40" />
              <Skeleton variant="cover" className="w-20" />
            </div>
          </Cell>
        </Specimen>

        <Specimen
          name="EmptyState"
          purpose="An empty shelf is the first thing a new user sees, so it is a real screen rather than an apology. One sentence, and at most one action."
        >
          <Cell label="With an action" layout="stack">
            <EmptyState
              headingLevel={3}
              icon={<BookIcon className="size-6" />}
              title="Your library is empty"
              description="Books you add appear here, with whatever you are part-way through at the top."
              action={<Button leadingIcon={<PlusIcon />}>Add a book</Button>}
            />
          </Cell>
        </Specimen>
      </Group>

      {/* ---------------------------------------------------------- layout --- */}
      <Group title="Layout">
        <Specimen
          name="PageContainer · ContentContainer · ReadingContainer"
          purpose="Three measures, because reading and browsing are different activities and must not share a container. A screen picks one and stops thinking about width."
        >
          <Cell label="Reading container · sets the reading scale on paper" layout="stack">
            <ReadingContainer
              as="section"
              gutters={false}
              className="rounded-lg border border-border bg-paper p-5"
            >
              <p className="text-pretty">
                Nineteen pixels of Fraunces across roughly sixty-six characters.
                This is the only container that sets type as well as width,
                because prose is the only content whose measure is a
                readability requirement rather than a layout choice.
              </p>
            </ReadingContainer>
          </Cell>
          <Cell label="Page · 1200px and Content · 768px, at this frame's width" layout="stack">
            <PageContainer gutters={false}>
              <div className="h-2 rounded-sm bg-border-strong" />
              <p className="mt-1.5 text-2xs uppercase tracking-label text-muted-foreground">
                Page · browsing
              </p>
            </PageContainer>
            <ContentContainer gutters={false}>
              <div className="h-2 rounded-sm bg-border-strong" />
              <p className="mt-1.5 text-2xs uppercase tracking-label text-muted-foreground">
                Content · a single column
              </p>
            </ContentContainer>
          </Cell>
        </Specimen>

        <Specimen
          name="Card"
          purpose="The one raised panel. Every item card in the product is a composition of this, so the radius, hairline and hover behaviour are defined once. Hover firms the hairline rather than washing the surface: in dark mode muted text on the hover wash measures 4.07:1, an AA failure, and cards are where metadata lives."
        >
          <Cell label="Padding · sm, md, lg" layout="stack">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card padding="sm">
                <p className="text-sm">Compact, for a tile in a grid.</p>
              </Card>
              <Card padding="md">
                <p className="text-sm">The default.</p>
              </Card>
              <Card padding="lg">
                <p className="text-sm">For a card that is the screen.</p>
              </Card>
            </div>
          </Cell>
          <Cell label="Interactive · selected · as a button" layout="stack">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card href="#components">
                <p className="text-sm font-medium">A link</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Hover firms the hairline. Tab to it for the focus ring.
                </p>
              </Card>
              <Card href="#components" selected>
                <p className="text-sm font-medium">Selected</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  The thread takes the hairline, and aria-current is set.
                </p>
              </Card>
              <Card asButton>
                <p className="text-sm font-medium">A button</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  For selection in place rather than navigation.
                </p>
              </Card>
            </div>
          </Cell>
        </Specimen>

        <Specimen
          name="SectionHeading"
          purpose="Every shelf and block is introduced the same way: eyebrow, serif title, one sentence, and at most one control."
        >
          <Cell label="Full · and at level 3" layout="stack">
            <SectionHeading
              eyebrow="Your library"
              title="Recently added"
              description="The last books and articles you saved."
              action={
                <Button variant="ghost" size="sm" href="#components">
                  See all
                </Button>
              }
            />
            <SectionHeading level={3} title="Notes on this book" />
          </Cell>
        </Specimen>
      </Group>

      {/* ------------------------------------------------------ navigation --- */}
      <Group title="Navigation">
        <Specimen
          name="SidebarItem · NavigationGroup"
          purpose="Persistent navigation on wide screens. Destinations are plain nouns, never metaphors. The active item carries the thread on its leading edge and aria-current for everyone else."
        >
          <Cell label="A sidebar well · one item active" layout="stack">
            <div className="w-full max-w-80 rounded-lg bg-surface-sunken p-3">
              <NavigationGroup
                label="Reading"
                ariaLabel={`Reading, ${mode} specimen`}
              >
                <SidebarItem
                  href="#components"
                  icon={<HomeIcon />}
                  label="Home"
                  active
                />
                <SidebarItem
                  href="#components"
                  icon={<QueueIcon />}
                  label="Queue"
                  count={12}
                />
                <SidebarItem
                  href="#components"
                  icon={<BookIcon />}
                  label="Library"
                  count={148}
                />
                <SidebarItem
                  href="#components"
                  icon={<HighlightIcon />}
                  label="Captures"
                  count={48}
                />
                <SidebarItem
                  href="#components"
                  icon={<SettingsIcon />}
                  label="Settings"
                />
              </NavigationGroup>
            </div>
          </Cell>
        </Specimen>

        <Specimen
          name="MobileNavItem"
          purpose="The same destinations at thumb height: icon over label, the thread marking the top edge of the active tab. The label is not hidden to save space — on a phone it is the fastest way to read the bar."
        >
          <Cell label="A bottom bar" layout="stack">
            <div className="w-full max-w-96 rounded-lg border border-border bg-surface-sunken px-2 py-1">
              <NavigationGroup
                ariaLabel={`Main, ${mode} specimen`}
                orientation="horizontal"
              >
                <MobileNavItem
                  href="#components"
                  icon={<HomeIcon />}
                  label="Home"
                  active
                />
                <MobileNavItem
                  href="#components"
                  icon={<QueueIcon />}
                  label="Queue"
                />
                <MobileNavItem
                  href="#components"
                  icon={<BookIcon />}
                  label="Library"
                />
                <MobileNavItem
                  href="#components"
                  icon={<HighlightIcon />}
                  label="Captures"
                />
              </NavigationGroup>
            </div>
          </Cell>
        </Specimen>
      </Group>

      {/* --------------------------------------------------------- reading --- */}
      <Group title="Reading">
        <Specimen
          name="BookCover"
          purpose="A book at 2:3, carrying the only shadow in the system. With no artwork it draws a deterministic plate from the book's own title and author — real libraries are full of missing covers, so the fallback is the part that matters."
        >
          <Cell label="Sizes · 64, 96, 128px">
            <BookCover title={BOOKS[0].title} author={BOOKS[0].author} size="sm" />
            <BookCover title={BOOKS[0].title} author={BOOKS[0].author} size="md" />
            <BookCover title={BOOKS[0].title} author={BOOKS[0].author} size="lg" />
          </Cell>
          <Cell label="Deterministic fallbacks · four plates, no terracotta">
            {BOOKS.map((book) => (
              <BookCover
                key={book.title}
                title={book.title}
                author={book.author}
                size="md"
              />
            ))}
          </Cell>
        </Specimen>

        <Specimen
          name="BookCard"
          purpose="The unit of the library, in two layouts: a grid of covers to look at, and a row to read down. One link, one tab stop, a real heading per book."
        >
          <Cell label="Grid" layout="stack">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <BookCard
                href="#components"
                title={BOOKS[0].title}
                author={BOOKS[0].author}
                status="Reading"
                statusTone="emphasis"
                progress={{ page: 214, pages: 344 }}
                headingLevel={4}
              />
              <BookCard
                href="#components"
                title={BOOKS[1].title}
                author={BOOKS[1].author}
                status="Finished"
                statusTone="status"
                headingLevel={4}
              />
              <BookCard
                href="#components"
                title={BOOKS[2].title}
                author={BOOKS[2].author}
                status="Want to read"
                headingLevel={4}
              />
            </div>
          </Cell>
          <Cell label="Row · and selected" layout="stack">
            <BookCard
              layout="row"
              href="#components"
              title={BOOKS[3].title}
              author={BOOKS[3].author}
              status="Reading"
              statusTone="emphasis"
              progress={{ percent: 12 }}
              headingLevel={4}
            />
            <BookCard
              layout="row"
              href="#components"
              title={BOOKS[1].title}
              author={BOOKS[1].author}
              selected
              headingLevel={4}
            />
          </Cell>
        </Specimen>

        <Specimen
          name="ContinueReadingCard"
          purpose="The most prominent card in the product: what the reader most likely came back to do. The card is an article rather than a link, because it contains a button — nesting them would make the inner one unreachable by keyboard."
        >
          <Cell label="Default" layout="stack">
            <ContinueReadingCard
              href="#components"
              title={BOOKS[0].title}
              author={BOOKS[0].author}
              progress={{ page: 214, pages: 344 }}
            />
          </Cell>
        </Specimen>

        <Specimen
          name="ReadingProgress"
          purpose="The thread with the reading meaning on it. Pages when they are known, because readers think in pages, and a percentage when they are not."
        >
          <Cell label="Pages · percent · unlabelled" layout="stack">
            <div className="flex max-w-80 flex-col gap-4">
              <ReadingProgress page={214} pages={344} />
              <ReadingProgress percent={62} />
              <ReadingProgress percent={62} showLabel={false} />
            </div>
          </Cell>
        </Specimen>
      </Group>

      {/* --------------------------------------------------------- content --- */}
      <Group title="Content">
        <Specimen
          name="ArticleCard"
          purpose="A saved article, built from the same parts as BookCard so a mixed queue reads as one collection instead of two lists sharing a page."
        >
          <Cell label="With an excerpt · selected" layout="stack">
            <ArticleCard
              href="#components"
              title="The Reading Brain in the Digital Age"
              source="Scientific American"
              readingTime={8}
              excerpt="Reading on paper and reading on a screen engage attention differently, and the difference shows up most in how much of a long argument a reader retains."
              status="Unread"
              headingLevel={4}
            />
            <ArticleCard
              href="#components"
              title="How Should One Read a Book?"
              source="The Second Common Reader"
              readingTime={14}
              selected
              headingLevel={4}
            />
          </Cell>
        </Specimen>

        <Specimen
          name="CaptureCard"
          purpose="A highlight you kept, with the quotation set in the serif at the quotation size — it is the thing you came back for. Real quotation semantics: figure, blockquote, figcaption, cite."
        >
          <Cell label="From a book, with a note · from an article · selected" layout="stack">
            <CaptureCard
              href="#components"
              quote="Waste no more time arguing about what a good man should be. Be one."
              sourceTitle="Meditations"
              sourceDetail="Book 10"
              note="Worth returning to when writing about why reading stays private."
            />
            <CaptureCard
              href="#components"
              sourceType="article"
              quote="The only advice, indeed, that one person can give another about reading is to take no advice."
              sourceTitle="How Should One Read a Book?"
            />
            <CaptureCard
              href="#components"
              quote="I quote others only in order the better to express myself."
              sourceTitle="Essays"
              sourceDetail="Book I"
              selected
            />
          </Cell>
        </Specimen>

        <Specimen
          name="SourceIcon"
          purpose="One mapping from a source kind to its mark, so a book always looks like a book. Deliberately not a favicon: fetching one would tell that site what its reader is reading."
        >
          <Cell label="Book · article · capture">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <SourceIcon type="book" label="Book" />
              Book
            </span>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <SourceIcon type="article" label="Article" />
              Article
            </span>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <SourceIcon type="capture" label="Capture" />
              Capture
            </span>
          </Cell>
        </Specimen>
      </Group>

      {/* -------------------------------------------------------- feedback --- */}
      <Group title="Feedback">
        <Specimen
          name="Dialog"
          purpose="Built on the native dialog element, so focus containment, page inertness and Escape come from the platform rather than from a hand-rolled focus trap. Separated from the page by the scrim, since shadows belong to covers."
        >
          <Cell label="Live · Escape, the backdrop and the close control all dismiss">
            <DialogDemo />
          </Cell>
        </Specimen>

        <Specimen
          name="ConfirmationDialog"
          purpose="Asking before something irreversible. Focus starts on Cancel, the backdrop does not dismiss, and the confirm button names the action. There is no destructive colour in this system: the words carry the consequence."
        >
          <Cell label="Live · confirm to see the loading state">
            <ConfirmationDemo />
          </Cell>
        </Specimen>

        <Specimen
          name="Toast"
          purpose="A brief, factual acknowledgement. Never the only record of an outcome — a message that disappears after five seconds is not a place to put information."
        >
          <Cell label="The panel" layout="stack">
            <Toast
              title="Capture saved"
              description="Kept on this device, in your captures."
            />
          </Cell>
          <Cell label="Live · announced from a polite live region">
            <ToastDemo />
          </Cell>
        </Specimen>
      </Group>
    </div>
  );
}
