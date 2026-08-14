import { motion } from "motion/react";
import { ArrowRight, Flame, HeartHandshake, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroArt from "@/assets/kupa-hero.png";

const words = ["Money", "stress,", "made", "gentle."];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-hero-aura pb-24 pt-36 sm:pt-44">
      <div className="pointer-events-none absolute -left-24 top-24 size-72 rounded-full bg-lilac/40 blur-3xl animate-drift" />
      <div className="pointer-events-none absolute -right-16 top-56 size-80 rounded-full bg-butter/40 blur-3xl animate-drift [animation-delay:-6s]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-blush/60 bg-card/70 px-4 py-1.5 text-xs font-semibold text-plum backdrop-blur"
          >
            <Sparkles className="size-3.5 text-primary" />
            AI financial wellness companion
          </motion.div>

          <h1 className="mt-6 text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
            {words.map((w, i) => (
              <motion.span
                key={w + i}
                initial={{ opacity: 0, y: 28, rotate: -3 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ delay: 0.1 + i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`mr-3 inline-block ${i === 3 ? "text-gradient" : ""}`}
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Kupa turns a 60-second daily check-in into one small, personalised nudge — so financial
            anxiety stops living rent-free in your head. Built for students, gig workers and anyone
            with irregular income.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button variant="hero" size="lg" data-cursor="grow">
              Do your first check-in
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="soft" size="lg" data-cursor="grow">
              See how it works
            </Button>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-10 flex flex-wrap gap-6"
          >
            {[
              { icon: Flame, k: "60s", v: "daily check-in" },
              { icon: Sparkles, k: "1 nudge", v: "grounded in your words" },
              { icon: HeartHandshake, k: "Anonymous", v: "encouragement board" },
            ].map(({ icon: Icon, k, v }) => (
              <div key={k} className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-2xl bg-card shadow-soft">
                  <Icon className="size-4 text-primary" />
                </span>
                <div>
                  <dt className="font-display text-lg leading-none text-plum">{k}</dt>
                  <dd className="text-xs text-muted-foreground">{v}</dd>
                </div>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="absolute inset-8 rounded-full bg-blush/45 blur-3xl" />
          <img
            src={heroArt}
            alt="Kupa app showing a gentle chat check-in about money"
            width={1024}
            height={1024}
            className="relative animate-float drop-shadow-2xl"
          />

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-card absolute -left-2 bottom-10 max-w-[15rem] rounded-3xl p-4 sm:-left-8"
          >
            <p className="text-xs font-semibold text-plum">Today&apos;s nudge</p>
            <p className="mt-1 text-sm leading-snug text-muted-foreground">
              &ldquo;Rent came up 3 days running. Move N$50 aside today — small, but it quiets the
              loop.&rdquo;
            </p>
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="glass-card absolute -right-1 top-8 flex items-center gap-2 rounded-2xl px-3 py-2 sm:-right-6"
          >
            <Flame className="size-4 text-primary" />
            <span className="text-sm font-semibold text-plum">7-day streak</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
