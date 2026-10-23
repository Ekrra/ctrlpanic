import { createServerFn } from "@tanstack/react-start";
import { competitiveInputSchema } from "./competitive.schema";

export const analyzeCompetition = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => competitiveInputSchema.parse(input))
  .handler(async ({ data }) => {
    const { analyzeCompetitive } = await import("./competitive.server");
    return analyzeCompetitive(data);
  });