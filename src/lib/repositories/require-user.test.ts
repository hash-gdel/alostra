import { describe, expect, it, vi } from "vitest";
import {
  AuthenticationRequiredError,
  requireUser,
} from "@/lib/repositories/require-user";

describe("requireUser", () => {
  it("rejects when there is no session", async () => {
    const createClient = vi.fn(() => ({
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
    }));

    await expect(
      requireUser({ createClient: createClient as never }),
    ).rejects.toBeInstanceOf(AuthenticationRequiredError);
  });

  it("returns client and userId when authenticated", async () => {
    const user = { id: "user-1", email: "a@example.com" };
    const client = {
      auth: {
        getUser: async () => ({ data: { user }, error: null }),
      },
    };
    const result = await requireUser({ createClient: () => client as never });
    expect(result.userId).toBe("user-1");
    expect(result.client).toBe(client);
  });
});
