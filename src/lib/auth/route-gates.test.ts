import { describe, expect, it } from "vitest";
import {
  DEFAULT_POST_AUTH_PATH,
  isAuthEntryPath,
  isProductPath,
  isSafeNextPath,
  resolvePostAuthPath,
} from "@/lib/auth/route-gates";

describe("route gates", () => {
  it("marks product paths as protected", () => {
    expect(isProductPath("/home")).toBe(true);
    expect(isProductPath("/library")).toBe(true);
    expect(isProductPath("/library/books/new")).toBe(true);
    expect(isProductPath("/captures/abc/edit")).toBe(true);
    expect(isProductPath("/")).toBe(false);
    expect(isProductPath("/sign-in")).toBe(false);
    expect(isProductPath("/dev/design-system")).toBe(false);
  });

  it("marks auth entry paths", () => {
    expect(isAuthEntryPath("/sign-in")).toBe(true);
    expect(isAuthEntryPath("/sign-up")).toBe(true);
    expect(isAuthEntryPath("/forgot-password")).toBe(false);
  });

  it("accepts only safe same-origin product next paths", () => {
    expect(isSafeNextPath("/home")).toBe(true);
    expect(isSafeNextPath("/library/books/1/edit")).toBe(true);
    expect(isSafeNextPath("/captures?x=1")).toBe(true);
    expect(isSafeNextPath("https://evil.example/home")).toBe(false);
    expect(isSafeNextPath("//evil.example")).toBe(false);
    expect(isSafeNextPath("/sign-in")).toBe(false);
    expect(isSafeNextPath("/")).toBe(false);
  });

  it("resolves post-auth path with a safe default", () => {
    expect(resolvePostAuthPath(null)).toBe(DEFAULT_POST_AUTH_PATH);
    expect(resolvePostAuthPath("/library")).toBe("/library");
    expect(resolvePostAuthPath("https://evil.example")).toBe(
      DEFAULT_POST_AUTH_PATH,
    );
  });
});
