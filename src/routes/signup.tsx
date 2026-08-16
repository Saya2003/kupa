import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, User, Eye, EyeOff, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your free Kupa account" },
      {
        name: "description",
        content:
          "Join Kupa free — a 60-second daily money check-in with gentle AI nudges built for students and gig workers.",
      },
      { property: "og:title", content: "Create your free Kupa account" },
      {
        property: "og:description",
        content: "Start your first 60-second money check-in today. Free, private, judgement-free.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignUpPage,
});

const perks = ["60-second daily check-in", "One kind nudge a day", "Private by default"];

function SignUpPage() {
  const navigate = useNavigate();
  const { signIn } = useAuthActions();
  const ensureProfile = useMutation(api.users.ensureProfile);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("flow", "signUp");
    const firstName = formData.get("name")?.toString() ?? "";

    try {
      await signIn("password", formData);
      await ensureProfile({ firstName: firstName || undefined });
      navigate({ to: "/app/onboarding" });
    } catch (error) {
      console.error(error);
      toast.error("Could not create your account. Try a different email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your Kupa"
      subtitle="Free forever for the daily check-in. No judgement, ever."
      footer={
        <span className="text-muted-foreground">
          Already with us?{" "}
          <Link to="/signin" className="font-semibold text-plum hover:underline">
            Sign in
          </Link>
        </span>
      }
    >
      <ul className="mb-6 space-y-2">
        {perks.map((p, i) => (
          <motion.li
            key={p}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.07 }}
            className="flex items-center gap-2 text-sm text-plum/80"
          >
            <span className="grid size-5 place-items-center rounded-full bg-mint/60">
              <Check className="size-3" />
            </span>
            {p}
          </motion.li>
        ))}
      </ul>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">First name</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-plum/60" />
            <Input id="name" name="name" required placeholder="Sinikiwe" className="pl-10" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-plum/60" />
            <Input id="email" name="email" type="email" required placeholder="you@campus.edu" className="pl-10" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-plum/60" />
            <Input
              id="password"
              name="password"
              type={show ? "text" : "password"}
              required
              minLength={8}
              placeholder="At least 8 characters"
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

        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <Checkbox id="terms" required className="mt-0.5" />
          <span>
            I agree to the Kupa terms and privacy promise — my check-ins stay mine.
          </span>
        </label>

        <motion.div whileTap={{ scale: 0.98 }}>
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {loading ? "Creating your space…" : "Create free account"}
          </Button>
        </motion.div>
      </form>
    </AuthLayout>
  );
}
