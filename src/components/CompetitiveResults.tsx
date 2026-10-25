import { useLanguage } from "./LanguageProvider";
import { useState } from "react";
import { BookOpen, Check, Copy, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { CodeEditor } from "./CodeEditor";
import { shouldRevealSolution, type CompetitiveAnalysis } from "@/lib/competitive.schema";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="min-w-0 border-b py-5 last:border-b-0"><h3 className="mb-3 text-lg font-semibold">{title}</h3>{children}</section>;
}
function Steps({ items }: { items: string[] }) {
  return <ol className="grid gap-3">{items.map((item, i) => <li className="flex min-w-0 gap-3" key={i}><span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold">{i + 1}</span><p className="min-w-0 whitespace-pre-wrap break-words leading-relaxed">{item}</p></li>)}</ol>;
}

export function CompetitiveResults({ analysis: a, learnFirst, review }: { analysis: CompetitiveAnalysis; learnFirst: boolean; review: boolean }) {
  const { t, language } = useLanguage();
  const [revealed, setRevealed] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const showSolution = shouldRevealSolution(learnFirst, revealed);
  const copy = async () => {
    try { await navigator.clipboard.writeText(a.solution); setCopied(true); toast.success(t("Python solution copied.")); }
    catch { toast.error(t("Couldn't copy. Select the code and copy it manually.")); }
  };
  return <div aria-live="polite" className="animate-rise min-w-0 break-words">
    <div className="border-b pb-5"><p className="mb-2 text-xs font-medium text-muted-foreground">{t("Live AI analysis \u00b7 Code not executed")}</p><h3 className="text-xl font-semibold">{a.summary}</h3><p className="mt-2 text-sm text-muted-foreground">{t("No judge verdict. Test the solution yourself before submitting.")}</p></div>
    <Section title={review ? t("Understanding your solution") : t("The problem, in plain English")}><p className="whitespace-pre-wrap leading-relaxed">{a.problemExplanation}</p></Section>
    <div className="grid gap-x-8 sm:grid-cols-2"><Section title={t("Input breakdown")}><p className="whitespace-pre-wrap leading-relaxed">{a.inputBreakdown}</p></Section><Section title={t("Output breakdown")}><p className="whitespace-pre-wrap leading-relaxed">{a.outputBreakdown}</p></Section></div>
    {a.concepts.length > 0 && <Section title={t("Concepts to know")}><dl className="grid gap-3">{a.concepts.map((c, i) => <div key={i}><dt className="font-semibold">{c.name}</dt><dd className="leading-relaxed text-muted-foreground">{c.explanation}</dd></div>)}</dl></Section>}
    {review && <Section title={t("Review findings")}>{a.issues.length === 0 ? <p>{t("No definite issues identified by AI. This is not proof of correctness.")}</p> : <div className="grid gap-4">{a.issues.map((issue, i) => <div key={i} className="border-l-2 border-primary pl-4"><p className="mb-1 text-sm font-semibold capitalize">{t(issue.category)}{issue.line ? ` · ${t("Original line")} ${issue.line}` : ""}</p><p>{issue.explanation}</p><p className="mt-2 text-muted-foreground">{issue.suggestion}</p></div>)}</div>}</Section>}
    {a.hints.length > 0 && <Section title={t("A little nudge")}><Steps items={a.hints.slice(0, hintCount)} />{hintCount < a.hints.length && <Button variant="outline" className="btn btn-ghost mt-3" onClick={() => setHintCount(n => n + 1)}><Lightbulb />{hintCount ? t("Next hint") : t("Show a hint")}</Button>}</Section>}
    <Section title={t("Step-by-step algorithm")}><Steps items={a.algorithm} /></Section>
    <Section title={t("Time & space")}><p className="font-mono text-sm">{t("Time:")} {a.complexity.time} · {t("Space:")} {a.complexity.space}</p><p className="mt-2 leading-relaxed text-muted-foreground">{a.complexity.explanation}</p></Section>
    {a.solution && <Section title={review ? t("Suggested correction") : t("Python solution")}>
      {!showSolution ? <Button className="btn btn-primary" onClick={() => setRevealed(true)}><BookOpen />{t("Reveal Python solution")}</Button> : <><div className="mb-3 flex justify-end"><Button variant="outline" className="btn btn-ghost" aria-label={t("Copy Python solution")} onClick={copy}>{copied ? <Check /> : <Copy />}{copied ? t("Copied") : t("Copy")}</Button></div><div className="overflow-hidden rounded-xl bg-code"><CodeEditor value={a.solution} readOnly minHeight="100px" ariaLabel={t("Competitive Python solution")} /></div><h4 className="mt-5 mb-3 font-semibold">{t("Line by line")}</h4><ol className="grid gap-3">{a.lineExplanations.map((l, i) => <li key={i} className="flex gap-3"><span className="shrink-0 font-mono text-sm text-primary">L{l.line}</span><p className="leading-relaxed">{l.explanation}</p></li>)}</ol></>}
    </Section>}
    {showSolution && a.testCases.length > 0 && <Section title={t("Suggested test cases — not executed")}><div className="grid gap-4 sm:grid-cols-2">{a.testCases.map((tc, i) => <article className="min-w-0 rounded-xl border bg-card p-4" key={i}><h4 className="mb-2 font-semibold">{t("Case")} {i + 1}</h4><p className="mb-1 text-xs text-muted-foreground">{t("Input")}</p><pre className="whitespace-pre-wrap break-all rounded-lg bg-code p-3 font-mono text-sm text-code-foreground">{tc.input}</pre><p className="mt-3 mb-1 text-xs text-muted-foreground">{t("Expected output (AI prediction)")}</p><pre className="whitespace-pre-wrap break-all rounded-lg bg-code p-3 font-mono text-sm text-code-foreground">{tc.expectedOutput}</pre><p className="mt-3 text-sm text-muted-foreground">{tc.reason}</p></article>)}</div></Section>}
    {a.caveats.length > 0 && <Section title={t("Before you submit")}><ul className="list-disc space-y-2 pl-5 text-muted-foreground">{a.caveats.map((c, i) => <li key={i}>{c}</li>)}</ul></Section>}
  </div>;
}
