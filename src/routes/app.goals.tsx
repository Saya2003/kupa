import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Plus, Target } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/goals")({
  head: () => ({
    meta: [
      { title: "Savings goals — Kupa" },
      {
        name: "description",
        content: "Track tiny savings goals — data bundles, rent buffer, textbooks — at your own pace.",
      },
      { property: "og:title", content: "Savings goals — Kupa" },
      { property: "og:description", content: "Tiny goals, tracked gently, at your own pace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Goals,
});

const goals = [
  { name: "Rent buffer", saved: 620, target: 1000, tone: "bg-blush/60" },
  { name: "Data fund", saved: 180, target: 250, tone: "bg-lilac/60" },
  { name: "Textbooks", saved: 90, target: 400, tone: "bg-butter/70" },
  { name: "Emergency N$ 500", saved: 320, target: 500, tone: "bg-mint/60" },
];

function Goals() {
  return (
    <div className="pb-10">
      <PageHeader title="Your goals" subtitle="Small targets beat big pressure." />

      <div className="mb-5">
        <Button variant="hero">
          <Plus className="size-4" /> New goal
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {goals.map((g, i) => {
          const pct = Math.round((g.saved / g.target) * 100);
          return (
            <motion.div
              key={g.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -6 }}
              className="glass-card rounded-[1.75rem] p-6"
            >
              <div className="flex items-center gap-3">
                <span className={`grid size-10 place-items-center rounded-2xl ${g.tone}`}>
                  <Target className="size-5 text-plum" />
                </span>
                <div>
                  <p className="font-display text-lg tracking-tight">{g.name}</p>
                  <p className="text-xs text-muted-foreground">
                    N$ {g.saved} of N$ {g.target}
                  </p>
                </div>
                <span className="ml-auto font-display text-xl text-plum">{pct}%</span>
              </div>
              <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-secondary/70">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: 0.2 + i * 0.07, type: "spring", stiffness: 110, damping: 18 }}
                  className="h-full rounded-full bg-gradient-primary"
                />
              </div>
              <div className="mt-5 flex gap-2">
                <Button variant="soft" size="sm">
                  Add N$ 20
                </Button>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
