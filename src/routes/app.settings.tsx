import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Kupa" },
      {
        name: "description",
        content: "Control reminder times, nudge tone, privacy and your Kupa account settings.",
      },
      { property: "og:title", content: "Settings — Kupa" },
      { property: "og:description", content: "Reminders, nudge tone and privacy, your way." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Settings,
});

const toggles = [
  { id: "reminder", label: "Daily check-in reminder", hint: "A soft ping at 8pm", on: true },
  { id: "nudges", label: "AI nudges", hint: "One suggestion per check-in", on: true },
  { id: "board", label: "Encouragement board", hint: "Show anonymous notes", on: true },
  { id: "weekly", label: "Weekly mood recap", hint: "Sunday summary email", on: false },
];

function Settings() {
  return (
    <div className="pb-10">
      <PageHeader title="Settings" subtitle="Kupa should fit your life, not the other way round." />

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card space-y-5 rounded-[1.75rem] p-6"
        >
          <h2 className="font-display text-xl tracking-tight">Notifications & nudges</h2>
          {toggles.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="flex items-center justify-between gap-4 rounded-2xl bg-secondary/40 px-4 py-3"
            >
              <div>
                <Label htmlFor={t.id} className="text-sm font-semibold">
                  {t.label}
                </Label>
                <p className="text-xs text-muted-foreground">{t.hint}</p>
              </div>
              <Switch id={t.id} defaultChecked={t.on} />
            </motion.div>
          ))}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="glass-card space-y-4 rounded-[1.75rem] p-6"
        >
          <h2 className="font-display text-xl tracking-tight">Account & privacy</h2>
          <p className="text-sm text-muted-foreground">
            Your check-ins are private. Encouragement notes are always anonymous.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="soft">Change password</Button>
            <Button variant="soft">Export my data</Button>
            <Button variant="ghost">Delete account</Button>
          </div>
          <div className="pt-2">
            <Button variant="hero" asChild>
              <Link to="/signin">Sign out</Link>
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
