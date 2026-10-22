import { z } from "zod";

/** Structured shape the AI must return for every analysis. Shared by server and UI. */
export const analysisSchema = z.object({
  hasError: z.boolean().describe("false only if the code looks correct"),
  errorType: z.string().describe("Python error name, e.g. SyntaxError, IndentationError, or 'No error found'"),
  lineNumber: z.number().int().nullable().describe("1-based line of the problem, or null"),
  lineCode: z.string().nullable().describe("The exact problematic line as written, or null"),
  friendlyQuip: z.string().describe("One short, kind, playful line, e.g. 'Bestie, this line needs a colon.' Never mocking."),
  simpleExplanation: z.string().describe("2-3 sentences in plain English for a beginner"),
  whyItHappened: z.string().describe("The underlying concept that caused it"),
  correctedCode: z.string().describe("Full corrected Python code, no markdown fences"),
  steps: z.array(z.string()).describe("3-6 short step-by-step fix explanations"),
  practice: z.object({
    question: z.string().describe("A small related practice question"),
    hint: z.string(),
    answer: z.string().describe("Short answer or code"),
  }),
});

export type Analysis = z.infer<typeof analysisSchema>;

export const analyzeInputSchema = z.object({
  code: z.string().trim().min(1, "Paste some Python code first.").max(12000, "That's a lot of code! Keep it under 12,000 characters."),
  errorMessage: z.string().max(4000).optional().default(""),
});

export type AnalyzeResult =
  | { ok: true; analysis: Analysis }
  | { ok: false; error: string; kind: "setup" | "credits" | "rate" | "invalid" | "unknown" };
