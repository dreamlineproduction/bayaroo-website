"use client";

import { motion } from "motion/react";
import {
  MapPin,
  IndianRupee,
  Clock,
  ArrowRight,
  CheckCircle,
  Star,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const howItWorks = [
  {
    step: "01",
    icon: "📝",
    title: "Apply online in 5 minutes",
    desc: "Fill out a simple form with your name, location, and basic details. No experience needed — we train you completely.",
    color: "#FECB19",
  },
  {
    step: "02",
    icon: "📚",
    title: "Complete our free training",
    desc: "Learn how to find properties, conduct visits, take photos, and onboard hosts using the Bayaroo Agent App. All self-paced, all free.",
    color: "#F95622",
  },
  {
    step: "03",
    icon: "📍",
    title: "Activate your district",
    desc: "Get assigned to your district. Start visiting properties and onboarding them on the Bayaroo platform using your mobile app.",
    color: "#22c55e",
  },
  {
    step: "04",
    icon: "💰",
    title: "Earn for every booking",
    desc: "Earn a commission every time any property you onboarded gets a booking — for the entire duration they remain on the platform.",
    color: "#6366f1",
  },
];

const earnings = [
  {
    label: "Onboarding bonus",
    amount: "₹500",
    per: "per property verified",
    color: "#FECB19",
  },
  {
    label: "Booking commission",
    amount: "4–8%",
    per: "of every booking value",
    color: "#F95622",
  },
  {
    label: "Monthly active bonus",
    amount: "₹2,000+",
    per: "for top agents / month",
    color: "#22c55e",
  },
  {
    label: "Referral bonus",
    amount: "₹200",
    per: "per new agent you refer",
    color: "#6366f1",
  },
];

const agentTools = [
  {
    emoji: "📱",
    title: "Agent Mobile App",
    desc: "A dedicated Bayaroo agent app with all the tools you need: property onboarding, photo upload, visit scheduling, and earnings tracker.",
  },
  {
    emoji: "🗺",
    title: "District Map",
    desc: "See all properties in your district on a map. Identify gaps, plan your routes, and maximise your earning potential.",
  },
  {
    emoji: "📸",
    title: "Photo Guidance",
    desc: "In-app photography tips and checklists ensure every property you onboard has great photos and gets booked faster.",
  },
  {
    emoji: "💬",
    title: "Community Chat",
    desc: "Connect with other Bayaroo agents in your state. Share tips, ask questions, and grow together.",
  },
  {
    emoji: "📊",
    title: "Earnings Dashboard",
    desc: "Track your properties, pending commissions, total earned, and performance rank. Know exactly what you've earned and when it arrives.",
  },
  {
    emoji: "🎓",
    title: "Training Library",
    desc: "Ongoing modules on sales, hospitality standards, photography, and platform updates. All free, all accessible offline.",
  },
];

const districts = [
  {
    state: "West Bengal",
    districts: [
      "Darjeeling",
      "Kalimpong",
      "Jalpaiguri",
      "Alipurduar",
      "Birbhum",
    ],
  },
  {
    state: "Himachal Pradesh",
    districts: ["Spiti", "Kinnaur", "Kullu", "Lahaul", "Kangra"],
  },
  {
    state: "Uttarakhand",
    districts: ["Chamoli", "Rudraprayag", "Pithoragarh", "Uttarkashi", "Tehri"],
  },
  {
    state: "Karnataka",
    districts: [
      "Kodagu",
      "Chikmagalur",
      "Shivamogga",
      "Hassan",
      "Dakshina Kannada",
    ],
  },
  {
    state: "Kerala",
    districts: ["Idukki", "Wayanad", "Kollam", "Pathanamthitta", "Thrissur"],
  },
  {
    state: "Assam",
    districts: ["Majuli", "Jorhat", "Tezpur", "Kaziranga", "Barak Valley"],
  },
];

const testimonials = [
  {
    name: "Ramesh Kumar",
    location: "Coorg, Karnataka",
    text: "I was a college graduate with no tourism experience. In 6 months as a Bayaroo field agent, I've onboarded 18 properties and earn ₹28,000 a month in passive commissions.",
    rating: 5,
    emoji: "🌿",
    earnings: "₹28K/month",
  },
  {
    name: "Sunita Tamang",
    location: "Darjeeling, West Bengal",
    text: "The app makes it so simple. I visit a homestay, take photos with checklists, fill the form — done. The property goes live in 2 days and I start earning.",
    rating: 5,
    emoji: "🍵",
    earnings: "₹19K/month",
  },
  {
    name: "Birendra Singh",
    location: "Chopta, Uttarakhand",
    text: "I work part-time as a trekking guide and now also as a Bayaroo agent. The two complement perfectly. My district has 11 properties I onboarded — all earning.",
    rating: 5,
    emoji: "⛺",
    earnings: "₹15K/month",
  },
];

export default function BecomeAgentPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden pt-28 pb-24"
          style={{
            background:
              "linear-gradient(150deg,#0A0A0A 0%,#0a0a20 60%,#0A0A0A 100%)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(254,203,25,0.18) 0%, transparent 65%)",
            }}
          />
          <div className="container relative z-10 text-center">
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
              <MapPin size={14} /> For Field Agents
            </motion.div>
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Earn from your
              <br />
              <span className="text-gradient">district forever</span>
            </motion.h1>
            <motion.p
              className="text-xl mb-10 max-w-2xl mx-auto"
              style={{ color: "rgba(255,255,255,0.6)" }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Become a Bayaroo field agent. Find rural properties in your area,
              onboard them to our platform, and earn a commission every time
              they get a booking — forever.
            </motion.p>

            {/* Key numbers */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {[
                { n: "₹500", label: "Onboarding bonus" },
                { n: "4–8%", label: "per booking, lifetime" },
                { n: "₹0", label: "Training cost" },
                { n: "300+", label: "Agents earning now" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl p-4 text-center"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <p
                    className="text-2xl font-black"
                    style={{ color: "#FECB19" }}
                  >
                    {s.n}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="https://agent.bayaroo.space"
                className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-3"
              >
                Apply Now — It&apos;s Free <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="section" style={{ background: "#F1EFEA" }}>
          <div className="container">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
                How it works
              </h2>
              <p className="text-gray-600 text-lg">
                From application to earning in under 7 days
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((step, i) => (
                <motion.div
                  key={step.step}
                  className="relative"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div
                    className="rounded-3xl p-7 h-full bg-white"
                    style={{ border: "1px solid #efefef" }}
                  >
                    <div className="text-4xl mb-4">{step.icon}</div>
                    <div
                      className="text-3xl font-black mb-3"
                      style={{ color: step.color }}
                    >
                      {step.step}
                    </div>
                    <h3 className="font-black text-gray-900 text-lg mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                  {i < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 text-gray-300 z-10 text-xl">
                      ›
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Earnings breakdown */}
        <section className="section" style={{ background: "#0A0A0A" }}>
          <div className="container">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Multiple ways to earn
              </h2>
              <p
                className="text-lg max-w-xl mx-auto"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Build a portfolio of properties. Each one earns passively for
                years.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {earnings.map((e, i) => (
                <motion.div
                  key={e.label}
                  className="p-7 rounded-2xl text-center"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${e.color}30`,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <IndianRupee
                    size={24}
                    style={{ color: e.color, margin: "0 auto 12px" }}
                  />
                  <p
                    className="text-3xl font-black mb-2"
                    style={{ color: e.color }}
                  >
                    {e.amount}
                  </p>
                  <p className="font-bold text-white mb-1">{e.label}</p>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {e.per}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Earning calculator teaser */}
            <motion.div
              className="mt-12 rounded-3xl p-8 text-center"
              style={{
                background: "rgba(254,203,25,0.08)",
                border: "1px solid rgba(254,203,25,0.2)",
              }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-white font-bold text-xl mb-2">
                Example: 20 properties × ₹3,000 avg booking × 2 bookings / month
              </p>
              <p
                className="text-5xl font-black mb-2"
                style={{ color: "#FECB19" }}
              >
                ₹24,000 / month
              </p>
              <p style={{ color: "rgba(255,255,255,0.5)" }}>
                in passive income — from a one-time effort of onboarding each
                property
              </p>
            </motion.div>
          </div>
        </section>

        {/* Agent Tools */}
        <section className="section" style={{ background: "#fff" }}>
          <div className="container">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
                Your agent toolkit
              </h2>
              <p className="text-gray-600 text-lg">
                Everything you need, right in your pocket
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {agentTools.map((tool, i) => (
                <motion.div
                  key={tool.title}
                  className="p-6 rounded-2xl"
                  style={{ background: "#f7f7f7", border: "1px solid #ebebeb" }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <div className="text-3xl mb-4">{tool.emoji}</div>
                  <h3 className="font-black text-gray-900 text-lg mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {tool.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Districts */}
        <section className="section" style={{ background: "#F1EFEA" }}>
          <div className="container">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-black text-gray-900 mb-3">
                We&apos;re across 23 districts and growing
              </h2>
              <p className="text-gray-600">
                Check if your district is open for new agents
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {districts.map((d, i) => (
                <motion.div
                  key={d.state}
                  className="bg-white rounded-2xl p-6"
                  style={{ border: "1px solid #efefef" }}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <h3 className="font-black text-gray-900 mb-3">{d.state}</h3>
                  <div className="flex flex-wrap gap-2">
                    {d.districts.map((dist) => (
                      <span key={dist} className="badge badge-dark text-xs">
                        {dist}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.p
              className="text-center mt-6 text-sm text-gray-500 font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Don&apos;t see your district? Apply anyway — we&apos;re expanding
              every month.
            </motion.p>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section" style={{ background: "#0A0A0A" }}>
          <div className="container">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-black text-white mb-3">
                Hear from our agents
              </h2>
              <p style={{ color: "rgba(255,255,255,0.5)" }}>
                Real people, real earnings, real impact
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  className="rounded-2xl p-7"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, n) => (
                        <Star
                          key={n}
                          size={14}
                          fill="#FECB19"
                          style={{ color: "#FECB19" }}
                        />
                      ))}
                    </div>
                    <span
                      className="text-sm font-black"
                      style={{ color: "#FECB19" }}
                    >
                      {t.earnings}
                    </span>
                  </div>
                  <p
                    className="text-sm leading-relaxed mb-5"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{t.emoji}</span>
                    <div>
                      <p className="text-white font-bold text-sm">{t.name}</p>
                      <p
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.4)" }}
                      >
                        {t.location}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What you need */}
        <section className="section" style={{ background: "#fff" }}>
          <div className="container max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-black text-gray-900 mb-8">
                All you need to get started
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-3 gap-5 mb-12">
              {[
                {
                  icon: <Smartphone size={24} />,
                  label: "An Android or iOS smartphone",
                },
                {
                  icon: <MapPin size={24} />,
                  label: "Be based in a rural / off-beat district",
                },
                {
                  icon: <Clock size={24} />,
                  label: "5–10 hours / week to begin",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl"
                  style={{ background: "#f7f7f7", border: "1px solid #efefef" }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="text-yellow-500">{item.icon}</div>
                  <p className="text-gray-800 font-semibold text-sm text-center">
                    {item.label}
                  </p>
                  <CheckCircle size={18} style={{ color: "#22c55e" }} />
                </motion.div>
              ))}
            </div>
            <Link
              href="https://agent.bayaroo.space"
              className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-3"
            >
              Apply Now — Free <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
