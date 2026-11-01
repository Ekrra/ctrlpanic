import { Cloud, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "./LanguageProvider";

export function AnalysisSource({ offline, onChange, loading }: { offline: boolean; onChange: (offline: boolean) => void; loading: boolean }) {
  const { t } = useLanguage();
  return <div role="group" aria-label={t("Analysis source")} className="mb-5 flex flex-wrap gap-2">
    <Button type="button" variant={offline ? "outline" : "default"} disabled={loading} aria-pressed={!offline} onClick={() => onChange(false)}><Cloud />{t("Online AI")}</Button>
    <Button type="button" variant={offline ? "default" : "outline"} disabled={loading} aria-pressed={offline} onClick={() => onChange(true)}><FileText />{t("Offline demo sample")}</Button>
  </div>;
}