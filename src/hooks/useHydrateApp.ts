import { useEffect } from "react";
import { useApp } from "@/lib/store";

/**
 * Hydrate the store from localStorage on mount, and keep it in sync.
 * Use at the top of any route that depends on auth state.
 */
export function useHydrateApp() {
  const hydrate = useApp((s) => s.hydrate);
  const hydrated = useApp((s) => s.hydrated);
  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrate, hydrated]);
  return hydrated;
}
