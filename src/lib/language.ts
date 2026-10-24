import { z } from "zod";
import { bangla } from "./translations";

export const languageSchema = z.enum(["en", "bn"]).default("en");
export type Language = z.infer<typeof languageSchema>;
export function translate(language: Language, text: string) {
  return language === "bn" ? bangla[text] ?? text : text;
}
export function responseLanguageInstruction(language: Language) {
  return language === "bn"
    ? "Write ALL explanatory prose, feedback, hints, concept names, line explanations, caveats and practice answers in clear, natural, beginner-friendly Bangla. Explain unfamiliar terms in Bangla, optionally with the English term in parentheses."
    : "Write ALL explanations and feedback in simple, beginner-friendly English.";
}

export const BEGINNER_SOLVER_INSTRUCTION = `For solver, prefer simple, readable Python when constraints allow. For straightforward input problems, prefer input() and input().split(); avoid unnecessary imports, advanced input techniques, complicated syntax, import sys or sys.stdin.read() without a meaningful benefit. For a problem reading two integers and printing their product, prefer a, b = map(int, input().split()) followed by print(a * b). This is an example ONLY, never force it onto unrelated problems. Choose input methods and algorithms from the actual statement and constraints. If advanced input such as sys.stdin.read() is genuinely useful, explain why and provide a simpler alternative when suitable. If a simpler approach fails constraints, explain why and use the appropriate efficient solution. Explain EVERY line of the generated solution, including input parsing and imports, in the selected language. Preserve correctness, variable names, Python syntax and required input/output formats.`;