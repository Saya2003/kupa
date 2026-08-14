import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Sparkles, ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { CursorCompanion } from "@/components/CursorCompanion";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-hero-aura">
      <CursorCompanion />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-gradient-primary opacity-30 blur-3xl animate-kupa-drift"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-0 size-80 rounded-full bg-gradient-soft opacity-50 blur-3xl animate-kupa-float"
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-2">
            <motion.span
              whileHover={{ rotate: 18, scale: 1.12 }}
              transition={{ type: "spring", stiffness: 300, damping: 12 }}
              className="grid size-9 place-items-center rounded-2xl bg-gradient-primary shadow-glow"
            >
              <Sparkles className="size-4 text-primary-foreground" />
            </motion.span>
            <span className="font-display text-xl tracking-tight">Kupa</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-plum/80 transition-colors hover:bg-secondary/70"
          >
            <ArrowLeft className="size-4" /> Back home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card w-full max-w-md rounded-[2rem] p-7 sm:p-9"
          >
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="font-display text-3xl tracking-tight"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="mt-2 text-sm text-muted-foreground"
            >
              {subtitle}
            </motion.p>

            <div className="mt-7">{children}</div>

            {footer ? <div className="mt-6 text-center text-sm">{footer}</div> : null}
          </motion.div>
        </div>

        <p className="pb-2 text-center text-xs text-muted-foreground">
          Kupa · gentle money wellness, one minute a day
        </p>
      </div>
    </div>
  );
}
