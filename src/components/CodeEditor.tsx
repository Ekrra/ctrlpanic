import { lazy, Suspense, useEffect, useState } from "react";

const Inner = lazy(() => import("./CodeEditorInner"));

type Props = { value: string; onChange?: (v: string) => void; readOnly?: boolean; minHeight?: string; ariaLabel: string; highlightLine?: number | null };

/** CodeMirror loads only in the browser; SSR shows a plain fallback of the same size. */
export function CodeEditor(props: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const fallback = (
    <pre className="m-0 whitespace-pre-wrap p-4 font-mono text-sm text-code-foreground/80" style={{ minHeight: props.minHeight }}>
      {props.value || " "}
    </pre>
  );
  if (!mounted) return fallback;
  return (
    <Suspense fallback={fallback}>
      <Inner {...props} />
    </Suspense>
  );
}
