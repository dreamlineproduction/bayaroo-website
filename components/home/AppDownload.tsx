"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Smartphone, Star, ArrowRight } from "lucide-react";

const appFeatures = [
  { label: "Offline booking", icon: "📵" },
  { label: "GPS-based discovery", icon: "📍" },
  { label: "Live language translation", icon: "🌐" },
  { label: "Live availability", icon: "📅" },
  { label: "Meal customisation", icon: "🍽" },
  { label: "Host chat", icon: "💬" },
  { label: "AI trip planner", icon: "🤖" },
  { label: "Secure payments", icon: "🔒" },
  { label: "Multi-category reviews", icon: "⭐" },
];

const mockScreens = [
  { bg: "#1a1a2e", label: "Home", emoji: "🏠" },
  { bg: "#0f1a0a", label: "Property", emoji: "🏡" },
  { bg: "#1a0533", label: "Booking", emoji: "📋" },
];

export default function AppDownload() {
  return (
    <section
      className="section bg-dark-section relative overflow-hidden"
      style={{ background: "#0A0A0A" }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(254,203,25,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Phone mockup */}
          <motion.div
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {mockScreens.map((s, i) => (
              <div
                key={s.label}
                className={`phone-frame relative overflow-hidden ${i === 1 ? "scale-105 z-10" : "scale-95 opacity-70"}`}
                style={{
                  width: "160px",
                  height: "300px",
                  background: s.bg,
                  borderRadius: "2rem",
                  marginTop: i === 1 ? "-20px" : "0",
                }}
              >
                {/* Mock content */}
                <div className="p-3 flex flex-col h-full">
                  <div className="h-1 w-10 bg-white/20 rounded-full mx-auto mb-4 mt-2" />
                  <div className="text-4xl text-center my-3">{s.emoji}</div>
                  <div className="space-y-2 mt-2">
                    <div className="h-2 bg-white/10 rounded-full w-3/4" />
                    <div className="h-2 bg-white/10 rounded-full" />
                    <div className="h-2 bg-white/10 rounded-full w-5/6" />
                  </div>
                  <div
                    className="mt-4 h-16 rounded-xl"
                    style={{
                      background: "rgba(254,203,25,0.1)",
                      border: "1px solid rgba(254,203,25,0.2)",
                    }}
                  />
                  <div
                    className="mt-auto mb-2 h-8 rounded-xl"
                    style={{
                      background: "linear-gradient(135deg,#FECB19,#F95622)",
                    }}
                  />
                </div>
                <div
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.3)" }}
                />
              </div>
            ))}
          </motion.div>

          {/* Right: Copy */}
          <div>
            <motion.div
              className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Smartphone size={14} />
              Download the App
            </motion.div>

            <motion.h2
              className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              India&apos;s best off-beat
              <br />
              travel app is in your pocket
            </motion.h2>

            <motion.p
              className="text-base leading-relaxed mb-8"
              style={{ color: "rgba(255,255,255,0.5)" }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Built natively for Android &amp; iOS. Works in low-connectivity
              areas. Every feature you need, from discovery to checkout.
            </motion.p>

            {/* Feature chips */}
            <motion.div
              className="flex flex-wrap gap-2 mb-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
            >
              {appFeatures.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <span>{f.icon}</span>
                  {f.label}
                </div>
              ))}
            </motion.div>

            {/* App store buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-8"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/download"
                className="flex items-center gap-4 px-6 py-4 rounded-2xl transition-all hover:opacity-90"
                style={{ background: "#fff", minWidth: "200px" }}
              >
                <span className="text-3xl">📱</span>
                <div>
                  <p className="text-xs text-gray-500">Get it on</p>
                  <p className="font-black text-base text-gray-900">
                    Google Play
                  </p>
                </div>
              </Link>
              <Link
                href="/download"
                className="flex items-center gap-4 px-6 py-4 rounded-2xl transition-all hover:opacity-90"
                style={{ background: "#fff", minWidth: "200px" }}
              >
                <span className="text-3xl">🍎</span>
                <div>
                  <p className="text-xs text-gray-500">Download on the</p>
                  <p className="font-black text-base text-gray-900">
                    App Store
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Rating */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={16}
                    fill="#FECB19"
                    style={{ color: "#FECB19" }}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-white">4.8 / 5</span>
              <span
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                — 2,400+ ratings
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
