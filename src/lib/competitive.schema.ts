import { z } from "zod";
import { languageSchema } from "./language";

export const competitiveInputSchema = z.object({
  language: languageSchema,
  mode: z.enum(["solver", "review"]),
  statement: z.string().trim().max(18000),
  sampleInput: z.string().max(4000),
  sampleOutput: z.string().max(4000),
  constraints: z.string().max(4000),
  code: z.string().max(12000),
  learnFirst: z.boolean(),
}).superRefine((input, ctx) => {
  if (input.mode === "solver" && !input.statement) ctx.addIssue({ code: "custom", path: ["statement"], message: "Paste a problem statement first." });
  if (input.mode === "review" && !input.code.trim()) ctx.addIssue({ code: "custom", path: ["code"], message: "Paste your Python solution first." });
});

export const competitiveAnalysisSchema = z.object({
  summary: z.string(),
  problemExplanation: z.string(),
  inputBreakdown: z.string(),
  outputBreakdown: z.string(),
  concepts: z.array(z.object({ name: z.string(), explanation: z.string() })),
  hints: z.array(z.string()),
  algorithm: z.array(z.string()),
  solution: z.string(),
  lineExplanations: z.array(z.object({ line: z.number().int(), explanation: z.string() })),
  complexity: z.object({ time: z.string(), space: z.string(), explanation: z.string() }),
  issues: z.array(z.object({ category: z.enum(["syntax", "logic", "edge case", "complexity"]), line: z.number().int().nullable(), explanation: z.string(), suggestion: z.string() })),
  testCases: z.array(z.object({ input: z.string(), expectedOutput: z.string(), reason: z.string() })),
  caveats: z.array(z.string()),
});

export type CompetitiveInput = z.infer<typeof competitiveInputSchema>;
export type CompetitiveAnalysis = z.infer<typeof competitiveAnalysisSchema>;
export type CompetitiveResult = { ok: true; analysis: CompetitiveAnalysis; execution: "not-executed" } | { ok: false; error: string };
export const EXECUTION_STATUS = "not-executed" as const;
export function shouldRevealSolution(learnFirst: boolean, revealed: boolean) { return !learnFirst || revealed; }