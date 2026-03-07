"use client";

import { motion } from "motion/react";
import { Star, Shield, Wifi, Download, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const features = [
  {
    emoji: "🤖",
    title: "AI Trip Planner",
    desc: "Describe your dream trip in plain language. Get a full itinerary, matched properties, and budget estimate in seconds.",
  },
  {
    emoji: "📵",
    title: "Offline Mode",
    desc: "Pre-download your itinerary, property details, and maps before heading into low-signal areas.",
  },
  {
    emoji: "💬",
    title: "Direct Host Chat",
    desc: "Message your host before and during your stay. Ask about food, activities, local transport, and more.",
  },
  {
    emoji: "📅",
    title: "Live Availability",
    desc: "Real-time calendar with instant booking confirmation. No waiting for manual approval in most properties.",
  },
  {
    emoji: <Wifi size={20} />,
    title: "Smart Filters",
    desc: "Filter by 40+ attributes: Wi-Fi, home-cooked meals, pet-friendly, pickup/drop, river access, and more.",
  },
  {
    emoji: "🔒",
    title: "Secure Payments",
    desc: "Pay via UPI, debit/credit card, or wallet. All transactions are encrypted and PCI-DSS compliant.",
  },
  {
    emoji: "⭐",
    title: "Verified Reviews",
    desc: "Multi-dimensional reviews: hospitality, location, cleanliness, food, value. Only from confirmed guests.",
  },
  {
    emoji: "📍",
    title: "Map Discovery",
    desc: "Browse properties on a map. Zoom into any region and find stays near your planned route.",
  },
];

const screenshots = [
  { label: "Explore", emoji: "🏡", bg: "#1a1a2e" },
  { label: "AI Planner", emoji: "🤖", bg: "#0f1a0a" },
  { label: "Bookings", emoji: "📅", bg: "#1a0533" },
  { label: "Earnings", emoji: "💰", bg: "#1a1000" },
];

const stats = [
  { n: "4.8", label: "App Store rating", sub: "2,400+ reviews" },
  { n: "10K+", label: "Active users", sub: "Monthly" },
  { n: "3,200+", label: "Properties", sub: "Available to book" },
  { n: "23", label: "Districts", sub: "Across India" },
];

export default function DownloadPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden pt-28 pb-24 text-center"
          style={{
            background:
              "linear-gradient(160deg,#0A0A0A 0%,#1a1205 60%,#0A0A0A 100%)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(254,203,25,0.16) 0%, transparent 65%)",
            }}
          />
          <div className="container relative z-10">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              style={{
                background: "rgba(254,203,25,0.12)",
                color: "#FECB19",
                border: "1px solid rgba(254,203,25,0.25)",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Download size={14} /> Get the App
            </motion.div>
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              India&apos;s off-beat
              <br />
              <span className="text-gradient">travel app</span>
            </motion.h1>
            <motion.p
              className="text-xl max-w-xl mx-auto mb-12"
              style={{ color: "rgba(255,255,255,0.55)" }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              3,200+ rural homestays, farms, campsites & eco-lodges. AI-powered
              trip planning. Works offline. Download now.
            </motion.p>

            {/* App store buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="#"
                className="flex items-center gap-4 px-7 py-4 rounded-2xl transition-all hover:opacity-90 hover:scale-105"
                style={{ background: "#fff", minWidth: "220px" }}
              >
                <span className="text-4xl">📱</span>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Get it on</p>
                  <p className="font-black text-lg text-gray-900">
                    Google Play
                  </p>
                </div>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-4 px-7 py-4 rounded-2xl transition-all hover:opacity-90 hover:scale-105"
                style={{ background: "#fff", minWidth: "220px" }}
              >
                <span className="text-4xl">🍎</span>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Download on the</p>
                  <p className="font-black text-lg text-gray-900">App Store</p>
                </div>
              </Link>
            </motion.div>

            {/* Rating */}
            <motion.div
              className="flex items-center justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={18}
                    fill="#FECB19"
                    style={{ color: "#FECB19" }}
                  />
                ))}
              </div>
              <span className="text-white font-bold">4.8 / 5</span>
              <span
                style={{ color: "rgba(255,255,255,0.4)" }}
                className="text-sm"
              >
                — 2,400+ ratings
              </span>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12" style={{ background: "#FECB19" }}>
          <div className="container">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <p className="text-4xl font-black text-gray-900">{s.n}</p>
                  <p className="font-bold text-gray-900 text-sm mt-0.5">
                    {s.label}
                  </p>
                  <p className="text-xs text-gray-700">{s.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Screenshots mockup */}
        <section className="section" style={{ background: "#0A0A0A" }}>
          <div className="container">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Beautifully designed for travellers
              </h2>
              <p style={{ color: "rgba(255,255,255,0.5)" }}>
                Every screen crafted to make rural travel easy and joyful
              </p>
            </motion.div>
            <div className="flex flex-wrap justify-center gap-6">
              {screenshots.map((s, i) => (
                <motion.div
                  key={s.label}
                  className="relative overflow-hidden"
                  style={{
                    width: "200px",
                    height: "400px",
                    background: s.bg,
                    borderRadius: "2.5rem",
                    border: "2px solid rgba(255,255,255,0.1)",
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="p-4 flex flex-col h-full">
                    <div className="h-1.5 w-12 bg-white/20 rounded-full mx-auto mt-2 mb-5" />
                    <p className="text-xs font-bold uppercase tracking-widest text-white/40 text-center mb-2">
                      {s.label}
                    </p>
                    <div className="flex items-center justify-center flex-1 text-6xl">
                      {s.emoji}
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-2 bg-white/10 rounded-full" />
                      <div className="h-2 bg-white/10 rounded-full w-3/4" />
                    </div>
                    <div
                      className="h-10 rounded-xl"
                      style={{
                        background: "linear-gradient(135deg,#FECB19,#F95622)",
                      }}
                    />
                    <div className="mt-3 h-1.5 w-10 rounded-full bg-white/30 mx-auto mb-2" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section" style={{ background: "#fff" }}>
          <div className="container">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
                Everything you need
              </h2>
              <p className="text-gray-600 text-lg">
                Built specifically for India&apos;s rural and off-beat travel
                landscape
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  className="p-6 rounded-2xl"
                  style={{ background: "#f7f7f7", border: "1px solid #ebebeb" }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <div className="text-3xl mb-4">
                    {typeof f.emoji === "string" ? f.emoji : f.emoji}
                  </div>
                  <h3 className="font-black text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="section" style={{ background: "#F1EFEA" }}>
          <div className="container max-w-3xl">
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-black text-gray-900 mb-3">
                Safe, secure, supported
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                {
                  icon: <Shield size={24} style={{ color: "#22c55e" }} />,
                  title: "SSL Encrypted",
                  desc: "All data and payment information is encrypted end-to-end.",
                },
                {
                  icon: <Star size={24} style={{ color: "#FECB19" }} />,
                  title: "Verified Properties",
                  desc: "Every listing is physically visited and verified by a Bayaroo agent.",
                },
                {
                  icon: <Download size={24} style={{ color: "#6366f1" }} />,
                  title: "Free to Download",
                  desc: "The Bayaroo app is completely free. No subscription required to browse or book.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  className="bg-white rounded-2xl p-6 text-center"
                  style={{ border: "1px solid #efefef" }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex justify-center mb-3">{item.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section" style={{ background: "#0A0A0A" }}>
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-black text-white mb-4">
                Download Bayaroo today
              </h2>
              <p
                className="text-lg mb-10 max-w-md mx-auto"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Start exploring 3,200+ off-beat stays across India. Free to
                download, free to browse.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="#"
                  className="flex items-center gap-4 px-7 py-4 rounded-2xl transition-all hover:opacity-90"
                  style={{ background: "#fff", minWidth: "220px" }}
                >
                  <span className="text-4xl">📱</span>
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Get it on</p>
                    <p className="font-black text-lg text-gray-900">
                      Google Play
                    </p>
                  </div>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-7 py-4 rounded-2xl transition-all hover:opacity-90"
                  style={{ background: "#fff", minWidth: "220px" }}
                >
                  <span className="text-4xl">🍎</span>
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Download on the</p>
                    <p className="font-black text-lg text-gray-900">
                      App Store
                    </p>
                  </div>
                </Link>
              </div>
              <p
                className="mt-8 text-sm"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Or{" "}
                <Link
                  href="/explore"
                  className="underline"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  explore on web
                </Link>{" "}
                — no download required
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
