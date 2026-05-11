import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Flag,
  Calendar,
} from "lucide-react";
import { ParallaxOrbs } from "./SiteChrome";
import { FadeIn } from "./Motion";

export function Hero() {
  return (
    <section className="relative pt-36 pb-24 overflow-hidden">
      <div className="absolute inset-0 grid-pattern mask-fade-b opacity-50" />
      <ParallaxOrbs />

      <div className="relative mx-auto max-w-6xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/40 px-3.5 py-1.5 text-xs text-muted-foreground backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5 text-brand" />
          New — AI productivity assistant is here
          <ArrowRight className="h-3 w-3" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-7 text-balance text-5xl font-semibold tracking-tight md:text-7xl"
        >
          The task manager built for{" "}
          <span className="text-gradient-brand">deep work.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground"
        >
          TaskTide brings together planning, focus, and collaboration in one
          fast, beautiful workspace. Inspired by Linear and Notion — designed
          for shipping.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/signup"
            className="group inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background shadow-glow transition-transform hover:scale-[1.03]"
          >
            Start for free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/40 px-5 py-3 text-sm font-medium text-foreground/90 backdrop-blur hover:bg-card/80 transition"
          >
            See features
          </a>
        </motion.div>

        <p className="mt-5 text-xs text-muted-foreground">
          No credit card required · Free forever for solo makers
        </p>

        {/* Mock product preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          <div className="absolute -inset-x-20 -top-10 h-72 bg-gradient-glow blur-3xl" />
          <ProductPreview />
        </motion.div>
      </div>
    </section>
  );
}

function ProductPreview() {
  return (
    <div className="relative rounded-2xl border border-border/80 glass shadow-elegant overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        </div>
        <div className="ml-3 text-xs text-muted-foreground">
          tasktide.app / dashboard
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
        <aside className="hidden border-r border-border/60 p-4 md:block">
          <div className="space-y-1.5 text-xs text-muted-foreground">
            {["Inbox", "Today", "Upcoming", "Projects", "Analytics"].map(
              (i, idx) => (
                <div
                  key={i}
                  className={`rounded-md px-2.5 py-1.5 ${
                    idx === 1 ? "bg-accent text-foreground" : ""
                  }`}
                >
                  {i}
                </div>
              ),
            )}
          </div>
        </aside>
        <div className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Today</div>
              <div className="text-xs text-muted-foreground">
                7 tasks · 3 due today
              </div>
            </div>
            <div className="hidden gap-2 sm:flex">
              <div className="rounded-md border border-border/60 px-2 py-1 text-xs text-muted-foreground">
                List
              </div>
              <div className="rounded-md border border-border/60 bg-accent px-2 py-1 text-xs">
                Kanban
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { t: "Design dashboard", p: "High", c: "from-rose-500 to-orange-500", s: "In progress" },
              { t: "Launch email", p: "Med", c: "from-violet-500 to-fuchsia-500", s: "Todo" },
              { t: "Q3 review", p: "Med", c: "from-sky-500 to-cyan-500", s: "Review" },
            ].map((card, i) => (
              <motion.div
                key={card.t}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="rounded-xl border border-border/70 bg-card/60 p-3.5"
              >
                <div className={`mb-2 h-1 w-10 rounded-full bg-gradient-to-r ${card.c}`} />
                <div className="text-sm font-medium">{card.t}</div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Flag className="h-3 w-3" /> {card.p}
                  <Clock className="ml-1 h-3 w-3" /> {card.s}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* floating chips */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute -left-6 top-24 hidden rounded-xl border border-border/70 bg-card/80 px-3 py-2 text-xs shadow-elegant md:flex md:items-center md:gap-2"
      >
        <CheckCircle2 className="h-4 w-4 text-success" />
        Task completed
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute -right-6 top-48 hidden rounded-xl border border-border/70 bg-card/80 px-3 py-2 text-xs shadow-elegant md:flex md:items-center md:gap-2"
      >
        <Calendar className="h-4 w-4 text-info" />
        Due tomorrow
      </motion.div>
    </div>
  );
}

export function Stats() {
  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border/70 bg-card/40 p-6 backdrop-blur md:grid-cols-4">
            {[
              { v: "12k+", l: "Tasks completed daily" },
              { v: "3.5h", l: "Saved per week" },
              { v: "99.9%", l: "Uptime" },
              { v: "4.9★", l: "Avg. user rating" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="text-3xl font-semibold tracking-tight md:text-4xl">
                  {s.v}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
