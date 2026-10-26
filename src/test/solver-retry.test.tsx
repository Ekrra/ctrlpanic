import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CompetitiveWorkspace } from "@/components/CompetitiveWorkspace";
import { LanguageProvider } from "@/components/LanguageProvider";

const { run } = vi.hoisted(() => ({ run: vi.fn() }));
vi.mock("@tanstack/react-start", () => ({ useServerFn: () => run }));
vi.mock("@/lib/competitive.functions", () => ({ analyzeCompetition: run }));
vi.mock("@/components/CodeEditor", () => ({ CodeEditor: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => <textarea aria-label="Student attempt" value={value} onChange={e => onChange(e.target.value)} /> }));
vi.mock("@/components/Mascot", () => ({ Mascot: () => null }));

afterEach(() => { cleanup(); vi.useRealTimers(); run.mockReset(); });

function setup() {
  render(<LanguageProvider><CompetitiveWorkspace mode="solver" /></LanguageProvider>);
  fireEvent.change(screen.getByLabelText("Problem statement"), { target: { value: "Print the product of two integers." } });
  fireEvent.change(screen.getByLabelText("Sample input (optional)"), { target: { value: "3 4" } });
  fireEvent.change(screen.getByLabelText("Sample output (optional)"), { target: { value: "12" } });
  fireEvent.change(screen.getByLabelText("Constraints (optional)"), { target: { value: "1 <= a, b <= 100" } });
  fireEvent.change(screen.getByLabelText("Student attempt"), { target: { value: "print(3 * 4)" } });
}

describe("Problem Solver request safety", () => {
  it("preserves every student input on a terminal failure and never automatically retries", async () => {
    run.mockResolvedValue({ ok: false, error: "AI credits are unavailable. The workspace owner needs to add credits before a new request." });
    setup();
    fireEvent.click(screen.getByRole("button", { name: "Help me solve it" }));
    await waitFor(() => expect(run).toHaveBeenCalledTimes(1));
    await screen.findByRole("alert");
    expect(run).toHaveBeenCalledWith({ data: { language: "en", mode: "solver", statement: "Print the product of two integers.", sampleInput: "3 4", sampleOutput: "12", constraints: "1 <= a, b <= 100", code: "print(3 * 4)", learnFirst: true } });
    expect(screen.getByLabelText("Problem statement")).toHaveValue("Print the product of two integers.");
    expect(screen.getByLabelText("Sample input (optional)")).toHaveValue("3 4");
    expect(screen.getByLabelText("Sample output (optional)")).toHaveValue("12");
    expect(screen.getByLabelText("Constraints (optional)")).toHaveValue("1 <= a, b <= 100");
    expect(screen.getByLabelText("Student attempt")).toHaveValue("print(3 * 4)");
    expect(screen.getByRole("button", { name: "Help me solve it" })).toBeEnabled();
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("honors a transient retry delay without replaying work, including after Reset", async () => {
    vi.useFakeTimers();
    run.mockResolvedValue({ ok: false, error: "AI is busy right now. Please wait before trying again.", retryAfterSeconds: 12 });
    setup();
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Help me solve it" })));
    expect(screen.getByRole("button", { name: "Please wait before retrying" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByRole("button", { name: "Please wait before retrying" })).toBeDisabled();
    await act(async () => vi.advanceTimersByTime(12000));
    expect(screen.getByRole("button", { name: "Help me solve it" })).toBeEnabled();
    expect(run).toHaveBeenCalledTimes(1);
  });
});