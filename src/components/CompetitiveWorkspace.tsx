import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, BookOpen, Loader2, RotateCcw, SearchCheck } from "lucide-react";
import { analyzeCompetition } from "@/lib/competitive.functions";
import { competitiveInputSchema, type CompetitiveInput, type CompetitiveAnalysis } from "@/lib/competitive.schema";
import { Button } from "./ui/button";
import { CodeEditor } from "./CodeEditor";
import { Mascot } from "./Mascot";
import { CompetitiveResults } from "./CompetitiveResults";

type Mode = "solver" | "review";
const empty = { statement: "", sampleInput: "", sampleOutput: "", constraints: "", code: "", learnFirst: true };
function Field({ label, id, value, onChange, placeholder, tall = false }: { label: string; id: string; value: string; onChange: (v: string) => void; placeholder: string; tall?: boolean }) {
  return <div className="min-w-0"><label htmlFor={id} className="mb-2 block text-sm font-semibold">{label}</label><textarea id={id} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={`w-full resize-y rounded-xl border bg-background p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 ${tall ? "min-h-44" : "min-h-28"}`} /></div>;
}
export function CompetitiveWorkspace({ mode }: { mode: Mode }) {
  const [input, setInput] = useState(empty);
  const [problem, setProblem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ analysis: CompetitiveAnalysis; learnFirst: boolean } | null>(null);
  const results = useRef<HTMLDivElement>(null);
  const run = useServerFn(analyzeCompetition);
  const review = mode === "review";
  const update = (key: keyof typeof empty, value: string | boolean) => { setInput(s => ({ ...s, [key]: value })); setProblem(null); };
  const submit = async () => {
    const parsed = competitiveInputSchema.safeParse({ ...input, mode });
    if (!parsed.success) { setProblem(parsed.error.issues[0]?.message ?? "Please check your inputs."); return; }
    setLoading(true); setProblem(null); setResult(null);
    try {
      const response = await run({ data: parsed.data as CompetitiveInput });
      if (response.ok) { setResult({ analysis: response.analysis, learnFirst: !review && input.learnFirst }); requestAnimationFrame(() => results.current?.scrollIntoView({ behavior: "smooth", block: "start" })); }
      else setProblem(response.error);
    } catch { setProblem("Couldn't reach the AI tutor. Your inputs are safe here; check your connection before trying again."); }
    finally { setLoading(false); }
  };
  return <section className="px-4 pt-8 pb-16 sm:pb-24"><div className="mx-auto max-w-6xl">
    <div className="mb-6 flex items-center justify-between gap-4"><div><p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">Competitive programming</p><h2 className="text-3xl font-bold sm:text-4xl">{review ? "Your code. A second pair of eyes." : "Think it through. Then code it."}</h2></div><Mascot mood={loading ? "confused" : "happy"} className={`size-20 shrink-0 sm:size-28 ${loading ? "animate-wiggle" : ""}`} /></div>
    <p className="mb-5 text-sm text-muted-foreground">AI-based {review ? "review" : "guidance"} · Submitted code is not executed.</p>
    <form onSubmit={e => { e.preventDefault(); void submit(); }} className="min-w-0">
      <fieldset disabled={loading} className="grid min-w-0 gap-5 disabled:opacity-70">
        <Field id={`${mode}-statement`} label={`Problem statement${review ? " (optional, helps check logic)" : ""}`} value={input.statement} onChange={v => update("statement", v)} placeholder="Paste the complete problem statement…" tall />
        <div className="grid min-w-0 gap-5 sm:grid-cols-2"><Field id={`${mode}-sample-input`} label="Sample input (optional)" value={input.sampleInput} onChange={v => update("sampleInput", v)} placeholder="Example input from the problem…" /><Field id={`${mode}-sample-output`} label="Sample output (optional)" value={input.sampleOutput} onChange={v => update("sampleOutput", v)} placeholder="Expected output for that sample…" /></div>
        <Field id={`${mode}-constraints`} label="Constraints (optional)" value={input.constraints} onChange={v => update("constraints", v)} placeholder="e.g. 1 ≤ n ≤ 100000; time limit 2 seconds…" />
        <div className="min-w-0"><p className="mb-2 text-sm font-semibold">{review ? "Your Python solution" : "Your Python attempt (optional)"}</p><div className="overflow-hidden rounded-xl border bg-code"><CodeEditor value={input.code} onChange={v => update("code", v)} readOnly={loading} minHeight="220px" ariaLabel={review ? "Python solution to review" : "Python attempt"} /></div></div>
        {!review && <label className="flex w-fit cursor-pointer items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={input.learnFirst} onChange={e => update("learnFirst", e.target.checked)} className="size-4 accent-primary" />Learn First</label>}
      </fieldset>
      {problem && <div role="alert" className="mt-5 flex gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm"><AlertTriangle className="size-4 shrink-0 text-destructive" />{problem}</div>}
      <div className="mt-5 flex flex-wrap gap-3"><Button type="submit" disabled={loading} className="btn btn-primary h-auto whitespace-normal">{loading ? <Loader2 className="animate-spin" /> : review ? <SearchCheck /> : <BookOpen />}{loading ? "Thinking it through…" : review ? "Review my solution" : "Help me solve it"}</Button><Button type="button" disabled={loading} variant="outline" className="btn btn-ghost h-auto" onClick={() => { setInput(empty); setProblem(null); setResult(null); }}><RotateCcw />Reset</Button></div>
    </form>
    <div ref={results} className="scroll-mt-28 pt-8">{loading && <div role="status" className="flex items-center gap-3 border-y py-6"><Loader2 className="size-5 shrink-0 animate-spin text-primary" /><p>Connecting the dots, one step at a time…</p></div>}{!loading && result && <CompetitiveResults analysis={result.analysis} learnFirst={result.learnFirst} review={review} />}</div>
  </div></section>;
}