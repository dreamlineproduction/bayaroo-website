"use client";

import { motion } from "motion/react";
import { Search, CalendarCheck, PackageCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Discover & Filter",
    description:
      "Browse 3,200+ verified properties across 23 districts. Filter by type (Homestay, Villa, Dome…), location, dates, experience, and budget.",
    color: "#FECB19",
    bg: "rgba(254,203,25,0.1)",
    items: [
      "By property type",
      "By experience (mountain, beach…)",
      "GPS-based nearby search",
      "Date & guest filters",
    ],
  },
  {
    step: "02",
    icon: CalendarCheck,
    title: "Book with Confidence",
    description:
      "View real-time availability, nightly pricing calendars, room-level meal options, and guest reviews — then pay securely via Cashfree.",
    color: "#F95622",
    bg: "rgba(249,86,34,0.1)",
    items: [
      "Live availability calendar",
      "Meal customisation per room",
      "Nightly price breakdown",
      "Secure payment",
    ],
  },
  {
    step: "03",
    icon: PackageCheck,
    title: "Experience & Review",
    description:
      "Manage your booking, add co-traveller details, get property directions, chat with the host, and leave a multi-dimension review after checkout.",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.1)",
    items: [
      "Booking management",
      "Guest info management",
      "Host chat",
      "5-dimension review system",
    ],
  },
];

export default function HowItWorks() {
  return (
    <section className="section bg-white">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            className="badge badge-yellow mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Designed for Travellers
          </motion.span>
          <motion.h2
            className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 leading-tight"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Your journey starts in{" "}
            <span className="text-gradient">3 simple steps</span>
          </motion.h2>
          <motion.p
            className="text-gray-500 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Discover, book, and experience India&apos;s most unique properties —
            all from one app.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector */}
          <div
            className="hidden md:block absolute top-10 left-[22%] right-[22%] h-px"
            style={{
              background: "linear-gradient(90deg,#FECB19,#F95622,#22c55e)",
            }}
          />

          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              className="relative bg-white rounded-3xl p-8 border border-gray-100 card-hover shadow-sm"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.15, duration: 0.55 }}
            >
              {/* Step number */}
              <div
                className="absolute -top-3.5 left-8 text-xs font-black px-3 py-0.5 rounded-full bg-white border-2"
                style={{ borderColor: s.color, color: s.color }}
              >
                STEP {s.step}
              </div>

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 mt-3"
                style={{ background: s.bg }}
              >
                <s.icon size={26} style={{ color: s.color }} />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {s.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                {s.description}
              </p>

              {/* Feature list */}
              <ul className="flex flex-col gap-2">
                {s.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: s.color }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/explore" className="btn-primary">
            Start Exploring <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
