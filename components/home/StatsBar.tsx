"use client";

import { motion } from "motion/react";
import { useRef } from "react";

const stats = [
  { value: "3,200+", label: "Properties Listed", icon: "🏡" },
  { value: "300+", label: "Active Field Agents", icon: "🤝" },
  { value: "23", label: "Districts Covered", icon: "📍" },
  { value: "4.8★", label: "Average Rating", icon: "⭐" },
  { value: "10K+", label: "Happy Travellers", icon: "✈️" },
  { value: "₹12L+", label: "Paid to Agents", icon: "💰" },
];

export default function StatsBar() {
  const ref = useRef(null);

  return (
    <section
      style={{ background: "#FECB19" }}
      className="py-8 overflow-hidden"
      ref={ref}
    >
      <div className="container">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              className="flex flex-col items-center"
            >
              <span className="text-2xl mb-1">{s.icon}</span>
              <p
                className="text-2xl sm:text-3xl font-black"
                style={{ color: "#0A0A0A" }}
              >
                {s.value}
              </p>
              <p
                className="text-xs sm:text-sm font-semibold mt-0.5"
                style={{ color: "rgba(10,10,10,0.55)" }}
              >
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
