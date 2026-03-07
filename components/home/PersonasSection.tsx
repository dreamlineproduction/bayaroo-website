"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { features } from "process";

const personas = [
  {
    id: "traveller",
    emoji: "✈️",
    title: "Traveller",
    tagline: "Discover India's hidden gems",
    description:
      "Book authentic off-beat stays, plan AI-powered custom packages, and experience rural India's beauty — all from your phone.",
    cta: "Start Exploring",
    href: "/explore",
    features: [
      "3,200+ verified properties",
      "AI trip planner",
      "Live availability",
      "Secure payment",
    ],
    bg: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    accent: "#FECB19",
    badge: "For Travellers",
  },
  {
    id: "owner",
    emoji: "🏡",
    title: "Property Owner",
    tagline: "Turn your property into income",
    description:
      "List your homestay, resort, or villa on Bayaroo and reach thousands of travellers looking for authentic India experiences.",
    cta: "List Your Property",
    href: "/list-property",
    features: [
      "Free listing setup",
      "OTA management tools",
      "Billing & calendar sync",
      "Daily Payment",
      "Social Marketing support",
    ],
    bg: "linear-gradient(135deg, #1a0533, #2d0b5a, #1a0533)",
    accent: "#c084fc",
    badge: "For Owners",
  },
  {
    id: "agent",
    emoji: "🧭",
    title: "Travel Agent",
    tagline: "Sell packages. Scale revenue.",
    description:
      "Create and sell curated tour packages on the Bayaroo marketplace, access AI lead requests, and grow your travel business.",
    cta: "Explore Partnership",
    href: "/travel-agents",
    features: [
      "Package builder tool",
      "AI-generated leads",
      "Revenue dashboard",
      "B2B pricing",
    ],
    bg: "linear-gradient(135deg, #0a1628, #1a3a5c, #0a1628)",
    accent: "#60a5fa",
    badge: "For Travel Agents",
  },
  {
    id: "field",
    emoji: "📋",
    title: "Field Agent",
    tagline: "Earn ₹250/day. No investment.",
    description:
      "Visit local properties in your district, list them on the Bayaroo Agent App, and earn guaranteed daily income.",
    cta: "Become an Agent",
    href: "https://agent.bayaroo.space/",
    target: "_blank",
    features: [
      "₹250/day guaranteed",
      "Flexible schedule",
      "Free training",
      "Work from your district",
    ],
    bg: "linear-gradient(135deg, #0f1a0a, #1a3310, #0f1a0a)",
    accent: "#4ade80",
    badge: "For Field Agents",
  },
];

export default function PersonasSection() {
  return (
    <section className="section" style={{ background: "#0A0A0A" }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            className="badge badge-dark mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            A Platform For Everyone
          </motion.span>
          <motion.h2
            className="text-4xl sm:text-5xl font-black text-white leading-tight"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Whether you travel, host,
            <br />
            <span className="text-gradient">guide, or discover</span>
          </motion.h2>
        </div>

        {/* Persona cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {personas.map((p, i) => (
            <motion.div
              key={p.id}
              className="relative flex flex-col rounded-3xl overflow-hidden"
              style={{
                background: p.bg,
                border: `1px solid ${p.accent}22`,
                minHeight: "420px",
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              whileHover={{ y: -6 }}
            >
              {/* Glow */}
              <div
                className="absolute -inset-4 opacity-10 pointer-events-none blur-3xl"
                style={{
                  background: `radial-gradient(circle, ${p.accent} 0%, transparent 70%)`,
                }}
              />

              <div className="relative z-10 flex flex-col flex-1 p-7">
                {/* Badge */}
                <span
                  className="self-start text-xs font-bold px-3 py-1 rounded-full mb-6"
                  style={{
                    background: `${p.accent}20`,
                    color: p.accent,
                    border: `1px solid ${p.accent}40`,
                  }}
                >
                  {p.badge}
                </span>

                {/* Emoji */}
                <div className="text-5xl mb-5">{p.emoji}</div>

                <h3 className="text-2xl font-black text-white mb-1">
                  {p.title}
                </h3>
                <p
                  className="text-sm font-semibold mb-3"
                  style={{ color: p.accent }}
                >
                  {p.tagline}
                </p>
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {p.description}
                </p>

                {/* Features */}
                <ul className="flex flex-col gap-2 mb-8">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-xs text-white/60"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: p.accent }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-auto">
                  <Link
                    href={p.href}
                    className="flex items-center gap-2 justify-center w-full py-3 rounded-2xl text-sm font-bold transition-all"
                    style={{ background: p.accent, color: "#0A0A0A" }}
                  >
                    {p.cta} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
