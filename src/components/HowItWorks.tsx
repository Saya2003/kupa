import { motion } from "motion/react";
import { MessageCircleHeart, BrainCircuit, Flame, Users } from "lucide-react";

const steps = [
  {
    icon: MessageCircleHeart,
    title: "Check in",
    body: "Type how you feel about money today. One field, no forms, no budgeting spreadsheet.",
  },
  {
    icon: BrainCircuit,
    title: "The agent listens",
    body: "Kupa's agent reads your words and recent history, classifies your stress level and spots repeating worries.",
  },
  {
    icon: Flame,
    title: "Get one nudge",
    body: "A single specific, doable next step — never generic advice, always grounded in what you actually wrote.",
  },
  {
    icon: Users,
    title: "Feel less alone",
    body: "Drop an anonymous note on the encouragement board and read what others are carrying too.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative mx-auto max-w-6xl px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl"
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">How it works</p>
        <h2 className="mt-3 text-4xl sm:text-5xl">Four soft steps, one calmer day</h2>
      </motion.div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <motion.article
            key={s.title}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8, rotate: i % 2 ? 1 : -1 }}
            data-cursor="grow"
            className="group relative rounded-3xl bg-card p-6 shadow-soft"
          >
            <span className="absolute right-5 top-5 font-display text-3xl text-blush/70">
              0{i + 1}
            </span>
            <span className="grid size-12 place-items-center rounded-2xl bg-gradient-soft transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
              <s.icon className="size-5 text-plum" />
            </span>
            <h3 className="mt-5 text-xl">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            <span className="mt-5 block h-1 w-0 rounded-full bg-gradient-primary transition-all duration-500 group-hover:w-full" />
          </motion.article>
        ))}
      </div>
    </section>
  );
}
