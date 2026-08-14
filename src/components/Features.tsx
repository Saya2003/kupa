import { motion } from "motion/react";
import { LineChart, ShieldCheck, Zap, Smartphone, Sparkles, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Nudges, not lectures",
    body: "One short, personalised tip per check-in. If you mentioned rent three days running, Kupa says so.",
    tone: "bg-blush/30",
  },
  {
    icon: LineChart,
    title: "7-day mood trend",
    body: "A gentle line of how your money stress moved this week, from your own check-ins.",
    tone: "bg-lilac/30",
  },
  {
    icon: Zap,
    title: "Under 5 seconds",
    body: "Your nudge lands fast, and if the AI hiccups you get a kind fallback — never an error wall.",
    tone: "bg-butter/40",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    body: "Check-in text is sensitive. Nothing is ever public unless you choose to post it.",
    tone: "bg-mint/40",
  },
  {
    icon: Smartphone,
    title: "Light on data",
    body: "Designed for low-end phones and slow connections. Every screen stays tiny.",
    tone: "bg-blush/30",
  },
  {
    icon: HeartHandshake,
    title: "Honest about AI",
    body: "Responses are clearly labelled AI-generated, with the model and prompt version logged.",
    tone: "bg-lilac/30",
  },
];

export function Features() {
  return (
    <section id="features" className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 size-96 -translate-x-1/2 rounded-full bg-lilac/25 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Features</p>
          <h2 className="mt-3 text-4xl sm:text-5xl">
            Wellness tech that finally <span className="text-gradient">talks about money</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Meditation apps won&apos;t help with rent week. Kupa treats financial anxiety as the
            wellness issue it is.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              data-cursor="grow"
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft"
            >
              <span
                className={`absolute -right-10 -top-10 size-28 rounded-full ${f.tone} blur-2xl transition-transform duration-700 group-hover:scale-150`}
              />
              <span className="relative grid size-11 place-items-center rounded-2xl bg-gradient-soft">
                <f.icon className="size-5 text-plum" />
              </span>
              <h3 className="relative mt-5 text-lg">{f.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
