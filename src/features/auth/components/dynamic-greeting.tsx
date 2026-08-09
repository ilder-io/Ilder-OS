"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeUpItem } from "@/features/auth/components/auth-card-shell";

const MORNING = { title: "Good morning, Builder.", sub: "Keep creating." };
const AFTERNOON = { title: "Good afternoon, Builder.", sub: "Momentum compounds." };
const EVENING = { title: "Good evening, Builder.", sub: "Keep creating." };
const NIGHT = { title: "Still building?", sub: "Your brand never sleeps." };

function messageForHour(hour: number) {
  if (hour < 5) return NIGHT;
  if (hour < 12) return MORNING;
  if (hour < 18) return AFTERNOON;
  if (hour < 23) return EVENING;
  return NIGHT;
}

const RETURNING = { title: "Welcome back.", sub: "Your brand is growing." };

/** Time-of-day copy for new visitors, a fixed "welcome back" for returning
 *  ones. Computed client-side (after mount) so the server-rendered shell
 *  never mismatches a visitor's local time. */
export function DynamicGreeting({ variant }: { variant: "sign-in" | "sign-up" }) {
  const [message, setMessage] = useState(RETURNING);

  useEffect(() => {
    if (variant === "sign-up") {
      setMessage(messageForHour(new Date().getHours()));
    }
  }, [variant]);

  return (
    <motion.div variants={fadeUpItem}>
      <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{message.title}</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{message.sub}</p>
    </motion.div>
  );
}
