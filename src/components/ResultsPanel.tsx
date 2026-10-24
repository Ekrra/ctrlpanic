import { Button } from "./ui/button";
import { useLanguage } from "./LanguageProvider";
import { useState } from "react";
import { Check, Copy, Lightbulb, ListOrdered, Bug, HelpCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { Analysis } from "@/lib/debug.schema";
import { CodeEditor } from "./CodeEditor";

function Section({ icon, title, children, delay = 0 }: { icon: React.ReactNode; title: string; children: React.ReactNode; delay?: number }) {
  return (
    <section className="card-soft animate-rise p-5 sm:p-6" style={{ animationDelay: `${delay}ms` }}>
      <h3 className="mb-3 flex items-center gap-2 text-base font-semibold">
        <span className="grid size-7 place-items-center rounded-lg bg-secondary text-secondary-foreground">{icon}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

export function ResultsPanel({ analysis }: { analysis: Analysis }) {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(analysis.correctedCode);
      setCopied(true);
      toast.success(t("Fixed code copied. Go get 'em."));
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error(t("Couldn't copy automatically. Select the code and copy it manually."));
    }
  };

  return (
    <div className="grid gap-4" aria-live="polite">
      <div className="card-soft animate-rise flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 font-mono text-xs font-semibold ${analysis.hasError ? "bg-butter text-butter-foreground" : "bg-secondary text-secondary-foreground"}`}>
              {analysis.errorType}
            </span>
            {analysis.lineNumber && <span className="text-sm text-muted-foreground">{t("Line")} {analysis.lineNumber}</span>}
            <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs text-muted-foreground"><Sparkles className="size-3" />{t("Live AI analysis")}</span>
          </div>
          <p className="font-display text-lg font-semibold">{analysis.friendlyQuip}</p>
        </div>
      </div>

      {analysis.lineCode && (
        <div className="animate-rise overflow-hidden rounded-2xl border bg-code font-mono text-sm text-code-foreground" style={{ animationDelay: "60ms" }}>
          <div className="flex gap-4 px-4 py-3">
            <span className="text-code-foreground/40">{analysis.lineNumber ?? "?"}</span>
            <code className="whitespace-pre-wrap break-all">{analysis.lineCode}</code>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Section icon={<Bug className="size-4" />} title={t("What's going on")} delay={100}>
          <p className="leading-relaxed text-muted-foreground">{analysis.simpleExplanation}</p>
        </Section>
        <Section icon={<HelpCircle className="size-4" />} title={t("Why it happened")} delay={150}>
          <p className="leading-relaxed text-muted-foreground">{analysis.whyItHappened}</p>
        </Section>
      </div>

      <section className="card-soft animate-rise overflow-hidden" style={{ animationDelay: "200ms" }}>
        <div className="flex items-center justify-between gap-2 border-b px-5 py-3">
          <h3 className="font-semibold">{t("Corrected code")}</h3>
          <Button type="button" onClick={copy} className="btn btn-ghost px-3 py-1.5 text-sm" aria-label={t("Copy corrected code")}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? t("Copied") : t("Copy")}
          </Button>
        </div>
        <CodeEditor value={analysis.correctedCode} readOnly minHeight="80px" ariaLabel={t("Corrected Python code")} />
      </section>

      <Section icon={<ListOrdered className="size-4" />} title={t("Step-by-step fix")} delay={250}>
        <ol className="grid gap-3">
          {analysis.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
              <span className="leading-relaxed text-muted-foreground">{s}</span>
            </li>
          ))}
        </ol>
      </Section>

      <section className="animate-rise rounded-2xl border bg-butter/40 p-5 sm:p-6" style={{ animationDelay: "300ms" }}>
        <h3 className="mb-2 flex items-center gap-2 font-semibold"><Lightbulb className="size-4" /> Practice round</h3>
        <p className="mb-3 leading-relaxed">{analysis.practice.question}</p>
        <p className="mb-4 text-sm text-muted-foreground"><span className="font-semibold">{t("Hint:")}</span> {analysis.practice.hint}</p>
        <Button type="button" className="btn btn-ghost bg-card py-2 text-sm" onClick={() => setShowAnswer((v) => !v)} aria-expanded={showAnswer}>
          {showAnswer ? t("Hide answer") : t("Reveal answer")}
        </Button>
        {showAnswer && <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-code p-4 font-mono text-sm text-code-foreground animate-rise">{analysis.practice.answer}</pre>}
      </section>
    </div>
  );
}
