import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LearningWorkspace } from "@/components/LearningWorkspace";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import { DEBUG_SAMPLES, REVIEW_SAMPLES, SOLVER_SAMPLES } from "@/lib/demo-samples";

const { run } = vi.hoisted(() => ({ run: vi.fn() }));
vi.mock("@tanstack/react-start", () => ({ useServerFn: () => run }));
vi.mock("@/lib/competitive.functions", () => ({ analyzeCompetition: run }));
vi.mock("@/lib/debug.functions", () => ({ analyzeCode: run }));
vi.mock("@/components/Mascot", () => ({ Mascot: () => null }));
vi.mock("@/components/CodeEditor", () => ({ CodeEditor: ({ value, onChange, ariaLabel, readOnly }: { value: string; onChange?: (v: string) => void; ariaLabel: string; readOnly?: boolean }) => <textarea aria-label={ariaLabel} value={value} readOnly={readOnly} onChange={e => onChange?.(e.target.value)} /> }));
function App() { const { setLanguage } = useLanguage(); return <><button onClick={() => setLanguage("bn")}>বাংলা</button><LearningWorkspace /></>; }
afterEach(() => { cleanup(); run.mockReset(); });

describe("Hybrid online/offline safety", () => {
  it.each(["Debug Mode", "Problem Solver", "Code Review"])("%s switches offline without requests and preserves input", async mode => {
    render(<LanguageProvider><App /></LanguageProvider>);
    fireEvent.click(screen.getByRole("tab", { name: mode }));
    const label = mode === "Debug Mode" ? "Python code editor" : mode === "Code Review" ? "Python solution to review" : "Problem statement";
    fireEvent.change(screen.getByLabelText(label), { target: { value: "Student work stays here" } });
    fireEvent.click(screen.getByRole("button", { name: /^Offline demo sample$/ }));
    expect(screen.getByTestId("offline-sample")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: /^বাংলা$/ }));
    expect(screen.getByTestId("offline-sample")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: /^অনলাইন AI$/ }));
    expect(screen.getByDisplayValue("Student work stays here")).toBeVisible();
    expect(run).not.toHaveBeenCalled();
  });
  it.each(["Debug Mode", "Problem Solver", "Code Review"])("%s offers offline after a 402 without replaying", async mode => {
    run.mockResolvedValue({ ok: false, kind: "credits", errorStatus: 402, error: "AI credits have run out for this workspace. Please try again later." });
    render(<LanguageProvider><App /></LanguageProvider>);
    fireEvent.click(screen.getByRole("tab", { name: mode }));
    if (mode === "Problem Solver") fireEvent.change(screen.getByLabelText("Problem statement"), { target: { value: "Print the sum of two integers." } });
    else fireEvent.change(screen.getByLabelText(mode === "Debug Mode" ? "Python code editor" : "Python solution to review"), { target: { value: "print(1)" } });
    fireEvent.click(screen.getByRole("button", { name: mode === "Debug Mode" ? "Analyze my code" : mode === "Problem Solver" ? "Help me solve it" : "Review my solution" }));
    await waitFor(() => expect(run).toHaveBeenCalledTimes(1));
    fireEvent.click(await screen.findByRole("button", { name: "View an offline demo sample" }));
    expect(screen.getByTestId("offline-sample")).toBeVisible();
    expect(run).toHaveBeenCalledTimes(1);
  });
  it("keeps Python and sample I/O identical across languages", () => {
    expect(DEBUG_SAMPLES.bn.code).toBe(DEBUG_SAMPLES.en.code);
    expect(DEBUG_SAMPLES.bn.analysis.correctedCode).toBe(DEBUG_SAMPLES.en.analysis.correctedCode);
    for (const samples of [SOLVER_SAMPLES, REVIEW_SAMPLES]) {
      expect(samples.bn.analysis.solution).toBe(samples.en.analysis.solution);
      expect(samples.bn.sampleInput).toBe(samples.en.sampleInput);
      expect(samples.bn.sampleOutput).toBe(samples.en.sampleOutput);
    }
  });
});