"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

const chips = [
  "Homestay",
  "Resort",
  "Villa",
  "Dome",
  "Hotel",
  "Cottage",
  "Apartment",
  "Cab",
];

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-hero noise"
      style={{ paddingTop: "5rem" }}
    >
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        src="/hero3.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      {/* Video dark overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.55) 50%, rgba(10,10,10,0.80) 100%)",
        }}
      />

      {/* Gradient orb accents on top of video */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-25 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #FECB19 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-[400px] h-[300px] rounded-full opacity-15 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #F95622 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      <div className="container relative z-10 text-center pt-8 pb-12">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="badge badge-dark text-xs">
            <Sparkles
              size={11}
              className="inline mr-1"
              style={{ color: "#FECB19" }}
            />
            India&apos;s Rural &amp; Off-Beat Travel Super App
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-none tracking-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Discover India's
          <br />
          <span className="text-gradient">Hidden Treasures</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: "rgba(255,255,255,0.6)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Book authentic homestays, off-beat resorts, private villas, and unique
          properties. Plan your perfect trip with AI — in seconds.
        </motion.p>

        {/* Chip scroll */}
        <motion.div
          className="flex items-center justify-center flex-wrap gap-2 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {chips.map((c, i) => (
            <Link
              key={c}
              href={`/explore?type=${c.toLowerCase()}`}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: i === 0 ? "#FECB19" : "rgba(255,255,255,0.08)",
                color: i === 0 ? "#0A0A0A" : "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              {c}
            </Link>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href="/explore"
            className="inline-flex items-center gap-2.5 font-black text-base rounded-full transition-all duration-200 hover:-translate-y-1"
            style={{
              background: "linear-gradient(135deg, #FECB19 0%, #F95622 100%)",
              color: "#0A0A0A",
              padding: "1rem 2.25rem",
              boxShadow:
                "0 6px 32px rgba(249,86,34,0.55), 0 2px 8px rgba(254,203,25,0.3)",
            }}
          >
            Start Exploring <ArrowRight size={18} />
          </Link>
          <Link
            href="/explore#ai-planner"
            className="inline-flex items-center gap-2.5 font-black text-base rounded-full transition-all duration-200 hover:-translate-y-1"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
              color: "#fff",
              padding: "1rem 2.25rem",
              border: "2px solid rgba(255,255,255,0.45)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
            }}
          >
            <Sparkles size={16} /> Plan with AI
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.div
          className="mt-10 flex items-center justify-center gap-6 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.8 }}
        >
          {[
            "3,200+ properties",
            "23 districts covered",
            "4.8★ avg rating",
            "10,000+ happy travellers",
          ].map((t) => (
            <div
              key={t}
              className="flex items-center gap-1.5 text-xs font-medium text-white/60"
            >
              <span
                className="w-1 h-1 rounded-full"
                style={{ background: "#FECB19" }}
              />
              {t}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
