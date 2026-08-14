import { createFileRoute } from "@tanstack/react-router";
import { CursorCompanion } from "@/components/CursorCompanion";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { Community } from "@/components/Community";
import { WhyKupa } from "@/components/WhyKupa";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kupa — AI Financial Wellness Companion" },
      {
        name: "description",
        content:
          "Kupa turns a 60-second daily check-in into one personalised nudge, easing money stress for students and gig workers.",
      },
      { property: "og:title", content: "Kupa — AI Financial Wellness Companion" },
      {
        property: "og:description",
        content:
          "Daily check-ins, AI nudges, streaks and an anonymous encouragement board for money stress.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <CursorCompanion />
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Community />
        <WhyKupa />
      </main>
      <Footer />
    </div>
  );
}
