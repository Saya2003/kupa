import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Loader2, MailCheck } from "lucide-react";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your Kupa password" },
      {
        name: "description",
        content: "Forgot your Kupa password? Send yourself a reset link and get back to your streak.",
      },
      { property: "og:title", content: "Reset your Kupa password" },
      {
        property: "og:description",
        content: "Send a reset link to your email and pick up your check-in streak again.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <AuthLayout
      title="Reset password"
      subtitle="We'll send a gentle link to get you back in."
      footer={
        <Link to="/signin" className="font-semibold text-plum hover:underline">
          Back to sign in
        </Link>
      }
    >
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-gradient-soft p-6 text-center"
          >
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-background/70 animate-kupa-float">
              <MailCheck className="size-6 text-plum" />
            </span>
            <p className="mt-4 font-display text-xl">Check your inbox</p>
            <p className="mt-1 text-sm text-muted-foreground">
              If that email is with us, a reset link is on its way.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                setSent(true);
              }, 700);
            }}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-plum/60" />
                <Input id="email" type="email" required placeholder="you@campus.edu" className="pl-10" />
              </div>
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              Send reset link
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
