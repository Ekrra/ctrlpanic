<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- AI debugging runs only server-side: `src/lib/debug.functions.ts` (server fn) → `src/lib/debug.server.ts` (Lovable AI Gateway, structured output validated by the zod schema in `src/lib/debug.schema.ts`). Why: keeps the key secret and gives the UI one typed result shape.
- Example snippets in `src/lib/examples.ts` are inputs only; never ship canned AI responses. Why: users must never see fake analysis.
- CodeMirror loads client-only via `CodeEditor` lazy wrapper. Why: avoids SSR import issues.
