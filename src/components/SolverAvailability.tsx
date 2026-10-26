import { CheckCircle2, Info, Loader2, AlertTriangle } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export function SolverAvailability({ status, loading, succeeded }: { status?: number; loading: boolean; succeeded: boolean }) {
  const { t } = useLanguage();
  const title = loading ? "AI availability · Checking with your request"
    : status === 402 ? "AI paused · Credits unavailable"
    : status === 401 || status === 400 ? "AI unavailable · Setup needs attention"
    : status === 403 ? "AI unavailable · Access blocked"
    : status !== undefined ? "AI temporarily unavailable"
    : succeeded ? "AI available · Last request succeeded"
    : "AI availability · Not checked yet";
  const detail = status === 402
    ? "Analysis needs available AI credits. The workspace owner can open Lovable → Settings → Plans & credits to review the balance and restore credits, or wait for the next AI allowance. If credits are temporarily held, follow the message below."
    : status === 401 || status === 400
    ? "The site owner needs to finish the secure AI setup in Lovable: configure a valid server-side AI key and check the request configuration. Students do not need to supply a key."
    : status === 403
    ? "The workspace owner needs to review the access message below and restore the required AI permissions or usage limit. Adding credits alone may not resolve an access block."
    : status !== undefined
    ? "Follow the message below. Retry only after any waiting period or service issue is resolved."
    : succeeded
    ? "The last analysis completed successfully. Availability can change with credits and service access."
    : "Analysis requires available AI credits and secure AI setup by the site owner. Availability is confirmed when you submit a problem; no background AI requests are made.";
  const Icon = loading ? Loader2 : status !== undefined ? AlertTriangle : succeeded ? CheckCircle2 : Info;
  return <aside role="status" aria-live="polite" className="mb-5 flex gap-3 border-y border-border bg-muted/30 py-4 text-sm">
    <Icon aria-hidden="true" className={`mt-0.5 size-5 shrink-0 text-primary ${loading ? "animate-spin" : ""}`} />
    <div className="min-w-0"><p className="font-semibold">{t(title)}</p><p className="mt-1 text-muted-foreground">{t(detail)}</p>{status !== undefined && <p className="mt-2 text-muted-foreground">{t("Your inputs stay here. After the owner restores service, submit a fresh request; nothing retries automatically.")}</p>}</div>
  </aside>;
}