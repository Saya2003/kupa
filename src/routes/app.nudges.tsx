import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Sparkles, ThumbsUp, ThumbsDown, Bookmark } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/nudges")({
  head: () => ({
    meta: [
      { title: "Your nudges — Kupa" },
      {
        name: "description",
        content: "Every gentle money nudge Kupa has sent you, saved and searchable in one place.",
      },
      { property: "og:title", content: "Your nudges — Kupa" },
      { property: "og:description", content: "Every gentle money nudge Kupa has sent you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Nudges,
});

const nudges = [
  { date: "Today", tag: "Rent", text: "Rent feels heavy — set aside N$ 80 today and it'll feel lighter by Thursday." },
  { date: "Yesterday", tag: "Data", text: "You bought data twice this week. A weekly bundle would save you about N$ 45." },
  { date: "Wed", tag: "Food", text: "Two home-cooked days saved you N$ 110. Want to move that to savings?" },
  { date: "Tue", tag: "Mindset", text: "Money felt tight but you still checked in. That consistency is the win today." },
  { date: "Mon", tag: "Gig income", text: "Your pay lands Friday — plan one bill now so it doesn't disappear." },
];

function Nudges() {
  return (
    <div className="pb-10">
      <PageHeader title="Your nudges" subtitle="Small, kind suggestions — never lectures." />
      <div className="grid gap-4 md:grid-cols-2">
        {nudges.map((n, i) => (
          <motion.article
            key={n.text}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.45 }}
            whileHover={{ y: -6, rotate: i % 2 ? -0.6 : 0.6 }}
            className="glass-card rounded-[1.75rem] p-6"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary/70 px-3 py-1 text-xs font-semibold text-plum">
                <Sparkles className="size-3" /> {n.tag}
              </span>
              <span className="text-xs text-muted-foreground">{n.date}</span>
            </div>
            <p className="mt-4 font-display text-xl leading-snug tracking-tight">{n.text}</p>
            <div className="mt-5 flex items-center gap-2">
              <Button variant="soft" size="sm">
                <ThumbsUp className="size-4" /> Helpful
              </Button>
              <Button variant="ghost" size="sm">
                <ThumbsDown className="size-4" /> Not for me
              </Button>
              <Button variant="ghost" size="icon" aria-label="Save nudge" className="ml-auto">
                <Bookmark className="size-4" />
              </Button>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
