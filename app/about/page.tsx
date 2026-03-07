"use client";

import { motion } from "motion/react";
import { Heart, Target, Zap, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const milestones = [
  {
    year: "2022",
    title: "A dream born in lockdown",
    desc: "While the world stood still during COVID, Ayan and his friend Uttaran turned the boredom of being stuck at home into something meaningful — sketching out the idea for a platform that would make off-beat travel in India truly accessible.",
    emoji: "💡",
    future: false,
  },
  {
    year: "2023",
    title: "First prototype designed",
    desc: "The vision took shape. The team completed designing the first prototype of Bayaroo — a unified platform for rural stays, transport, and experiences. The idea was clear; now it needed to become real.",
    emoji: "🎨",
    future: false,
  },
  {
    year: "Q4 2023",
    title: "Bayaroo incorporated",
    desc: "Ayan officially incorporated Bayaroo Space Private Limited alongside his wife, while Uttaran stepped in as Lead Creative Head. A dream became a company.",
    emoji: "🏢",
    future: false,
  },
  {
    year: "Q1 2024",
    title: "First travel operations",
    desc: "Bayaroo began operating as a travel agency, curating and selling handcrafted tour packages across West Bengal. Real travellers, real trips, real feedback — the foundation of everything we'd build next.",
    emoji: "🗺️",
    future: false,
  },
  {
    year: "Q4 2024",
    title: "First homestay — Lamahatta, Darjeeling",
    desc: "We took our first leased homestay in Lamahatta, a quiet village above Darjeeling. This was the moment Bayaroo stopped being just a booking platform and became a hospitality brand with skin in the game.",
    emoji: "🏡",
    future: false,
  },
  {
    year: "Q1 2025",
    title: "First cab in North Bengal",
    desc: "Launched our first Bayaroo cab in North Bengal, tackling one of the biggest pain points in off-beat travel — last-mile connectivity. We also began building the mobile app and website in parallel.",
    emoji: "🚕",
    future: false,
  },
  {
    year: "Q4 2025",
    title: "Website & mobile app developed",
    desc: "After months of design and development, the Bayaroo website and mobile app came to life — bringing together stays, transport, and experiences in one seamless platform.",
    emoji: "📱",
    future: false,
  },
  {
    year: "Q1 2026",
    title: "Bayaroo Agent Program launched",
    desc: "Introduced the Bayaroo Agent Program — empowering local people across districts to earn by discovering, onboarding, and managing properties. A community-powered growth model, unique to Bayaroo.",
    emoji: "🤝",
    future: false,
  },
  {
    year: "Q2 2026",
    title: "100+ properties in West Bengal",
    desc: "Building our home state first — listing 100+ verified properties across West Bengal, from the hills of Darjeeling to the mangroves of Sundarbans and the jungles of Dooars.",
    emoji: "📍",
    future: true,
  },
  {
    year: "Q3 2026",
    title: "300+ properties across India",
    desc: "Expanding beyond West Bengal to list 300+ properties pan-India — bringing Bayaroo's quality and trust to travellers heading to hills, coasts, forests, and heritage heartlands across the country.",
    emoji: "🗺️",
    future: true,
  },
  {
    year: "Q4 2026",
    title: "Mobile app public launch",
    desc: "Official launch of the Bayaroo app on the App Store and Google Play — giving every traveller in India a single, powerful tool to plan, book, and experience off-beat India.",
    emoji: "🚀",
    future: true,
  },
  {
    year: "2027",
    title: "The full ecosystem",
    desc: "A landmark year: rolling out Central Ticketing for parks and attractions, a Local Guide Program, Local Events & Cultural Programs, and a Foods Boost Program connecting travellers with regional cuisine and local producers. Bayaroo becomes the complete infrastructure for rural tourism in India.",
    emoji: "🌏",
    future: true,
  },
];

const values = [
  {
    icon: <Heart size={22} />,
    title: "Authentic, always",
    desc: "We list only genuine rural and off-beat properties. No fake 'rural' hotels in city outskirts. We visit every property personally.",
    color: "#ec4899",
  },
  {
    icon: <Target size={22} />,
    title: "Rural first",
    desc: "Every feature, every decision is made with rural hosts and local communities in mind. Technology that empowers, not displaces.",
    color: "#FECB19",
  },
  {
    icon: <Users size={22} />,
    title: "Community-owned growth",
    desc: "Our field agent model means local people in every district build and benefit from the Bayaroo network. This isn't extractive — it's participatory.",
    color: "#6366f1",
  },
  {
    icon: <Zap size={22} />,
    title: "Simple & accessible",
    desc: "Off-beat destinations often have poor connectivity. Our offline-first app works in the hills, the forests, and the deltas.",
    color: "#F95622",
  },
];

const team = [
  {
    name: "Ayan Mukhopadhyay",
    role: "Founder & CEO",
    location: "Kolkata, West Bengal",
    emoji: "👨‍💻",
    bio: "BSc IT from Sikkim Manipal University. Started in media as an editor, then built a web agency in Kolkata — which took him across India's most beautiful off-beat destinations. Saw the broken system firsthand, and built Bayaroo to fix it.",
  },
];

const press = [
  {
    outlet: "YourStory",
    headline:
      "Bayaroo is building the Airbnb for rural India — and it's working",
    year: "2024",
  },
  {
    outlet: "Economic Times",
    headline:
      "How a Kolkata startup is creating livelihoods in India's remote districts",
    year: "2024",
  },
  {
    outlet: "Outlook Traveller",
    headline: "10 off-beat India stays you can only find on Bayaroo",
    year: "2023",
  },
  {
    outlet: "Inc42",
    headline:
      "Bayaroo raises seed round to expand AI-driven rural travel platform",
    year: "2024",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden pt-28 pb-24"
          style={{
            background:
              "linear-gradient(160deg,#0A0A0A 0%,#1a130a 60%,#0A0A0A 100%)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(254,203,25,0.14) 0%, transparent 70%)",
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
              Our Story
            </motion.div>
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              The digital backbone of
              <br />
              <span className="text-gradient">rural tourism</span>
            </motion.h1>
            <motion.p
              className="text-xl max-w-2xl mx-auto"
              style={{ color: "rgba(255,255,255,0.55)" }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Bayaroo integrates stays, mobility, experiences, financial tools,
              and community into one unified ecosystem — making travel simple
              and affordable for everyone.
            </motion.p>
          </div>
        </section>

        {/* Mission */}
        <section className="section" style={{ background: "#F1EFEA" }}>
          <div className="container max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-black text-gray-900 mb-5">
                  Our mission
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-5">
                  Make travel simple and affordable.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We are building a unified travel platform where travellers can
                  discover, book, and manage everything — stays, transport,
                  activities, and experiences — in one seamless ecosystem, while
                  empowering local hosts to earn fairly.
                </p>
                <p className="text-gray-600 leading-relaxed font-semibold">
                  Bayaroo is not just a booking app. It&apos;s infrastructure
                  for the future of travel in emerging destinations.
                </p>
              </motion.div>
              <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                {[
                  { n: "3,200+", label: "Properties live", color: "#FECB19" },
                  { n: "23", label: "Districts covered", color: "#F95622" },
                  { n: "300+", label: "Field agents", color: "#6366f1" },
                  { n: "₹12L+", label: "Paid to agents", color: "#22c55e" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white rounded-2xl p-6 text-center"
                    style={{ border: "1px solid #efefef" }}
                  >
                    <p
                      className="text-3xl font-black mb-1"
                      style={{ color: s.color }}
                    >
                      {s.n}
                    </p>
                    <p className="text-sm text-gray-600">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section" style={{ background: "#0A0A0A" }}>
          <div className="container">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                What we stand for
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 gap-6">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  className="flex gap-5 p-7 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${v.color}20`, color: v.color }}
                  >
                    {v.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg mb-2">
                      {v.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                      {v.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products & Revenue */}
        <section className="section" style={{ background: "#fff" }}>
          <div className="container">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
                What we offer
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                One ecosystem for everything a traveller needs — and everything
                a host deserves.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-10 items-start">
              {/* Products */}
              <motion.div
                className="rounded-3xl p-8"
                style={{ background: "#F1EFEA", border: "1px solid #e8e5df" }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-black text-gray-900 mb-6">
                  🧩 Products
                </h3>
                <div className="flex flex-col gap-3">
                  {[
                    {
                      emoji: "🏡",
                      label: "Homestays, Resorts, Domes, Tents & Hostels",
                    },
                    { emoji: "🚕", label: "Rural Cab & Last-Mile Transport" },
                    { emoji: "🚲", label: "Bike Rentals" },
                    { emoji: "🎟️", label: "Activity Ticketing" },
                    { emoji: "🧭", label: "Local Guides" },
                    { emoji: "🎉", label: "Local Events" },
                    { emoji: "🗺️", label: "Tour Packages" },
                  ].map((p) => (
                    <div key={p.label} className="flex items-center gap-3">
                      <span className="text-xl w-8 shrink-0">{p.emoji}</span>
                      <span className="text-gray-700 font-medium text-sm">
                        {p.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Revenue */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div
                  className="rounded-3xl p-8 mb-6"
                  style={{ background: "#0A0A0A" }}
                >
                  <h3 className="text-xl font-black text-white mb-6">
                    💰 Revenue Model
                  </h3>
                  <div className="flex flex-col gap-5">
                    <div
                      className="rounded-2xl p-5"
                      style={{
                        background: "rgba(254,203,25,0.1)",
                        border: "1px solid rgba(254,203,25,0.2)",
                      }}
                    >
                      <p
                        className="font-black text-sm mb-1"
                        style={{ color: "#FECB19" }}
                      >
                        Low Commission (5–8%)
                      </p>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        Per booking on stays and transport. Far below industry
                        average — so hosts earn more and travelers pay less.
                      </p>
                    </div>
                    <div
                      className="rounded-2xl p-5"
                      style={{
                        background: "rgba(249,86,34,0.1)",
                        border: "1px solid rgba(249,86,34,0.2)",
                      }}
                    >
                      <p
                        className="font-black text-sm mb-1"
                        style={{ color: "#F95622" }}
                      >
                        Margin-Based Pricing
                      </p>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        For tours and activities — we curate and price packages
                        ourselves, giving predictable earnings for partners.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      label: "📈 Scales with transaction volume",
                      color: "#FECB19",
                    },
                    { label: "🚀 Drives user growth", color: "#F95622" },
                  ].map((t) => (
                    <div
                      key={t.label}
                      className="rounded-2xl p-4 text-sm font-bold text-gray-800"
                      style={{
                        background: "#F1EFEA",
                        border: "1px solid #e8e5df",
                      }}
                    >
                      {t.label}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Founder Story */}
        <section className="section" style={{ background: "#0A0A0A" }}>
          <div className="container max-w-3xl">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
                style={{
                  background: "rgba(254,203,25,0.12)",
                  color: "#FECB19",
                  border: "1px solid rgba(254,203,25,0.25)",
                }}
              >
                Founder&apos;s Story
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Why I started Bayaroo
              </h2>
            </motion.div>
            <motion.div
              className="rounded-3xl p-8 sm:p-12"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shrink-0"
                  style={{
                    background: "rgba(254,203,25,0.15)",
                    border: "1px solid rgba(254,203,25,0.3)",
                  }}
                >
                  👨‍💻
                </div>
                <div>
                  <p className="font-black text-white text-lg">
                    Ayan Mukhopadhyay
                  </p>
                  <p className="text-sm" style={{ color: "#FECB19" }}>
                    Founder & CEO, Bayaroo
                  </p>
                </div>
              </div>
              <div
                className="space-y-5"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                <p className="leading-relaxed">
                  I grew up in West Bengal and built my foundation in technology
                  with a BSc in IT from Sikkim Manipal University. I began my
                  career in media as an editor, then started my own web agency
                  in Kolkata — which allowed me to travel extensively across
                  India with my wife, especially to off-beat destinations.
                </p>
                <p
                  className="text-lg font-bold leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.9)" }}
                >
                  During those travels, I saw something broken.
                </p>
                <p className="leading-relaxed">
                  Hidden gems existed everywhere — beautiful homestays run by
                  honest local owners — but they were invisible online. Guests
                  couldn&apos;t discover them easily. When they did book through
                  third-party platforms, they paid ₹2,200 per night while the
                  homestay owner received barely ₹900–1,000. Expectations were
                  high, margins were thin, and both sides were dissatisfied.
                </p>
                <p className="leading-relaxed">
                  Beyond stays, the problems were bigger — unorganized cab
                  syndicates, no centralized booking for parks, toy trains,
                  activities, or local experiences. Travel in off-beat India was
                  fragmented, expensive, and unnecessarily complicated.
                </p>
                <div
                  className="rounded-2xl p-6 my-6"
                  style={{
                    background: "rgba(254,203,25,0.08)",
                    border: "1px solid rgba(254,203,25,0.2)",
                  }}
                >
                  <p
                    className="text-lg font-black leading-relaxed"
                    style={{ color: "#FECB19" }}
                  >
                    &ldquo;I didn&apos;t just see a problem. I saw an
                    opportunity. That&apos;s why I started Bayaroo.&rdquo;
                  </p>
                </div>
                <p className="leading-relaxed">
                  Our mission is simple:{" "}
                  <span className="font-bold text-white">
                    Make travel simple and affordable.
                  </span>{" "}
                  We are building a unified travel platform where travelers can
                  discover, book, and manage everything in one seamless
                  ecosystem — while empowering local hosts to earn fairly.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section" style={{ background: "#fff" }}>
          <div className="container max-w-3xl">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
                Our journey &amp; roadmap
              </h2>
              <p className="text-gray-500 text-sm">
                From a COVID lockdown dream to India&apos;s rural travel
                ecosystem
              </p>
            </motion.div>

            {/* History */}
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
              <span
                className="w-4 h-0.5 inline-block"
                style={{ background: "#FECB19" }}
              />
              Our history
            </p>
            <div className="relative mb-14">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100" />
              <div className="space-y-10">
                {milestones
                  .filter((m) => !m.future)
                  .map((m, i) => (
                    <motion.div
                      key={m.year + m.title}
                      className="flex gap-8"
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <div
                        className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl z-10"
                        style={{ background: "#FECB19" }}
                      >
                        {m.emoji}
                      </div>
                      <div className="pt-2">
                        <p
                          className="text-xs font-black uppercase tracking-widest mb-1"
                          style={{ color: "#F95622" }}
                        >
                          {m.year}
                        </p>
                        <h3 className="font-black text-gray-900 text-lg mb-2">
                          {m.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {m.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>

            {/* Roadmap */}
            <p
              className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2"
              style={{ color: "#6366f1" }}
            >
              <span
                className="w-4 h-0.5 inline-block"
                style={{ background: "#6366f1" }}
              />
              Roadmap ahead
            </p>
            <div className="relative">
              <div
                className="absolute left-6 top-0 bottom-0 w-0.5"
                style={{ background: "rgba(99,102,241,0.15)" }}
              />
              <div className="space-y-10">
                {milestones
                  .filter((m) => m.future)
                  .map((m, i) => (
                    <motion.div
                      key={m.year + m.title}
                      className="flex gap-8"
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <div
                        className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl z-10 border-2 border-dashed"
                        style={{
                          background: "rgba(99,102,241,0.08)",
                          borderColor: "rgba(99,102,241,0.4)",
                        }}
                      >
                        {m.emoji}
                      </div>
                      <div className="pt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <p
                            className="text-xs font-black uppercase tracking-widest"
                            style={{ color: "#6366f1" }}
                          >
                            {m.year}
                          </p>
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{
                              background: "rgba(99,102,241,0.1)",
                              color: "#6366f1",
                            }}
                          >
                            Upcoming
                          </span>
                        </div>
                        <h3 className="font-black text-gray-900 text-lg mb-2">
                          {m.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                          {m.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="section" style={{ background: "#F1EFEA" }}>
          <div className="container">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-black text-gray-900 mb-3">
                Meet the founder
              </h2>
              <p className="text-gray-600">
                Built from experience, passion, and a conviction that rural
                India deserves better
              </p>
            </motion.div>
            <div className="flex justify-center">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  className="bg-white rounded-2xl p-8 text-center max-w-sm w-full"
                  style={{ border: "1px solid #efefef" }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"
                    style={{ background: "#f3f3f3" }}
                  >
                    {member.emoji}
                  </div>
                  <h3 className="font-black text-gray-900 text-xl">
                    {member.name}
                  </h3>
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{ color: "#F95622" }}
                  >
                    {member.role}
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    📍 {member.location}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {member.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Press */}
        <section className="section" style={{ background: "#0A0A0A" }}>
          <div className="container">
            <motion.p
              className="text-center text-sm font-bold uppercase tracking-widest mb-10"
              style={{ color: "rgba(255,255,255,0.4)" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              As seen in
            </motion.p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {press.map((p, i) => (
                <motion.div
                  key={p.outlet}
                  className="rounded-2xl p-6"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <p className="font-black text-white mb-3">{p.outlet}</p>
                  <p
                    className="text-sm italic leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    &ldquo;{p.headline}&rdquo;
                  </p>
                  <p
                    className="text-xs mt-3"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {p.year}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section" style={{ background: "#FECB19" }}>
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                Be part of the story
              </h2>
              <p className="text-lg text-gray-800 mb-8 max-w-xl mx-auto">
                Whether you&apos;re a traveller, property owner, travel agent,
                or aspiring field agent — there&apos;s a place for you in the
                Bayaroo community.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-black bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                >
                  Start Exploring <ArrowRight size={18} />
                </Link>
                <Link
                  href="/become-agent"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-black"
                  style={{ background: "rgba(0,0,0,0.12)", color: "#1a1a1a" }}
                >
                  Become an Agent
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
