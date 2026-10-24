import { useLanguage } from "./LanguageProvider";
import { useState } from "react";
import { Bug, BookOpen, SearchCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Workspace } from "./Workspace";
import { CompetitiveWorkspace } from "./CompetitiveWorkspace";

export function LearningWorkspace() {
  const { t, language } = useLanguage();
  const [mode, setMode] = useState<"debug" | "solver" | "review">("debug");
  return <div id="workspace" className="scroll-mt-28">
    <div className="px-4 pt-10"><div className="mx-auto max-w-6xl"><div role="tablist" aria-label={t("Learning mode")} className="grid grid-cols-3 gap-1 rounded-xl border bg-muted p-1 sm:w-fit">
      {([{ id: "debug", label: t("Debug Mode"), icon: Bug }, { id: "solver", label: t("Problem Solver"), icon: BookOpen }, { id: "review", label: t("Code Review"), icon: SearchCheck }] as const).map(({ id, label, icon: Icon }) => <Button key={id} id={`tab-${id}`} role="tab" aria-selected={mode === id} aria-controls={`panel-${id}`} variant={mode === id ? "default" : "ghost"} className="h-auto min-h-12 flex-col whitespace-normal rounded-lg px-2 py-2 text-xs sm:min-h-10 sm:flex-row sm:px-5 sm:text-sm" onClick={() => setMode(id)}><Icon />{t(label)}</Button>)}
    </div></div></div>
    <div id="panel-debug" role="tabpanel" aria-labelledby="tab-debug" hidden={mode !== "debug"}><Workspace /></div>
    <div id="panel-solver" role="tabpanel" aria-labelledby="tab-solver" hidden={mode !== "solver"}><CompetitiveWorkspace mode="solver" /></div>
    <div id="panel-review" role="tabpanel" aria-labelledby="tab-review" hidden={mode !== "review"}><CompetitiveWorkspace mode="review" /></div>
  </div>;
}
