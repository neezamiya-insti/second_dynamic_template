"use client";

import React from "react";
import { Poppins } from "next/font/google";
import EventsHero from "./EventsHero";
import EventsGrid from "./EventsGrid";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function EventsPage() {
  return (
    <main className={`${poppins.className} w-full`}>
      <EventsHero />
      <EventsGrid />
    </main>
  );
}