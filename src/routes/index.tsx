import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site/SiteChrome";
import { Hero, Stats } from "@/components/site/Hero";
import {
  Features,
  HowItWorks,
  Pricing,
  Testimonials,
  FAQAccordion,
  CTASection,
} from "@/components/site/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TaskTide — The task manager for deep work" },
      {
        name: "description",
        content:
          "TaskTide brings planning, focus, and collaboration into one beautiful, keyboard-first workspace. Free for solo makers.",
      },
      { property: "og:title", content: "TaskTide — The task manager for deep work" },
      {
        property: "og:description",
        content: "A modern, local-first task manager inspired by Linear and Notion.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <SiteHeader />
      <main>
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FAQAccordion />
        <CTASection />
      </main>
      <SiteFooter />
    </div>
  );
}
