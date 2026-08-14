import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const audiences = [
  {
    who: "Students",
    body: "Tight budgets, allowance gaps and part-time shifts that never quite line up with the due dates.",
  },
  {
    who: "Gig & informal workers",
    body: "Income that arrives whenever it arrives. Kupa works with unpredictability instead of against it.",
  },
  {
    who: "Anyone spiralling at 2am",
    body: "You don't need a budgeting app. You need one small step and a reason to come back tomorrow.",
  },
];

export function WhyKupa() {
  return (
    <section id="why" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-xl text-4xl sm:text-5xl"
        >
          Made for the people wellness apps <span className="text-gradient">forget</span>
        </motion.h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {audiences.map((a, i) => (
            <motion.div
              key={a.who}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -6 }}
              data-cursor="grow"
              className="rounded-3xl border border-blush/50 bg-gradient-soft p-7 shadow-soft"
            >
              <h3 className="text-xl text-plum">{a.who}</h3>
              <p className="mt-3 text-sm leading-relaxed text-plum/70">{a.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative mt-20 overflow-hidden rounded-4xl bg-hero-aura px-6 py-16 text-center shadow-soft sm:px-12"
        >
          <div className="pointer-events-none absolute -left-10 top-6 size-40 rounded-full bg-butter/50 blur-3xl animate-drift" />
          <div className="pointer-events-none absolute -right-6 bottom-0 size-48 rounded-full bg-lilac/40 blur-3xl animate-drift [animation-delay:-8s]" />
          <h3 className="relative mx-auto max-w-xl text-3xl sm:text-4xl">
            Tomorrow&apos;s money stress starts with tonight&apos;s check-in
          </h3>
          <p className="relative mx-auto mt-4 max-w-md text-sm text-muted-foreground">
            Sixty seconds. One nudge. A streak worth keeping.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="hero" size="lg" data-cursor="grow">
              Start your streak
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="sunny" size="lg" data-cursor="grow">
              Read the board
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
