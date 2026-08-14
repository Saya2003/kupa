import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome to Kupa — quick setup" },
      {
        name: "description",
        content: "Tell Kupa who you are and what you're saving for, then start your first check-in.",
      },
      { property: "og:title", content: "Welcome to Kupa" },
      { property: "og:description", content: "A 30-second setup, then your first check-in." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Onboarding,
});

const steps = [
  {
    q: "Which sounds most like you?",
    options: ["Student", "Gig worker", "Both", "Just starting out"],
  },
  {
    q: "What's your biggest money stress?",
    options: ["Rent", "Data & transport", "Food", "Unpredictable income"],
  },
  {
    q: "When should Kupa nudge you?",
    options: ["Morning", "Lunchtime", "Evening", "Whenever"],
  },
];

function Onboarding() {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<Record<number, string>>({});
  const current = steps[step];
  const done = step >= steps.length || !current;

  return (
    <div className="pb-10">
      <PageHeader title="Welcome to Kupa" subtitle="Three taps and we're ready." />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card mx-auto max-w-2xl rounded-[2rem] p-6 sm:p-8"
      >
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              className="space-y-6"
            >
              <p className="text-xs font-semibold text-plum">
                Step {step + 1} of {steps.length}
              </p>
              <h2 className="font-display text-2xl tracking-tight">{current!.q}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {current!.options.map((o) => (
                  <motion.button
                    key={o}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setPicked((p) => ({ ...p, [step]: o }));
                      setStep((s) => s + 1);
                    }}
                    className={`rounded-2xl px-4 py-4 text-sm font-medium transition-colors ${
                      picked[step] === o
                        ? "bg-gradient-soft text-plum shadow-soft"
                        : "bg-secondary/60 text-foreground/80 hover:bg-secondary"
                    }`}
                  >
                    {o}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center"
            >
              <span className="mx-auto grid size-14 place-items-center rounded-3xl bg-gradient-primary shadow-glow animate-kupa-float">
                <Sparkles className="size-6 text-primary-foreground" />
              </span>
              <h2 className="font-display text-2xl tracking-tight">You're all set</h2>
              <p className="text-sm text-muted-foreground">
                Your first 60-second check-in is waiting.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="hero" asChild>
                  <Link to="/app/checkin">
                    Start check-in <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button variant="soft" asChild>
                  <Link to="/app">Go to dashboard</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
