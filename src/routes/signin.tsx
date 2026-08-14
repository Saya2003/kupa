import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in to Kupa — Your money wellness companion" },
      {
        name: "description",
        content:
          "Sign in to Kupa to continue your daily 60-second check-ins, streaks and gentle AI nudges.",
      },
      { property: "og:title", content: "Sign in to Kupa" },
      {
        property: "og:description",
        content: "Continue your daily check-ins and gentle money nudges with Kupa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate({ to: "/app" }), 700);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="One minute a day keeps the money worry away."
      footer={
        <span className="text-muted-foreground">
          New to Kupa?{" "}
          <Link to="/signup" className="font-semibold text-plum hover:underline">
            Create an account
          </Link>
        </span>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-plum/60" />
            <Input id="email" type="email" required placeholder="you@campus.edu" className="pl-10" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-plum/60" />
            <Input
              id="password"
              type={show ? "text" : "password"}
              required
              placeholder="••••••••"
              className="px-10"
            />
            <button
              type="button"
              aria-label={show ? "Hide password" : "Show password"}
              onClick={() => setShow((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-plum/60 transition-colors hover:text-plum"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <Checkbox id="remember" /> Remember me
          </label>
          <Link to="/forgot-password" className="font-medium text-plum hover:underline">
            Forgot password?
          </Link>
        </div>

        <motion.div whileTap={{ scale: 0.98 }}>
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {loading ? "Signing you in…" : "Sign in"}
          </Button>
        </motion.div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or continue with{" "}
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button type="button" variant="soft" className="w-full">
            Google
          </Button>
          <Button type="button" variant="soft" className="w-full">
            Apple
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
