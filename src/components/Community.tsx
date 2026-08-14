import { motion } from "motion/react";
import { Heart, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const notes = [
  { text: "Paid rent late but I paid it. That counts.", tag: "anonymous · 2m" },
  { text: "Set aside N$20 today. First time in weeks.", tag: "anonymous · 14m" },
  { text: "Gig money came in slow again. Breathing anyway.", tag: "anonymous · 1h" },
  { text: "Told my friend I couldn't afford brunch. Felt free.", tag: "anonymous · 3h" },
  { text: "Day 9 of checking in. My spirals are shorter now.", tag: "anonymous · 5h" },
];

export function Community() {
  return (
    <section id="community" className="relative py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Community</p>
          <h2 className="mt-3 text-4xl sm:text-5xl">The encouragement board</h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Money stress is isolating. Post a short, anonymous note — or just read the wall and
            remember that the person before you is figuring it out too. Every post is moderated
            before it appears.
          </p>

          <div className="mt-8 flex max-w-md items-center gap-2 rounded-full border border-blush/60 bg-card p-2 pl-5 shadow-soft">
            <input
              aria-label="Write an anonymous note"
              placeholder="Say something kind, anonymously…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <Button variant="hero" size="icon" aria-label="Post note">
              <Send className="size-4" />
            </Button>
          </div>
        </motion.div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-0 -m-6 rounded-[2.5rem] bg-gradient-soft" />
          <div className="relative space-y-4 p-2">
            {notes.map((n, i) => (
              <motion.div
                key={n.text}
                initial={{ opacity: 0, y: 24, rotate: i % 2 ? 2 : -2 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.09, duration: 0.55 }}
                whileHover={{ scale: 1.03, rotate: 0 }}
                data-cursor="grow"
                className={`glass-card rounded-3xl px-5 py-4 ${i % 2 ? "ml-auto max-w-sm" : "max-w-sm"}`}
              >
                <p className="text-sm leading-snug text-plum">{n.text}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{n.tag}</span>
                  <span className="inline-flex items-center gap-1">
                    <Heart className="size-3 text-primary" />
                    {6 + i * 3}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
