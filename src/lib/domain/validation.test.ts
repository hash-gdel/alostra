import { describe, expect, it } from "vitest";
import {
  isValidHttpUrl,
  validateArticleForm,
  validateBookForm,
  validateCaptureForm,
} from "./validation";

describe("isValidHttpUrl", () => {
  it("accepts http(s) URLs", () => {
    expect(isValidHttpUrl("https://example.com/a")).toBe(true);
    expect(isValidHttpUrl("http://localhost:3000")).toBe(true);
  });

  it("rejects non-URLs", () => {
    expect(isValidHttpUrl("not a url")).toBe(false);
    expect(isValidHttpUrl("/relative")).toBe(false);
    expect(isValidHttpUrl("ftp://example.com")).toBe(false);
  });
});

describe("validateBookForm", () => {
  it("requires a title and a status", () => {
    const { errors } = validateBookForm({
      title: "  ",
      author: "",
      coverUrl: "",
      status: "",
      currentPage: "",
      totalPages: "",
    });
    expect(errors.title).toBeTruthy();
    expect(errors.status).toBeTruthy();
  });

  it("rejects current page past the last page", () => {
    const { errors } = validateBookForm({
      title: "A book",
      author: "Someone",
      coverUrl: "",
      status: "reading",
      currentPage: "50",
      totalPages: "40",
    });
    expect(errors.currentPage).toMatch(/past the last page/);
  });

  it("returns cleaned data when valid", () => {
    const { data, errors } = validateBookForm({
      title: "  Ex Libris  ",
      author: "Anne Fadiman",
      coverUrl: "",
      status: "want-to-read",
      currentPage: "",
      totalPages: "162",
    });
    expect(errors).toEqual({});
    expect(data).toMatchObject({
      title: "Ex Libris",
      author: "Anne Fadiman",
      status: "want-to-read",
      totalPages: 162,
    });
  });
});

describe("validateArticleForm", () => {
  it("requires title and a valid URL", () => {
    const { errors } = validateArticleForm({
      title: "",
      url: "notaurl",
      author: "",
      siteName: "",
      status: "saved",
    });
    expect(errors.title).toBeTruthy();
    expect(errors.url).toMatch(/valid http/);
  });
});

describe("validateCaptureForm", () => {
  it("requires source and text", () => {
    const { errors } = validateCaptureForm({
      sourceType: "book",
      sourceId: "",
      text: "",
      note: "",
      pageNumber: "",
    });
    expect(errors.sourceId).toBeTruthy();
    expect(errors.text).toBeTruthy();
  });

  it("disallows page numbers on articles", () => {
    const { errors } = validateCaptureForm({
      sourceType: "article",
      sourceId: "a1",
      text: "A line",
      note: "",
      pageNumber: "3",
    });
    expect(errors.pageNumber).toMatch(/only for books/);
  });
});
