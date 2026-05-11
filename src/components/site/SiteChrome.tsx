import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-3" : "py-5",
      )}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300",
            scrolled ? "glass shadow-elegant" : "bg-transparent",
          )}
        >
          <Link to="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-base font-semibold tracking-tight">TaskTide</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden text-sm text-muted-foreground hover:text-foreground transition-colors sm:inline"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center rounded-lg bg-foreground px-3.5 py-2 text-sm font-medium text-background transition-transform hover:scale-[1.03]"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative h-7 w-7 overflow-hidden rounded-lg bg-gradient-brand shadow-glow",
        className,
      )}
    >
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute inset-1 rounded-md bg-background/40 backdrop-blur-sm" />
      <div className="absolute inset-0 grid place-items-center text-[10px] font-black text-white">
        T
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-12 mt-24">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-semibold tracking-tight">TaskTide</span>
          <span className="ml-3 text-sm text-muted-foreground">
            © {new Date().getFullYear()} — Built for makers.
          </span>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </div>
      </div>
    </footer>
  );
}

export function ParallaxOrbs() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 800], [0, 150]);
  const y2 = useTransform(scrollY, [0, 800], [0, -100]);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        style={{ y: y1 }}
        className="absolute -left-32 top-32 h-[520px] w-[520px] rounded-full bg-gradient-brand opacity-30 blur-[120px]"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute -right-40 top-[500px] h-[420px] w-[420px] rounded-full bg-info opacity-20 blur-[120px]"
      />
    </div>
  );
}
