import { describe, it, expect } from "vitest";
import { competitiveInputSchema, EXECUTION_STATUS, shouldRevealSolution } from "@/lib/competitive.schema";

describe("Competitive learning rules", () => {
  it("Learn First hides the solution until explicitly revealed", () => {
    expect(shouldRevealSolution(true, false)).toBe(false);
    expect(shouldRevealSolution(true, true)).toBe(true);
    expect(shouldRevealSolution(false, false)).toBe(true);
  });
  it("AI-only analysis never reports executed code", () => {
    expect(EXECUTION_STATUS).toBe("not-executed");
  });
  it("requires a problem in solver and submitted Python in review", () => {
    const input = { mode: "solver", statement: "", code: "", sampleInput: "", sampleOutput: "", constraints: "", learnFirst: true };
    expect(competitiveInputSchema.safeParse(input).success).toBe(false);
    expect(competitiveInputSchema.safeParse({ ...input, statement: "Print the sum of two integers." }).success).toBe(true);
    expect(competitiveInputSchema.safeParse({ ...input, mode: "review" }).success).toBe(false);
    expect(competitiveInputSchema.safeParse({ ...input, mode: "review", code: "print(1)" }).success).toBe(true);
  });
});