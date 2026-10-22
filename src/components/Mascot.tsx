import panic from "@/assets/mascot-panic.png";
import confused from "@/assets/mascot-confused.png";
import happy from "@/assets/mascot-happy.png";

export type Mood = "panic" | "confused" | "happy";
const SRC: Record<Mood, string> = { panic, confused, happy };
const ALT: Record<Mood, string> = {
  panic: "CtrlPanic mascot, a tiny computer looking slightly panicked",
  confused: "CtrlPanic mascot looking confused",
  happy: "CtrlPanic mascot giving a happy thumbs up",
};

export function Mascot({ mood = "panic", className = "", eager = false }: { mood?: Mood; className?: string; eager?: boolean }) {
  return (
    <img
      key={mood}
      src={SRC[mood]}
      alt={ALT[mood]}
      width={1024}
      height={1024}
      loading={eager ? "eager" : "lazy"}
      className={`select-none animate-in fade-in zoom-in-95 duration-300 ${className}`}
      draggable={false}
    />
  );
}
