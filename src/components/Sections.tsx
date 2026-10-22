import { MessageCircleHeart, Footprints, GraduationCap, Leaf, ClipboardPaste, Brain, CheckCircle2 } from "lucide-react";
import { Mascot } from "./Mascot";

export function Navbar() {
  return (
    <header className="glass sticky top-0 z-40 border-x-0 border-t-0">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2.5" aria-label="Main">
        <a href="#top" className="flex items-center gap-2 font-display text-lg font-bold">
          <Mascot mood="panic" eager className="size-9" />
          CtrlPanic
        </a>
        <div className="flex items-center gap-1 text-sm sm:gap-2">
          <a href="#how" className="hidden rounded-full px-3 py-2 hover:bg-muted sm:inline">How It Works</a>
          <a href="#features" className="hidden rounded-full px-3 py-2 hover:bg-muted sm:inline">Features</a>
          <a href="#workspace" className="btn btn-primary px-4 py-2 text-sm">Get Started</a>
        </div>
      </nav>
      <div className="flex justify-center gap-4 pb-2 text-sm sm:hidden">
        <a href="#how" className="text-muted-foreground hover:text-foreground">How It Works</a>
        <a href="#features" className="text-muted-foreground hover:text-foreground">Features</a>
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section id="top" className="bg-hero relative overflow-hidden px-4 pt-14 pb-10 sm:pt-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.2fr_1fr]">
        <div className="animate-rise">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-success" /> AI Python tutor for beginners & CP students
          </span>
          <h1 className="text-5xl font-extrabold leading-[1.02] sm:text-7xl">Code not working?</h1>
          <p className="mt-4 font-display text-2xl font-semibold text-primary sm:text-3xl">Ctrl your panic. Fix your code.</p>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Paste your Python and its error. CtrlPanic explains what broke, why it broke and how to fix it, in plain English, without the stress.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#workspace" className="btn btn-primary px-6 py-3 text-base">Explain My Error</a>
            <a href="#how" className="btn btn-ghost px-6 py-3 text-base">See how it works</a>
          </div>
        </div>
        <div className="relative mx-auto w-64 sm:w-80">
          <div className="absolute inset-6 rounded-full bg-secondary blur-2xl" aria-hidden />
          <Mascot mood="panic" eager className="animate-float relative" />
          <div className="glass absolute -bottom-2 -left-6 rounded-2xl px-4 py-2 font-mono text-xs shadow-soft sm:-left-10">SyntaxError: expected ':'</div>
          <div className="absolute -top-2 -right-4 rounded-2xl bg-butter px-3 py-2 text-xs font-semibold text-butter-foreground shadow-soft">Bestie, breathe.</div>
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  { icon: MessageCircleHeart, title: "Simple explanations", body: "No jargon soup. Errors translated into words that actually make sense." },
  { icon: Footprints, title: "Step-by-step fixes", body: "Every correction comes with the reasoning, so you could fix it yourself next time." },
  { icon: GraduationCap, title: "Beginner-friendly learning", body: "A tiny practice question after each fix turns a bug into a lesson." },
  { icon: Leaf, title: "Less stressful debugging", body: "Calm colors, kind words, zero shame. Every programmer breaks things daily." },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 bg-muted/50 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">Features</p>
        <h2 className="mb-10 max-w-xl text-3xl font-bold sm:text-4xl">A tutor, not a copy-paste machine.</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="card-soft p-6 transition-transform duration-300 hover:-translate-y-1">
              <span className="mb-4 grid size-11 place-items-center rounded-xl bg-secondary text-secondary-foreground"><Icon className="size-5" /></span>
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { icon: ClipboardPaste, title: "Paste your code", body: "Drop in your Python and, if you have it, the error message." },
  { icon: Brain, title: "AI reads it carefully", body: "It finds the problem line and figures out the concept behind it." },
  { icon: CheckCircle2, title: "Understand & fix", body: "Get a plain explanation, corrected code, steps and a practice question." },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">How it works</p>
        <h2 className="mb-10 text-3xl font-bold sm:text-4xl">Three steps from panic to peace.</h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="card-soft relative p-6">
              <span className="absolute top-5 right-5 font-display text-5xl font-extrabold text-secondary">{i + 1}</span>
              <Icon className="mb-4 size-7 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const SCENARIOS = [
  { who: "First-week student", quote: "My for loop just... refuses to loop.", tag: "IndentationError", fix: "Learns that Python uses indentation to know what belongs inside the loop." },
  { who: "Codeforces grinder", quote: "Input works locally, crashes on the judge.", tag: "ValueError", fix: "Learns to read space-separated input with map(int, input().split())." },
  { who: "Lab assignment, 11:58 PM", quote: "Why can't I add my age to a sentence?!", tag: "TypeError", fix: "Learns about str vs int and how f-strings make it painless." },
];

export function Scenarios() {
  return (
    <section className="bg-muted/50 px-4 py-16 sm:py-24" aria-labelledby="scen">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">Real situations</p>
        <h2 id="scen" className="mb-10 text-3xl font-bold sm:text-4xl">Sound familiar?</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {SCENARIOS.map((s) => (
            <figure key={s.who} className="card-soft flex flex-col p-6">
              <span className="mb-4 w-fit rounded-full bg-butter px-3 py-1 font-mono text-xs text-butter-foreground">{s.tag}</span>
              <blockquote className="mb-4 font-display text-xl font-semibold">“{s.quote}”</blockquote>
              <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{s.fix}</p>
              <figcaption className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.who}</figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">Illustrative scenarios, not testimonials.</p>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <Mascot mood="happy" className="size-10" />
          <div>
            <p className="font-display font-bold">CtrlPanic</p>
            <p className="text-xs text-muted-foreground">Built for YUNet AIgnite 2026 · Ctrl your panic.</p>
          </div>
        </div>
        <nav className="flex gap-5 text-sm text-muted-foreground" aria-label="Footer">
          <a href="#how" className="hover:text-foreground">How It Works</a>
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#workspace" className="hover:text-foreground">Get Started</a>
          <a href="#top" className="hover:text-foreground">Back to top</a>
        </nav>
      </div>
      <p className="mx-auto mt-6 max-w-6xl text-center text-xs text-muted-foreground sm:text-left">AI explanations can be wrong sometimes. Always run and test your code.</p>
    </footer>
  );
}
