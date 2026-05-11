import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/site/SiteChrome";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 grid-pattern opacity-40 mask-fade-b" />
      <div className="absolute -top-40 left-1/2 h-[480px] w-[800px] -translate-x-1/2 bg-gradient-glow blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
        <Link to="/" className="mb-8 flex items-center gap-2 self-center">
          <Logo />
          <span className="text-base font-semibold tracking-tight">TaskTide</span>
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-border/70 glass p-7 shadow-elegant"
        >
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="mt-7">{children}</div>
        </motion.div>
        <div className="mt-5 text-center text-sm text-muted-foreground">
          {footer}
        </div>
      </div>
    </div>
  );
}
