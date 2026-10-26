import { afterEach, describe, expect, it, vi } from "vitest";
import { analyzeCompetitive } from "@/lib/competitive.server";
import { competitiveInputSchema } from "@/lib/competitive.schema";

vi.mock("@tanstack/react-start/server", () => ({ getRequest: () => new Request("http://localhost:8080") }));

const input = competitiveInputSchema.parse({ mode: "solver", language: "bn", statement: "Print the product of two integers.", sampleInput: "3 4", sampleOutput: "12", constraints: "1 <= a, b <= 100", code: "a, b = map(int, input().split())", learnFirst: true });

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe("Problem Solver gateway failure propagation through the real streaming SDK", () => {
  it.each([401, 402, 403, 404, 429, 500])("preserves HTTP %s instead of hiding it behind missing output, without retrying", async status => {
    vi.stubEnv("LOVABLE_API_KEY", "test-key-not-a-secret");
    vi.spyOn(console, "error").mockImplementation(() => {});
    const message = `Safe gateway error ${status}`;
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ error: { message } }), {
      status, headers: { "content-type": "application/json", "retry-after": "12" },
    }));
    vi.stubGlobal("fetch", fetchMock);
    const response = await analyzeCompetitive(input);
    expect(response).toEqual({ ok: false, error: message, ...([429, 500].includes(status) ? { retryAfterSeconds: 12 } : {}) });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const args = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(String(args[0])).toBe("https://ai.gateway.lovable.dev/v1/responses");
    const body = JSON.parse(String(args[1].body));
    expect(body.model).toBe("openai/gpt-6-astra");
    expect(body.stream).toBe(true);
    expect(body.store).toBe(false);
    const student = body.input.find((item: { role: string }) => item.role === "user");
    expect(JSON.parse(student.content[0].text)).toEqual(input);
    expect(JSON.stringify(body.input)).toContain("beginner-friendly Bangla");
    expect(body.text.format.type).toBe("json_schema");
  });

  it("returns the credit-specific fallback when the gateway has no safe message", async () => {
    vi.stubEnv("LOVABLE_API_KEY", "test-key-not-a-secret");
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 402, headers: { "content-type": "application/json" } })));
    expect(await analyzeCompetitive(input)).toEqual({ ok: false, error: "AI credits are unavailable. The workspace owner needs to add credits before a new request." });
  });
});