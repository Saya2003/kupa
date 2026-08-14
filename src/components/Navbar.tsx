import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

const links = [
  { label: "How it works", href: "#how" },
  { label: "Features", href: "#features" },
  { label: "Community", href: "#community" },
  { label: "Why Kupa", href: "#why" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-3xl px-4 py-3 transition-all duration-500 sm:px-6 ${
          scrolled ? "glass-card" : "border border-transparent bg-transparent"
        }`}
      >
        <a href="#top" className="group flex items-center gap-2">
          <motion.span
            whileHover={{ rotate: 18, scale: 1.12 }}
            transition={{ type: "spring", stiffness: 300, damping: 12 }}
            className="grid size-9 place-items-center rounded-2xl bg-gradient-primary shadow-glow"
          >
            <Sparkles className="size-4 text-primary-foreground" />
          </motion.span>
          <span className="font-display text-xl tracking-tight">Kupa</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex" onMouseLeave={() => setHovered(null)}>
          {links.map((l) => (
            <li key={l.href} className="relative">
              <a
                href={l.href}
                onMouseEnter={() => setHovered(l.href)}
                className="relative z-10 block rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-plum"
              >
                {l.label}
              </a>
              <AnimatePresence>
                {hovered === l.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-secondary/70"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden rounded-full sm:inline-flex" asChild>
            <Link to="/signin">Sign in</Link>
          </Button>
          <Button variant="hero" size="sm" className="hidden sm:inline-flex" asChild>
            <Link to="/signup">Start free</Link>
          </Button>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-2xl bg-secondary/70 text-plum md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -12, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl md:hidden"
          >
            <ul className="glass-card space-y-1 rounded-3xl p-3">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-sm font-medium hover:bg-secondary/70"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <li className="pt-1">
                <Button variant="hero" className="w-full" asChild>
                  <Link to="/signup">Start free</Link>
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
