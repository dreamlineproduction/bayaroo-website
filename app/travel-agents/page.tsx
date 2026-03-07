"use client";

import { motion } from "motion/react";
import {
  Briefcase,
  BarChart3,
  Sparkles,
  Users,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Globe,
  Star,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const howItWorks = [
  {
    step: "01",
    title: "Build your package portfolio",
    desc: "Use our AI-powered package builder to create curated tours. Add itineraries, accommodation options, pricing tiers, and inclusions. Publish in minutes.",
    features: [
      "Drag-and-drop itinerary builder",
      "AI-generated day plans",
      "Multi-tier pricing (budget/premium)",
      "Unlimited package listings",
    ],
    color: "#6366f1",
    emoji: "📦",
  },
  {
    step: "02",
    title: "Get AI-matched leads",
    desc: "Our AI matches traveller intent with your packages. Get hot leads sent directly to your dashboard — people already planning trips in your destinations.",
    features: [
      "Intent-based lead scoring",
      "Push notifications for new leads",
      "Lead CRM dashboard",
      "WhatsApp integration",
    ],
    color: "#FECB19",
    emoji: "🎯",
  },
  {
    step: "03",
    title: "Close, earn & grow",
    desc: "Manage all enquiries, bookings, and payments in one place. Track revenue, commissions, and build a 5-star reputation on the Bayaroo platform.",
    features: [
      "Unified booking dashboard",
      "Team sub-accounts",
      "Revenue analytics",
      "Priority listing for top agents",
    ],
    color: "#F95622",
    emoji: "💰",
  },
];

const features = [
  {
    icon: <Sparkles size={20} />,
    title: "AI Package Builder",
    desc: "Describe a trip in plain text and our AI generates a full itinerary, day-plan, and inclusions list for you to refine.",
    color: "#a855f7",
  },
  {
    icon: <Users size={20} />,
    title: "Lead Marketplace",
    desc: "Access a live feed of qualified travellers looking for packaged experiences in your focus regions. Filter by destination, budget & travel dates.",
    color: "#0ea5e9",
  },
  {
    icon: <BarChart3 size={20} />,
    title: "Revenue Dashboard",
    desc: "Track bookings, revenue, commissions, and conversion rates across all your packages. Export reports for your accounts.",
    color: "#22c55e",
  },
  {
    icon: <Globe size={20} />,
    title: "Your Agent Profile",
    desc: "Your public profile showcases your package portfolio, ratings, specialisations, and verified experience. Build trust with travellers.",
    color: "#f97316",
  },
  {
    icon: <Briefcase size={20} />,
    title: "B2B Tools",
    desc: "Partner with other agents, split bookings, manage group travel, and access wholesale rates on Bayaroo properties.",
    color: "#ec4899",
  },
  {
    icon: <TrendingUp size={20} />,
    title: "Performance Insights",
    desc: "See which packages perform best, peak seasons, average booking value, and actionable recommendations to grow revenue.",
    color: "#FECB19",
  },
];

const tiers = [
  {
    name: "Starter",
    price: "Free",
    sub: "Perfect to begin",
    features: [
      "Up to 5 package listings",
      "Basic lead access",
      "Standard agent profile",
      "Email support",
      "10% commission on bookings",
    ],
    highlight: false,
    cta: "Start Free",
  },
  {
    name: "Pro",
    price: "₹999/month",
    sub: "For active agents",
    features: [
      "Unlimited package listings",
      "Priority AI-matched leads",
      "Featured agent profile",
      "WhatsApp + chat support",
      "7% commission on bookings",
      "Team sub-accounts (up to 3)",
      "Revenue analytics",
    ],
    highlight: true,
    cta: "Go Pro",
  },
  {
    name: "Agency",
    price: "₹3,499/month",
    sub: "For established agencies",
    features: [
      "Everything in Pro",
      "Unlimited team accounts",
      "Dedicated account manager",
      "Exclusive bulk inventory access",
      "5% commission on bookings",
      "Custom branded itineraries",
      "API access",
    ],
    highlight: false,
    cta: "Contact Sales",
  },
];

const testimonials = [
  {
    name: "Rajeev Malhotra",
    biz: "Himalayan Escapes, Shimla",
    text: "Bayaroo's lead system is the best I've used. Instead of cold calling, I now get notified when someone is actively planning a Spiti or Manali trip. Revenue up 4× since joining.",
    rating: 5,
  },
  {
    name: "Parvati Nair",
    biz: "Kerala Trails, Kochi",
    text: "The AI package builder is incredible. What used to take me 3 hours to put together — I now do in 20 minutes. My catalogue went from 5 packages to 40+.",
    rating: 5,
  },
  {
    name: "Naresh Garg",
    biz: "Rajasthan Roots Agency",
    text: "I use the B2B split booking feature to partner with homestay owners directly on Bayaroo. Better margins and zero coordination chaos.",
    rating: 5,
  },
];

export default function TravelAgentsPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden pt-28 pb-20"
          style={{
            background:
              "linear-gradient(150deg,#0A0A0A 0%,#0a0520 60%,#0A0A0A 100%)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 40% 30%, rgba(99,102,241,0.15) 0%, transparent 70%)",
            }}
          />
          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5"
                  style={{
                    background: "rgba(99,102,241,0.12)",
                    color: "#818cf8",
                    border: "1px solid rgba(99,102,241,0.25)",
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Briefcase size={14} /> For Travel Agents &amp; Agencies
                </motion.div>
                <motion.h1
                  className="text-5xl sm:text-6xl font-black text-white leading-tight mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Sell more packages.
                  <br />
                  <span style={{ color: "#818cf8" }}>Earn more revenue.</span>
                </motion.h1>
                <motion.p
                  className="text-xl mb-10 max-w-lg"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Access India&apos;s largest catalogue of rural and off-beat
                  properties. Build AI-powered packages. Get matched with
                  qualified traveller leads. All in one platform.
                </motion.p>
                <motion.div
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    href="https://agent.bayaroo.space"
                    className="btn-primary text-base px-7 py-3.5"
                  >
                    Join as Travel Agent <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="#pricing"
                    className="btn-dark text-base px-7 py-3.5"
                  >
                    View Pricing
                  </Link>
                </motion.div>
              </div>
              {/* Stats grid */}
              <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {[
                  { n: "300+", label: "Active agents", emoji: "🧳" },
                  { n: "2,000+", label: "Packages live", emoji: "📦" },
                  { n: "8×", label: "Average ROI vs ads", emoji: "📈" },
                  { n: "48hr", label: "Avg lead response", emoji: "⚡" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl p-6 text-center"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <div className="text-3xl mb-2">{s.emoji}</div>
                    <p className="text-2xl font-black text-white">{s.n}</p>
                    <p
                      className="text-sm"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="section" style={{ background: "#fff" }}>
          <div className="container">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
                How Bayaroo works for agents
              </h2>
              <p className="text-gray-600 text-lg">
                From sign-up to first booking in hours, not days
              </p>
            </motion.div>
            <div className="space-y-8">
              {howItWorks.map((step, i) => (
                <motion.div
                  key={step.step}
                  className="grid lg:grid-cols-2 gap-10 items-start p-8 rounded-3xl"
                  style={{ background: "#f8f8f8", border: "1px solid #efefef" }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div>
                    <div className="flex items-center gap-4 mb-5">
                      <span
                        className="text-5xl font-black"
                        style={{ color: step.color }}
                      >
                        {step.step}
                      </span>
                      <h3 className="text-2xl font-black text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {step.features.map((f) => (
                      <div key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle
                          size={16}
                          style={{
                            color: step.color,
                            flexShrink: 0,
                            marginTop: 2,
                          }}
                        />
                        <span className="text-gray-700">{f}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section" style={{ background: "#0A0A0A" }}>
          <div className="container">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                A full agent toolkit
              </h2>
              <p style={{ color: "rgba(255,255,255,0.5)" }}>
                Everything you need to run a modern travel business
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  className="p-7 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: `${f.color}22`, color: f.color }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-black text-white mb-2">
                    {f.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section
          id="pricing"
          className="section"
          style={{ background: "#F1EFEA" }}
        >
          <div className="container">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
                Simple, transparent pricing
              </h2>
              <p className="text-gray-600 text-lg">
                Start free. Upgrade when ready.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6 items-start">
              {tiers.map((tier, i) => (
                <motion.div
                  key={tier.name}
                  className={`rounded-3xl p-8 ${tier.highlight ? "shadow-2xl scale-105" : ""}`}
                  style={{
                    background: tier.highlight ? "#0A0A0A" : "#fff",
                    border: tier.highlight
                      ? "2px solid #FECB19"
                      : "1px solid #efefef",
                  }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  {tier.highlight && (
                    <div className="text-center mb-5">
                      <span className="badge badge-yellow px-4 py-1.5 text-sm">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <h3
                    className={`text-xl font-black mb-1 ${tier.highlight ? "text-white" : "text-gray-900"}`}
                  >
                    {tier.name}
                  </h3>
                  <p
                    className={`text-sm mb-4 ${tier.highlight ? "text-white/50" : "text-gray-500"}`}
                  >
                    {tier.sub}
                  </p>
                  <p
                    className={`text-3xl font-black mb-6 ${tier.highlight ? "text-white" : "text-gray-900"}`}
                  >
                    {tier.price}
                  </p>
                  <div className="space-y-3 mb-8">
                    {tier.features.map((f) => (
                      <div key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle
                          size={15}
                          style={{
                            color: tier.highlight ? "#FECB19" : "#22c55e",
                            flexShrink: 0,
                            marginTop: 2,
                          }}
                        />
                        <span
                          style={{
                            color: tier.highlight
                              ? "rgba(255,255,255,0.7)"
                              : "#4b5563",
                          }}
                        >
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="https://agent.bayaroo.space"
                    className={`block text-center font-bold py-3 rounded-xl transition-all ${tier.highlight ? "btn-primary" : "btn-dark"}`}
                  >
                    {tier.cta}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section" style={{ background: "#fff" }}>
          <div className="container">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-black text-gray-900 mb-3">
                Agents who transformed their business
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  className="rounded-2xl p-7"
                  style={{ background: "#f7f7f7", border: "1px solid #efefef" }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, n) => (
                      <Star
                        key={n}
                        size={14}
                        fill="#FECB19"
                        style={{ color: "#FECB19" }}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-5">
                    "{t.text}"
                  </p>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.biz}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="section"
          style={{ background: "linear-gradient(135deg,#0A0A0A,#1a0533)" }}
        >
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-black text-white mb-4">
                Ready to grow your agency?
              </h2>
              <p
                className="text-lg mb-8 max-w-xl mx-auto"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Join 300+ travel agents already using Bayaroo to access
                India&apos;s best rural inventory and AI-matched leads.
              </p>
              <Link
                href="https://agent.bayaroo.space"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-3"
              >
                Apply as Travel Agent <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
