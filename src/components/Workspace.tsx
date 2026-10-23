import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, RotateCcw, Wand2, AlertTriangle } from "lucide-react";
import { analyzeCode } from "@/lib/debug.functions";
import type { Analysis } from "@/lib/debug.schema";
import { EXAMPLES } from "@/lib/examples";
import { CodeEditor } from "./CodeEditor";
import { Mascot, type Mood } from "./Mascot";
import { ResultsPanel } from "./ResultsPanel";

const LOADING_LINES = ["Reading your code, no judgment…", "Asking Python what it meant…", "Untangling the spaghetti…"];

export function Workspace() {
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [exampleId, setExampleId] = useState<string | null>(null);
  const run = useServerFn(analyzeCode);
  const resultsRef = useRef<HTMLDivElement>(null);

  const mood: Mood = loading ? "confused" : analysis ? (analysis.hasError ? "happy" : "happy") : problem ? "confused" : "panic";

  const loadExample = (id: string) => {
    const ex = EXAMPLES.find((e) => e.id === id);
    if (!ex) return;
    setCode(ex.code); setErrorMsg(ex.error); setExampleId(id); setProblem(null); setAnalysis(null);
  };

  const reset = () => { setCode(""); setErrorMsg(""); setProblem(null); setAnalysis(null); setExampleId(null); };

  const submit = async () => {
    if (!code.trim()) { setProblem("Oops, the editor is empty. Paste some Python code first."); return; }
    setLoading(true); setProblem(null); setAnalysis(null);
    try {
      const res = await run({ data: { code, errorMessage: errorMsg } });
      if (res.ok) {
        setAnalysis(res.analysis);
        requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
      } else setProblem(res.error);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      setProblem(msg.includes("12,000") ? "That's a lot of code! Keep it under 12,000 characters." : "Couldn't reach the server. Check your connection and try again.");
    } finally { setLoading(false); }
  };

  return (
    <section className="scroll-mt-24 px-4 py-8 sm:pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">The workspace</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Paste it. Breathe. Learn.</h2>
          </div>
          <Mascot mood={mood} className={`size-20 sm:size-28 ${loading ? "animate-wiggle" : ""}`} />
        </div>

        <div className="card-soft overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-b bg-muted/60 px-4 py-3">
            <span className="mr-1 text-sm font-medium text-muted-foreground">Try an example:</span>
            {EXAMPLES.map((ex) => (
              <button key={ex.id} type="button" onClick={() => loadExample(ex.id)} aria-pressed={exampleId === ex.id}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${exampleId === ex.id ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-accent"}`}>
                {ex.label}
              </button>
            ))}
          </div>
          {exampleId && <p className="border-b bg-butter/30 px-4 py-2 text-xs text-butter-foreground">Example code loaded. The explanation you get will still be a real AI analysis.</p>}

          <div className="grid lg:grid-cols-5">
            <div className="lg:col-span-3 lg:border-r">
              <label className="block px-4 pt-3 pb-2 text-sm font-semibold">Your Python code</label>
              <div className="bg-code">
                <CodeEditor value={code} onChange={(v) => { setCode(v); if (problem) setProblem(null); }} minHeight="280px" ariaLabel="Python code editor" highlightLine={analysis?.lineNumber ?? null} />
              </div>
            </div>
            <div className="flex flex-col gap-4 p-4 lg:col-span-2">
              <div className="flex flex-1 flex-col">
                <label htmlFor="err" className="mb-2 text-sm font-semibold">Error message <span className="font-normal text-muted-foreground">(optional)</span></label>
                <textarea id="err" value={errorMsg} onChange={(e) => setErrorMsg(e.target.value)} placeholder="Paste the traceback here if you have one…"
                  className="min-h-36 flex-1 resize-y rounded-xl border bg-background p-3 font-mono text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30" />
              </div>
              {problem && (
                <div role="alert" className="flex gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />{problem}
                </div>
              )}
              <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
                <button type="button" onClick={submit} disabled={loading} className="btn btn-primary flex-1">
                  {loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
                  {loading ? "Analyzing…" : "Analyze my code"}
                </button>
                <button type="button" onClick={reset} disabled={loading} className="btn btn-ghost"><RotateCcw className="size-4" />Reset</button>
              </div>
            </div>
          </div>
        </div>

        <div ref={resultsRef} className="scroll-mt-24 pt-8">
          {loading && (
            <div className="card-soft flex items-center gap-4 p-6" role="status">
              <Loader2 className="size-5 animate-spin text-primary" />
              <p className="text-muted-foreground">{LOADING_LINES[code.length % LOADING_LINES.length]}</p>
            </div>
          )}
          {!loading && analysis && <ResultsPanel analysis={analysis} />}
          {!loading && !analysis && !problem && (
            <p className="text-center text-sm text-muted-foreground">Results show up here. Python found something suspicious? We'll explain it gently.</p>
          )}
        </div>
      </div>
    </section>
  );
}
