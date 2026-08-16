import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Github, Instagram, Twitter, Mail, Phone, ChevronDown } from "lucide-react";

const groups = [
  { title: "Product", links: ["Daily check-in", "Nudges", "Streaks", "Mood trend"] },
  { title: "Community", links: ["Encouragement board", "Guidelines", "Moderation"] },
  { title: "About", links: ["The story", "How the AI works", "Privacy"] },
];

export function Footer() {
  const [showContact, setShowContact] = useState(false);

  return (
    <footer className="relative mt-10 overflow-hidden border-t border-blush/50 bg-gradient-soft">
      <div className="pointer-events-none absolute -bottom-24 left-1/4 size-72 rounded-full bg-blush/40 blur-3xl animate-drift" />
      <div className="relative mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-12 md:grid-cols-[1.2fr_2fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-2xl bg-gradient-primary shadow-glow">
                <Sparkles className="size-4 text-primary-foreground" />
              </span>
              <span className="font-display text-xl">Kupa</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-plum/70">
              An AI-powered financial wellness companion. Responses are AI-generated and are not
              financial or clinical advice.
            </p>
            <div className="mt-6 flex gap-2">
              {[Instagram, Twitter, Github].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#top"
                  aria-label="Kupa social link"
                  whileHover={{ y: -4, rotate: -8 }}
                  className="grid size-10 place-items-center rounded-2xl bg-card text-plum shadow-soft"
                >
                  <Icon className="size-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-3">
            {groups.map((g, gi) => (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: gi * 0.08, duration: 0.6 }}
              >
                <h3 className="font-display text-base text-plum">{g.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {g.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#top"
                        className="group inline-flex text-sm text-plum/70 transition-colors hover:text-primary"
                      >
                        <span className="border-b border-transparent transition-colors group-hover:border-primary">
                          {l}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-blush/50 pt-6 text-xs text-plum/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Kupa. Built for CS Girlies Hackathon 2026.</p>
          <p>Made with care in Windhoek 🌸</p>
        </div>

        <div className="mt-5 border-t border-blush/30 pt-5 text-center text-xs text-plum/60">
          <p>
            This application was developed by{" "}
            <button
              type="button"
              onClick={() => setShowContact((v) => !v)}
              aria-expanded={showContact}
              className="inline-flex items-center gap-1 font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Saya Mubiana
              <ChevronDown
                className={`size-3 transition-transform duration-300 ${showContact ? "rotate-180" : ""}`}
              />
            </button>
          </p>
          {showContact && (
            <div className="mx-auto mt-3 flex w-fit flex-col items-center gap-2 sm:flex-row sm:gap-3">
              <a
                href="mailto:mubianasaya@gmail.com"
                className="inline-flex items-center gap-2 rounded-full border border-blush/50 bg-card px-4 py-2 text-plum shadow-soft transition-colors hover:text-primary"
              >
                <Mail className="size-3.5" />
                mubianasaya@gmail.com
              </a>
              <a
                href="tel:+264815580036"
                className="inline-flex items-center gap-2 rounded-full border border-blush/50 bg-card px-4 py-2 text-plum shadow-soft transition-colors hover:text-primary"
              >
                <Phone className="size-3.5" />
                +264 81 558 0036
              </a>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
