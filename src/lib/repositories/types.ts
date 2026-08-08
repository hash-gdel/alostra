import type {
  Article,
  ArticleInput,
  ArticleStatus,
  Book,
  BookInput,
  BookStatus,
  Capture,
  CaptureInput,
} from "@/lib/domain/types";

export type CaptureWithSource = {
  capture: Capture;
  sourceTitle: string;
  sourceDetail?: string;
};

export type BookRepository = {
  list(): Promise<Book[]>;
  get(id: string): Promise<Book | undefined>;
  create(input: BookInput): Promise<Book>;
  update(
    id: string,
    input: Partial<BookInput> & { status?: BookStatus; lastOpenedAt?: string },
  ): Promise<Book>;
  delete(id: string): Promise<void>;
  touchOpened(id: string): Promise<Book>;
};

export type ArticleRepository = {
  list(): Promise<Article[]>;
  get(id: string): Promise<Article | undefined>;
  create(input: ArticleInput): Promise<Article>;
  update(
    id: string,
    input: Partial<ArticleInput> & {
      status?: ArticleStatus;
      lastOpenedAt?: string;
    },
  ): Promise<Article>;
  delete(id: string): Promise<void>;
  touchOpened(id: string): Promise<Article>;
};

export type CaptureRepository = {
  list(): Promise<Capture[]>;
  get(id: string): Promise<Capture | undefined>;
  listForSource(
    sourceType: Capture["sourceType"],
    sourceId: string,
  ): Promise<Capture[]>;
  create(input: CaptureInput): Promise<Capture>;
  update(id: string, input: Partial<CaptureInput>): Promise<Capture>;
  delete(id: string): Promise<void>;
  listWithSources(): Promise<CaptureWithSource[]>;
};
