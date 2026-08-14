import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/app/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — Kupa" },
      {
        name: "description",
        content: "Update your name, goals context and money situation so Kupa's nudges fit you better.",
      },
      { property: "og:title", content: "Your profile — Kupa" },
      { property: "og:description", content: "Keep your details fresh so nudges stay relevant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Profile,
});

function Profile() {
  return (
    <div className="pb-10">
      <PageHeader title="Your profile" subtitle="The more Kupa knows, the kinder the nudges." />

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[1.75rem] p-6 text-center"
        >
          <span className="mx-auto grid size-20 place-items-center rounded-3xl bg-gradient-primary font-display text-3xl text-primary-foreground shadow-glow animate-kupa-float">
            S
          </span>
          <p className="mt-4 font-display text-xl tracking-tight">Sinikiwe M.</p>
          <p className="text-xs text-muted-foreground">Student · Windhoek</p>
          <div className="mt-5 flex justify-center gap-2 text-xs">
            <span className="rounded-full bg-butter/70 px-3 py-1 font-semibold text-accent-foreground">
              12-day streak
            </span>
            <span className="rounded-full bg-mint/60 px-3 py-1 font-semibold text-plum">34 check-ins</span>
          </div>
          <Button variant="soft" className="mt-6 w-full">
            Change photo
          </Button>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={(e) => e.preventDefault()}
          className="glass-card space-y-5 rounded-[1.75rem] p-6 lg:col-span-2"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fname">First name</Label>
              <Input id="fname" defaultValue="Sinikiwe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lname">Last name</Label>
              <Input id="lname" defaultValue="Mubiana" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pemail">Email</Label>
            <Input id="pemail" type="email" defaultValue="sinikiwe@campus.edu" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="income">Typical monthly income</Label>
              <Input id="income" defaultValue="N$ 3 200" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="situation">Situation</Label>
              <Input id="situation" defaultValue="Student + weekend gigs" />
            </div>
          </div>
          <Button variant="hero" type="submit">
            Save changes
          </Button>
        </motion.form>
      </div>
    </div>
  );
}
