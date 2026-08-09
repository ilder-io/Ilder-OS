import type { ReactNode } from "react";

export function H1({ children }: { children: ReactNode }) {
  return <h1 className="text-2xl font-semibold text-foreground">{children}</h1>;
}

export function Meta({ children }: { children: ReactNode }) {
  return <p className="mt-1.5 text-2xs text-muted-foreground">{children}</p>;
}

export function Intro({ children }: { children: ReactNode }) {
  return <p className="mt-6 text-sm leading-relaxed text-foreground/90">{children}</p>;
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="mt-8 text-base font-semibold text-foreground">{children}</h2>;
}

export function P({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-sm leading-relaxed text-foreground/90">{children}</p>;
}

export function Ul({ children }: { children: ReactNode }) {
  return <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90">{children}</ul>;
}
