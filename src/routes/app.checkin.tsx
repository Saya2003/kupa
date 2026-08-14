import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, Sparkles, Check } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/app/checkin")({
  head: () => ({
    meta: [
      { title: "60-second daily check-in — Kupa" },
      {
        name: "description",
        content:
          "Log how money feels today, what you spent and one worry — Kupa turns it into a single kind nudge.",
      },
      { property: "og:title", content: "60-second daily check-in — Kupa" },
      {
        property: "og:description",
        content: "Three quick questions. One kind nudge back.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckIn,
});

const moods = [
  { emoji: "😰", label: "Anxious" },
  { emoji: "😕", label: "Tight" },
  { emoji: "😐", label: "Okay" },
  { emoji: "🙂", label: "Steady" },
  { emoji: "🤩", label: "Hopeful" },
];

function CheckIn() {
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState<string | null>(null);
  const total = 3;

  return (
    <div className="pb-10">
      <PageHeader title="Daily check-in" subtitle="Three questions. Sixty seconds. Zero judgement." />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card mx-auto max-w-2xl rounded-[2rem] p-6 sm:p-8"
      >
        <div className="mb-7 h-2 w-full overflow-hidden rounded-full bg-secondary/70">
          <motion.div
            className="h-full rounded-full bg-gradient-primary"
            animate={{ width: `${((Math.min(step, total) + (step >= total ? 0 : 1)) / total) * 100}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-6"
            >
              <h2 className="font-display text-2xl tracking-tight">How does money feel today?</h2>
              <div className="flex flex-wrap gap-3">
                {moods.map((m) => (
                  <motion.button
                    key={m.label}
                    type="button"
                    whileHover={{ y: -6, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMood(m.label)}
                    className={`flex w-24 flex-col items-center gap-1 rounded-3xl px-3 py-4 text-xs font-medium transition-colors ${
                      mood === m.label
                        ? "bg-gradient-soft text-plum shadow-soft"
                        : "bg-secondary/60 text-foreground/70"
                    }`}
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    {m.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-5"
            >
              <h2 className="font-display text-2xl tracking-tight">What did you spend today?</h2>
              <div className="space-y-2">
                <Label htmlFor="spend">Rough amount</Label>
                <Input id="spend" inputMode="decimal" placeholder="N$ 120" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="on">Mostly on</Label>
                <Input id="on" placeholder="Data, taxi, lunch…" />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-5"
            >
              <h2 className="font-display text-2xl tracking-tight">One money worry on your mind?</h2>
              <Textarea rows={5} placeholder="Rent is due before my next gig pays…" />
            </motion.div>
          )}

          {step >= total && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-5 text-center"
            >
              <span className="mx-auto grid size-14 place-items-center rounded-3xl bg-gradient-primary shadow-glow animate-kupa-float">
                <Check className="size-7 text-primary-foreground" />
              </span>
              <h2 className="font-display text-2xl tracking-tight">Check-in complete — 13-day streak!</h2>
              <div className="rounded-3xl bg-gradient-soft p-5 text-left">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-plum">
                  <Sparkles className="size-3" /> Your nudge
                </span>
                <p className="mt-2 font-display text-xl leading-snug">
                  "Rent feels heavy — set aside N$ 80 today and it'll feel lighter by Thursday."
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="hero" asChild>
                  <Link to="/app">Back to dashboard</Link>
                </Button>
                <Button variant="soft" onClick={() => setStep(0)}>
                  Redo check-in
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {step < total && (
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <ArrowLeft className="size-4" /> Back
            </Button>
            <Button variant="hero" onClick={() => setStep((s) => s + 1)}>
              {step === total - 1 ? "Get my nudge" : "Next"} <ArrowRight className="size-4" />
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
