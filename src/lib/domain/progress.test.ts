import { describe, expect, it } from "vitest";
import { clamp, computeArticleProgress, computeBookProgress } from "./progress";

describe("clamp", () => {
  it("keeps values inside the range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(99, 0, 10)).toBe(10);
  });

  it("treats non-finite numbers as the minimum", () => {
    expect(clamp(Number.NaN, 0, 10)).toBe(0);
    expect(clamp(Number.POSITIVE_INFINITY, 0, 10)).toBe(0);
  });
});

describe("computeBookProgress", () => {
  it("derives percent from pages", () => {
    expect(
      computeBookProgress({
        status: "reading",
        currentPage: 50,
        totalPages: 200,
      }),
    ).toEqual({ currentPage: 50, totalPages: 200, progressPercent: 25 });
  });

  it("clamps current page to total pages", () => {
    expect(
      computeBookProgress({
        status: "reading",
        currentPage: 500,
        totalPages: 100,
      }).currentPage,
    ).toBe(100);
  });

  it("rejects negative pages", () => {
    const result = computeBookProgress({
      status: "reading",
      currentPage: -3,
      totalPages: -10,
    });
    expect(result.currentPage).toBe(0);
    expect(result.totalPages).toBeUndefined();
    expect(result.progressPercent).toBe(0);
  });

  it("sets progress to 100 when finished", () => {
    expect(
      computeBookProgress({
        status: "finished",
        currentPage: 12,
        totalPages: 100,
      }),
    ).toEqual({ currentPage: 100, totalPages: 100, progressPercent: 100 });
  });

  it("returns 0 when pages are incomplete", () => {
    expect(
      computeBookProgress({ status: "reading", currentPage: 10 }).progressPercent,
    ).toBe(0);
  });
});

describe("computeArticleProgress", () => {
  it("forces 100 when finished", () => {
    expect(computeArticleProgress({ status: "finished", progressPercent: 10 })).toBe(
      100,
    );
  });

  it("clamps provided percents", () => {
    expect(computeArticleProgress({ status: "reading", progressPercent: 150 })).toBe(
      100,
    );
    expect(computeArticleProgress({ status: "saved", progressPercent: -5 })).toBe(0);
  });
});
