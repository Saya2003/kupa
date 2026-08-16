import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Sparkles, CalendarCheck, Flame, Smile, ArrowRight, Wallet, Target } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Your Kupa dashboard — streaks, nudges & mood" },
      {
        name: "description",
        content:
          "See today's nudge, your check-in streak, mood trend and savings goals in one calm Kupa dashboard.",
      },
      { property: "og:title", content: "Your Kupa dashboard" },
      {
        property: "og:description",
        content: "Today's nudge, your streak and mood trend in one calm place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Check-in streak", value: "12 days", icon: Flame, tone: "bg-blush/50" },
  { label: "Mood this week", value: "Steadier", icon: Smile, tone: "bg-mint/50" },
  { label: "Saved this month", value: "N$ 420", icon: Wallet, tone: "bg-butter/60" },
  { label: "Goal progress", value: "62%", icon: Target, tone: "bg-lilac/50" },
];

const week = [
  { day: "Mon", mood: 3 },
  { day: "Tue", mood: 2 },
  { day: "Wed", mood: 4 },
  { day: "Thu", mood: 4 },
  { day: "Fri", mood: 5 },
  { day: "Sat", mood: 3 },
  { day: "Sun", mood: 4 },
];

function Dashboard() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader title="Today with Kupa" subtitle="One minute, one nudge, one small win." />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card relative overflow-hidden rounded-[2rem] p-6 sm:p-8"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 size-44 rounded-full bg-gradient-primary opacity-25 blur-2xl animate-kupa-float"
        />
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary/70 px-3 py-1 text-xs font-semibold text-plum">
          <Sparkles className="size-3" /> Today's nudge
        </span>
        <p className="mt-4 max-w-2xl font-display text-2xl leading-snug tracking-tight sm:text-3xl">
          "You spent less on takeaways this week — move N$ 50 of that into your data fund before
          Friday."
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="hero" asChild>
            <Link to="/app/checkin">
              Start 60-second check-in <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="soft" asChild>
            <Link to="/app/nudges">See all nudges</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/app/chat">
              <Sparkles className="size-4" /> Talk to Kupa
            </Link>
          </Button>
        </div>
      </motion.section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * i, duration: 0.45 }}
            whileHover={{ y: -6 }}
            className="glass-card rounded-[1.5rem] p-5"
          >
            <span className={`grid size-10 place-items-center rounded-2xl ${s.tone}`}>
              <s.icon className="size-5 text-plum" />
            </span>
            <p className="mt-4 font-display text-2xl tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-[1.75rem] p-6 lg:col-span-2"
        >
          <h2 className="font-display text-xl tracking-tight">This week's mood</h2>
          <p className="text-xs text-muted-foreground">How money felt, day by day.</p>
          <div className="mt-6 flex h-40 items-end gap-3">
            {week.map((d, i) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${d.mood * 20}%` }}
                  transition={{ delay: 0.25 + i * 0.06, type: "spring", stiffness: 120, damping: 14 }}
                  className="w-full rounded-t-2xl bg-gradient-primary"
                />
                <span className="text-xs text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
          className="glass-card rounded-[1.75rem] p-6"
        >
          <h2 className="font-display text-xl tracking-tight">Your habits</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              { label: "Check-ins completed", value: "34" },
              { label: "Nudges acted on", value: "21" },
              { label: "Notes of encouragement sent", value: "8" },
            ].map((r) => (
              <li key={r.label} className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">{r.label}</span>
                <span className="font-semibold text-plum">{r.value}</span>
              </li>
            ))}
          </ul>
          <Button variant="soft" className="mt-6 w-full" asChild>
            <Link to="/app/mood">
              <CalendarCheck className="size-4" /> View full history
            </Link>
          </Button>
        </motion.section>
      </div>
    </div>
  );
}
