import { useEffect, useState } from "react";

/** Generic debounce hook — not yet wired into the Content search input
 *  (client-side filtering over a small in-memory list doesn't need it),
 *  but is the first thing to reach for once search moves server-side
 *  against a real Postgres table. See ARCHITECTURE.md. */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(handle);
  }, [value, delayMs]);
  return debounced;
}
