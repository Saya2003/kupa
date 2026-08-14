import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Send } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/app/community")({
  head: () => ({
    meta: [
      { title: "Encouragement board — Kupa" },
      {
        name: "description",
        content: "Share and receive anonymous encouragement from other students and gig workers.",
      },
      { property: "og:title", content: "Encouragement board — Kupa" },
      { property: "og:description", content: "Anonymous encouragement from people in the same boat." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Community,
});

const seed = [
  { text: "Paid my own rent for the first time this month. Small win, big feeling.", hearts: 42 },
  { text: "Skipped takeaways for a week and it actually got easier by day 4.", hearts: 31 },
  { text: "Money is tight but I'm still here checking in. That counts.", hearts: 57 },
  { text: "Gig money is unpredictable — planning one bill first changed everything.", hearts: 24 },
  { text: "To whoever is stressed about school fees: you'll figure it out. I did.", hearts: 63 },
];

function Community() {
  const [notes, setNotes] = useState(seed);
  const [draft, setDraft] = useState("");
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  return (
    <div className="pb-10">
      <PageHeader title="Encouragement board" subtitle="Anonymous notes from people in the same boat." />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card mb-6 rounded-[1.75rem] p-6"
      >
        <Textarea
          rows={3}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Leave something kind, anonymously…"
        />
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Posted anonymously · 180 characters</span>
          <Button
            variant="hero"
            disabled={!draft.trim()}
            onClick={() => {
              setNotes((n) => [{ text: draft.trim(), hearts: 0 }, ...n]);
              setDraft("");
            }}
          >
            <Send className="size-4" /> Share
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence initial={false}>
          {notes.map((n, i) => (
            <motion.article
              key={n.text}
              layout
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ delay: Math.min(i * 0.05, 0.3) }}
              whileHover={{ y: -6, rotate: i % 2 ? -0.8 : 0.8 }}
              className="glass-card flex flex-col rounded-[1.5rem] p-5"
            >
              <p className="font-display text-lg leading-snug tracking-tight">"{n.text}"</p>
              <button
                onClick={() => setLiked((l) => ({ ...l, [i]: !l[i] }))}
                className="mt-auto flex items-center gap-2 pt-5 text-sm text-plum/80 transition-colors hover:text-plum"
              >
                <motion.span whileTap={{ scale: 1.4 }}>
                  <Heart className={`size-4 ${liked[i] ? "fill-primary text-primary" : ""}`} />
                </motion.span>
                {n.hearts + (liked[i] ? 1 : 0)}
              </button>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
