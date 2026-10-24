import { createServerFn } from "@tanstack/react-start";
import { analyzeInputSchema, type AnalyzeResult } from "./debug.schema";

export const analyzeCode = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => analyzeInputSchema.parse(input))
  .handler(async ({ data }): Promise<AnalyzeResult> => {
    const { analyzePython } = await import("./debug.server");
    return analyzePython(data.code, data.errorMessage, data.language);
  });
