import { createFileRoute } from "@tanstack/react-router";
import { Navbar, Hero, Features, HowItWorks, Scenarios, Footer } from "@/components/Sections";
import { LearningWorkspace } from "@/components/LearningWorkspace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CtrlPanic — AI Python debugging tutor for beginners" },
      { name: "description", content: "Paste your Python code and error. CtrlPanic explains what broke, why, and how to fix it — step by step, without the stress." },
      { property: "og:title", content: "CtrlPanic — Ctrl your panic. Fix your code." },
      { property: "og:description", content: "An AI Python debugging tutor that explains errors in plain English for beginners and competitive programmers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <a href="#workspace" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-card focus:px-3 focus:py-2">Skip to workspace</a>
      <Navbar />
      <main>
        <Hero />
        <LearningWorkspace />
        <HowItWorks />
        <Features />
        <Scenarios />
      </main>
      <Footer />
    </div>
  );
}
