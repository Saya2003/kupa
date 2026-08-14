import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  LayoutDashboard,
  CalendarCheck,
  Lightbulb,
  LineChart,
  Heart,
  Target,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { CursorCompanion } from "@/components/CursorCompanion";

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/checkin", label: "Daily check-in", icon: CalendarCheck },
  { to: "/app/nudges", label: "Nudges", icon: Lightbulb },
  { to: "/app/mood", label: "Mood trends", icon: LineChart },
  { to: "/app/goals", label: "Goals", icon: Target },
  { to: "/app/community", label: "Encouragement", icon: Heart },
] as const;

const bottomNav = [
  { to: "/app/profile", label: "Profile", icon: User },
  { to: "/app/settings", label: "Settings", icon: Settings },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const render = (items: readonly { to: string; label: string; icon: typeof User; exact?: boolean }[]) =>
    items.map((item, i) => {
      const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
      return (
        <motion.li
          key={item.to}
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.04 * i }}
        >
          <Link
            to={item.to}
            onClick={onNavigate}
            className={`group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
              active ? "text-plum" : "text-foreground/70 hover:text-plum"
            }`}
          >
            {active && (
              <motion.span
                layoutId="app-nav-pill"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="absolute inset-0 rounded-2xl bg-gradient-soft shadow-soft"
              />
            )}
            <item.icon className="relative z-10 size-4 transition-transform duration-300 group-hover:scale-110" />
            <span className="relative z-10">{item.label}</span>
          </Link>
        </motion.li>
      );
    });

  return (
    <div className="flex h-full flex-col">
      <ul className="space-y-1">{render(nav)}</ul>
      <div className="mt-6 border-t border-border/60 pt-4">
        <ul className="space-y-1">{render(bottomNav)}</ul>
      </div>
      <div className="mt-auto pt-6">
        <Link
          to="/signin"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-foreground/60 transition-colors hover:bg-secondary/70 hover:text-plum"
        >
          <LogOut className="size-4" /> Sign out
        </Link>
      </div>
    </div>
  );
}

export function AppShell() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-hero-aura">
      <CursorCompanion />

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-5 lg:px-6">
        <aside className="glass-card sticky top-5 hidden h-[calc(100vh-2.5rem)] w-64 shrink-0 flex-col rounded-[2rem] p-5 lg:flex">
          <Link to="/" className="mb-7 flex items-center gap-2">
            <motion.span
              whileHover={{ rotate: 18, scale: 1.12 }}
              transition={{ type: "spring", stiffness: 300, damping: 12 }}
              className="grid size-9 place-items-center rounded-2xl bg-gradient-primary shadow-glow"
            >
              <Sparkles className="size-4 text-primary-foreground" />
            </motion.span>
            <span className="font-display text-xl tracking-tight">Kupa</span>
          </Link>
          <NavList />
        </aside>

        <main className="min-w-0 flex-1">
          <header className="glass-card mb-5 flex items-center justify-between rounded-[1.75rem] px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                aria-label="Toggle menu"
                onClick={() => setOpen((v) => !v)}
                className="grid size-10 place-items-center rounded-2xl bg-secondary/70 text-plum lg:hidden"
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
              <div>
                <p className="text-xs text-muted-foreground">Good day,</p>
                <p className="font-display text-lg leading-tight tracking-tight">Sinikiwe</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.span
                whileHover={{ scale: 1.06 }}
                className="hidden items-center gap-2 rounded-full bg-butter/70 px-3 py-1.5 text-xs font-semibold text-accent-foreground sm:inline-flex"
              >
                <Sparkles className="size-3" /> 12-day streak
              </motion.span>
              <button
                aria-label="Notifications"
                className="relative grid size-10 place-items-center rounded-2xl bg-secondary/70 text-plum transition-transform hover:-translate-y-0.5"
              >
                <Bell className="size-4" />
                <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-primary" />
              </button>
              <Link to="/app/profile" aria-label="Profile">
                <motion.span
                  whileHover={{ scale: 1.08, rotate: 4 }}
                  className="grid size-10 place-items-center rounded-2xl bg-gradient-primary font-semibold text-primary-foreground"
                >
                  S
                </motion.span>
              </Link>
            </div>
          </header>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 overflow-hidden lg:hidden"
              >
                <div className="glass-card rounded-[1.75rem] p-4">
                  <NavList onNavigate={() => setOpen(false)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <h1 className="font-display text-3xl tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </motion.div>
  );
}
