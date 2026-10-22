import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { EditorView, Decoration } from "@codemirror/view";
import { StateField, type Extension } from "@codemirror/state";
import { useMemo } from "react";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

const palette = HighlightStyle.define([
  { tag: [t.keyword, t.controlKeyword, t.definitionKeyword, t.operatorKeyword], color: "oklch(0.78 0.09 240)", fontWeight: "600" },
  { tag: [t.string, t.special(t.string)], color: "oklch(0.88 0.09 92)" },
  { tag: [t.number, t.bool, t.null], color: "oklch(0.8 0.08 30)" },
  { tag: [t.comment], color: "oklch(0.65 0.02 250)", fontStyle: "italic" },
  { tag: [t.function(t.variableName), t.function(t.definition(t.variableName))], color: "oklch(0.84 0.07 180)" },
  { tag: [t.className, t.definition(t.className)], color: "oklch(0.86 0.08 92)" },
  { tag: [t.operator, t.punctuation], color: "oklch(0.8 0.02 250)" },
]);

const theme = EditorView.theme(
  {
    "&": { backgroundColor: "var(--code)", color: "var(--code-foreground)" },
    ".cm-content": { caretColor: "var(--butter)", padding: "14px 0" },
    ".cm-gutters": { backgroundColor: "var(--code)", color: "color-mix(in oklab, var(--code-foreground) 40%, transparent)", border: "none" },
    ".cm-activeLine, .cm-activeLineGutter": { backgroundColor: "color-mix(in oklab, var(--code-foreground) 6%, transparent)" },
    ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": { backgroundColor: "color-mix(in oklab, var(--primary) 45%, transparent) !important" },
    ".cm-cursor": { borderLeftColor: "var(--butter)" },
    ".cpanic-line": { backgroundColor: "color-mix(in oklab, var(--butter) 22%, transparent)" },
  },
  { dark: true },
);

function lineHighlight(line: number | null | undefined): Extension {
  return StateField.define({
    create(state) {
      if (!line || line < 1 || line > state.doc.lines) return Decoration.none;
      const l = state.doc.line(line);
      return Decoration.set([Decoration.line({ class: "cpanic-line" }).range(l.from)]);
    },
    update(v) { return v; },
    provide: (f) => EditorView.decorations.from(f),
  });
}

export default function CodeEditorInner({ value, onChange, readOnly, minHeight = "220px", ariaLabel, highlightLine }: {
  value: string; onChange?: (v: string) => void; readOnly?: boolean; minHeight?: string; ariaLabel: string; highlightLine?: number | null;
}) {
  const extensions = useMemo(
    () => [python(), theme, syntaxHighlighting(palette), EditorView.lineWrapping, EditorView.contentAttributes.of({ "aria-label": ariaLabel }), lineHighlight(highlightLine)],
    [ariaLabel, highlightLine],
  );
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      editable={!readOnly}
      minHeight={minHeight}
      extensions={extensions}
      theme="none"
      basicSetup={{ foldGutter: false, syntaxHighlighting: false, highlightActiveLine: !readOnly, highlightActiveLineGutter: !readOnly }}
      placeholder={readOnly ? undefined : "# Paste your Python code here…"}
    />
  );
}
