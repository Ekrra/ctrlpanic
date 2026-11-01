import { afterEach, expect, it, vi } from "vitest";
import { analyzePython } from "@/lib/debug.server";
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });
it.each([402, 403])("Debug preserves HTTP %s without retrying or mislabelling access as credits", async status => {
  vi.stubEnv("LOVABLE_API_KEY", "test-key-not-a-secret");
  vi.spyOn(console, "error").mockImplementation(() => {});
  const fetchMock = vi.fn(async () => new Response("{}", { status, headers: { "content-type": "application/json" } }));
  vi.stubGlobal("fetch", fetchMock);
  const result = await analyzePython("print(1)", "");
  expect(result).toEqual({ ok: false, kind: status === 402 ? "credits" : "unknown", error: status === 402 ? "AI credits have run out for this workspace. Please try again later." : "AI access is currently blocked for this workspace." });
  expect(fetchMock).toHaveBeenCalledTimes(1);
});