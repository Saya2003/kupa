import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { TrendingUp, Smile, CalendarCheck } from "lucide-react";
import { PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/app/mood")({
  head: () => ({
    meta: [
      { title: "Mood & money trends — Kupa" },
      {
        name: "description",
        content: "See how your money mood shifts over weeks and which days feel heaviest.",
      },
      { property: "og:title", content: "Mood & money trends — Kupa" },
      { property: "og:description", content: "How your money mood shifts over the weeks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Mood,
});

const month = [3, 2, 4, 3, 5, 4, 3, 2, 3, 4, 4, 5, 3, 4, 2, 3, 4, 5, 5, 4, 3, 4, 5, 4, 3, 4, 5, 5];
const emojis = ["😰", "😕", "😐", "🙂", "🤩"];

function Mood() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader title="Mood trends" subtitle="Awareness first — the numbers come after." />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Average mood", value: "Steady 🙂", icon: Smile },
          { label: "Trend vs last month", value: "+18%", icon: TrendingUp },
          { label: "Check-ins logged", value: "28 / 30", icon: CalendarCheck },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -6 }}
            className="glass-card rounded-[1.5rem] p-5"
          >
            <span className="grid size-10 place-items-center rounded-2xl bg-lilac/50">
              <s.icon className="size-5 text-plum" />
            </span>
            <p className="mt-4 font-display text-2xl tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card rounded-[1.75rem] p-6"
      >
        <h2 className="font-display text-xl tracking-tight">Last 4 weeks</h2>
        <div className="mt-6 flex h-48 items-end gap-1.5">
          {month.map((m, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${m * 20}%` }}
              transition={{ delay: 0.2 + i * 0.02, type: "spring", stiffness: 130, damping: 15 }}
              whileHover={{ scaleY: 1.06 }}
              title={`Mood ${m}/5`}
              className="flex-1 rounded-t-xl bg-gradient-primary origin-bottom"
            />
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card rounded-[1.75rem] p-6"
      >
        <h2 className="font-display text-xl tracking-tight">Recent check-ins</h2>
        <ul className="mt-4 divide-y divide-border/60">
          {[
            { day: "Today", mood: 4, note: "Payday soon, feeling calmer." },
            { day: "Yesterday", mood: 2, note: "Rent stress." },
            { day: "Wednesday", mood: 4, note: "Cooked at home twice." },
            { day: "Tuesday", mood: 3, note: "Data ran out early." },
          ].map((r) => (
            <li key={r.day} className="flex items-center gap-4 py-3">
              <span className="text-xl">{emojis[r.mood - 1]}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{r.day}</p>
                <p className="truncate text-xs text-muted-foreground">{r.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </motion.section>
    </div>
  );
}
