import { motion } from "framer-motion";
import {
  Layers,
  Zap,
  KanbanSquare,
  Bell,
  Brain,
  ShieldCheck,
  Check,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { FadeIn } from "./Motion";
import { Link } from "@tanstack/react-router";

const FEATURES = [
  {
    icon: KanbanSquare,
    title: "Kanban, list & calendar",
    desc: "Switch views without losing context. Drag, drop, and stay in flow.",
  },
  {
    icon: Zap,
    title: "Keyboard-first",
    desc: "Command palette and shortcuts for every action. Built for speed.",
  },
  {
    icon: Brain,
    title: "AI assistant",
    desc: "Summarize standups, break down tasks, and surface what matters.",
  },
  {
    icon: Bell,
    title: "Live notifications",
    desc: "Stay in the loop with realtime activity and gentle reminders.",
  },
  {
    icon: Layers,
    title: "Projects & tags",
    desc: "Organize work with projects, priorities, due dates, and subtasks.",
  },
  {
    icon: ShieldCheck,
    title: "Yours, encrypted",
    desc: "Your data lives in your browser. Export anytime. No tracking.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-medium uppercase tracking-widest text-brand">
              Features
            </div>
            <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
              Everything you need.{" "}
              <span className="text-muted-foreground">Nothing you don't.</span>
            </h2>
          </div>
        </FadeIn>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.05}>
              <motion.div
                whileHover={{ y: -4 }}
                className="group h-full rounded-2xl border border-border/70 bg-card/40 p-6 backdrop-blur transition hover:border-border hover:bg-card/70"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
                  <f.icon className="h-5 w-5" />
                </div>
                <div className="text-base font-semibold">{f.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { t: "Capture", d: "Add tasks in seconds with the command bar." },
    { t: "Organize", d: "Group with projects, priorities, and tags." },
    { t: "Focus", d: "Pick your daily plan and execute deeply." },
    { t: "Ship", d: "Track wins on your productivity dashboard." },
  ];
  return (
    <section id="how" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-medium uppercase tracking-widest text-brand">
              How it works
            </div>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              From idea to done in four steps.
            </h2>
          </div>
        </FadeIn>
        <div className="relative mt-14 grid gap-4 md:grid-cols-4">
          {steps.map((s, i) => (
            <FadeIn key={s.t} delay={i * 0.08}>
              <div className="relative rounded-2xl border border-border/70 bg-card/40 p-6">
                <div className="text-xs font-mono text-muted-foreground">
                  0{i + 1}
                </div>
                <div className="mt-2 text-lg font-semibold">{s.t}</div>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      period: "/forever",
      features: ["Unlimited tasks", "Kanban + list views", "Local-first storage", "Keyboard shortcuts"],
      cta: "Start free",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$9",
      period: "/month",
      features: ["Everything in Free", "AI assistant", "Calendar view", "Custom themes", "Priority support"],
      cta: "Start free trial",
      highlight: true,
    },
    {
      name: "Team",
      price: "$19",
      period: "/seat/mo",
      features: ["Everything in Pro", "Team workspaces", "Shared projects", "Activity reports", "SSO"],
      cta: "Contact sales",
      highlight: false,
    },
  ];
  return (
    <section id="pricing" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-medium uppercase tracking-widest text-brand">
              Pricing
            </div>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Simple, fair pricing.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Start free. Upgrade only when you need more.
            </p>
          </div>
        </FadeIn>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {tiers.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.05}>
              <div
                className={`relative h-full rounded-2xl border p-6 backdrop-blur ${
                  t.highlight
                    ? "border-transparent bg-gradient-brand/[0.08] ring-1 ring-brand/60 shadow-glow"
                    : "border-border/70 bg-card/40"
                }`}
              >
                {t.highlight && (
                  <div className="absolute -top-3 left-6 rounded-full bg-gradient-brand px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                    Most popular
                  </div>
                )}
                <div className="text-sm text-muted-foreground">{t.name}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <div className="text-4xl font-semibold tracking-tight">
                    {t.price}
                  </div>
                  <div className="text-sm text-muted-foreground">{t.period}</div>
                </div>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success" />
                      <span className="text-foreground/90">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`mt-7 inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    t.highlight
                      ? "bg-foreground text-background hover:scale-[1.02]"
                      : "border border-border bg-card/60 hover:bg-card"
                  }`}
                >
                  {t.cta}
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  { q: "TaskTide replaced three apps for me. The keyboard UX is unreal.", a: "Maya R.", r: "Product Designer" },
  { q: "Finally a task manager that feels as good as it looks.", a: "Jordan K.", r: "Founder, Drift Labs" },
  { q: "The Kanban + AI combo helped me ship a launch in half the time.", a: "Sasha V.", r: "Engineering Lead" },
  { q: "Beautifully fast. It just gets out of the way.", a: "Theo M.", r: "Indie Hacker" },
];

export function Testimonials() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-medium uppercase tracking-widest text-brand">
              Loved by makers
            </div>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Teams ship faster with TaskTide.
            </h2>
          </div>
        </FadeIn>
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={t.a} delay={i * 0.05}>
              <div className="rounded-2xl border border-border/70 bg-card/40 p-6 backdrop-blur">
                <p className="text-lg leading-relaxed text-foreground/90">
                  "{t.q}"
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-brand" />
                  <div>
                    <div className="text-sm font-medium">{t.a}</div>
                    <div className="text-xs text-muted-foreground">{t.r}</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQ = [
  { q: "Is TaskTide really free?", a: "Yes. The Free plan is free forever for solo makers, with unlimited tasks and projects." },
  { q: "Where is my data stored?", a: "All your data is stored locally in your browser. You can export and import anytime." },
  { q: "Does it work offline?", a: "Yes — TaskTide is a local-first app, so you can keep planning even with no connection." },
  { q: "Can I use TaskTide with a team?", a: "Team workspaces and shared projects are available on the Team plan." },
  { q: "How do I cancel?", a: "Cancel anytime in one click from your billing settings — no questions asked." },
];

export function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-24">
      <div className="mx-auto max-w-3xl px-4">
        <FadeIn>
          <div className="text-center">
            <div className="text-xs font-medium uppercase tracking-widest text-brand">
              FAQ
            </div>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Frequently asked.
            </h2>
          </div>
        </FadeIn>
        <div className="mt-12 divide-y divide-border/60 rounded-2xl border border-border/70 bg-card/40 backdrop-blur">
          {FAQ.map((item, i) => (
            <div key={item.q} className="px-5">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between py-5 text-left"
              >
                <span className="font-medium">{item.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: open === i ? "auto" : 0,
                  opacity: open === i ? 1 : 0,
                }}
                className="overflow-hidden"
              >
                <p className="pb-5 text-sm text-muted-foreground">{item.a}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-brand/[0.10] p-10 text-center shadow-elegant md:p-16">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="absolute -top-24 left-1/2 h-72 w-[600px] -translate-x-1/2 bg-gradient-glow blur-3xl" />
          <div className="relative">
            <h2 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
              Make today your most focused day.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join thousands of makers shipping faster with TaskTide.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background shadow-glow hover:scale-[1.03] transition-transform"
              >
                Get started free
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center rounded-xl border border-border bg-card/60 px-5 py-3 text-sm font-medium backdrop-blur hover:bg-card transition"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
