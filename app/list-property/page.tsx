"use client";

import { motion } from "motion/react";
import {
  Building2,
  TrendingUp,
  Shield,
  ArrowRight,
  CheckCircle,
  Star,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const propertyCategories = [
  { emoji: "🏡", label: "Homestay" },
  { emoji: "🌿", label: "Farmstay" },
  { emoji: "⛺", label: "Campsite" },
  { emoji: "🛖", label: "Eco Lodge" },
  { emoji: "🏕", label: "Glamping Site" },
  { emoji: "🗺", label: "Heritage Home" },
  { emoji: "🏚", label: "Village Hut" },
  { emoji: "🚣", label: "River Camp" },
];

const howItWorks = [
  {
    step: "01",
    title: "Register & list your property",
    desc: "Submit your property details through our simple form. One of our local field agents will visit for photos, verification, and onboarding — at no cost to you.",
    features: [
      "Free physical visit by our agent",
      "Professional photography guidance",
      "Listing goes live within 48 hrs",
      "Flexible pricing control",
    ],
    color: "#FECB19",
  },
  {
    step: "02",
    title: "Receive & manage bookings",
    desc: "Travellers discover and book your property. You get instant notifications, manage availability on the calendar, and handle guest queries through in-app chat.",
    features: [
      "Real-time booking notifications",
      "Availability calendar management",
      "In-app guest messaging",
      "Automated confirmation & reminders",
    ],
    color: "#F95622",
  },
  {
    step: "03",
    title: "Host with confidence & earn",
    desc: "Welcome guests, deliver authentic experiences, and receive payments directly. Get rated and build your reputation on the Bayaroo platform.",
    features: [
      "Direct UPI / bank payouts",
      "Guest review dashboard",
      "Performance analytics",
      "Priority listing for top-rated hosts",
    ],
    color: "#22c55e",
  },
];

const benefits = [
  {
    icon: <TrendingUp size={22} />,
    title: "More visibility",
    desc: "Reach 10,000+ active travellers looking specifically for off-beat and rural stays across India.",
    color: "#FECB19",
  },
  {
    icon: <Shield size={22} />,
    title: "Verified guests only",
    desc: "Every booking goes through identity verification. You always know who's staying with you.",
    color: "#6366f1",
  },
  {
    icon: <Building2 size={22} />,
    title: "Zero commission on first 10 bookings",
    desc: "Get started with absolutely zero platform fee for your first 10 confirmed bookings.",
    color: "#F95622",
  },
  {
    icon: <Star size={22} />,
    title: "Build your brand",
    desc: "Your property page showcases photos, reviews, amenities and local experiences — your own mini-website.",
    color: "#ec4899",
  },
  {
    icon: <MapPin size={22} />,
    title: "Local field agent support",
    desc: "A dedicated Bayaroo field agent in your district is always available for any operational help.",
    color: "#0ea5e9",
  },
  {
    icon: <CheckCircle size={22} />,
    title: "Booking protection",
    desc: "Our host-guarantee policy covers property damage from verified bookings up to ₹25,000.",
    color: "#22c55e",
  },
];

const testimonials = [
  {
    name: "Suresh Naik",
    location: "Coorg, Karnataka",
    role: "Coffee estate owner",
    text: "I listed my farmstay in 2023. Within 3 months I was getting 15+ bookings a month from travellers who really appreciated the authentic experience. My revenue tripled.",
    rating: 5,
    emoji: "☕",
  },
  {
    name: "Meena Devi",
    location: "Chopta, Uttarakhand",
    role: "Homestay host",
    text: "The Bayaroo field agent helped me with photos and setup. I was nervous about technology but the app is very simple. Now my daughter manages bookings from her phone.",
    rating: 5,
    emoji: "🏔",
  },
  {
    name: "Arumugam S.",
    location: "Munnar, Kerala",
    role: "Tea estate bungalow",
    text: "Unlike other platforms, Bayaroo travellers are genuine. They come for the experience, not just a cheap room. The review system helps me improve and attracts the right guests.",
    rating: 5,
    emoji: "🫖",
  },
];

const faqs = [
  {
    q: "Is listing on Bayaroo free?",
    a: "Yes, listing is completely free. Bayaroo charges a small platform fee only on confirmed bookings. Your first 10 bookings are fee-free.",
  },
  {
    q: "How does the verification work?",
    a: "A local Bayaroo field agent visits your property to verify it's as described and guide you through the best photography. This is at zero cost to you.",
  },
  {
    q: "When do I receive payments?",
    a: "Payments are released to your bank account within 24 hours of guest check-in, via direct bank transfer or UPI.",
  },
  {
    q: "Can I set my own prices?",
    a: "Absolutely. You have full control over your nightly rates, seasonal pricing, and any special offers or discounts.",
  },
  {
    q: "What if a guest causes damage?",
    a: "Bayaroo's host-guarantee covers verified damage up to ₹25,000 per booking for hosts on verified properties.",
  },
];

export default function ListPropertyPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden pt-28 pb-20"
          style={{
            background:
              "linear-gradient(150deg,#0A0A0A 0%,#0a1a05 60%,#0A0A0A 100%)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 40% 30%, rgba(34,197,94,0.12) 0%, transparent 70%)",
            }}
          />
          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5"
                  style={{
                    background: "rgba(34,197,94,0.12)",
                    color: "#22c55e",
                    border: "1px solid rgba(34,197,94,0.25)",
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Building2 size={14} /> For Property Owners
                </motion.div>
                <motion.h1
                  className="text-5xl sm:text-6xl font-black text-white leading-tight mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Turn your property into
                  <br />
                  <span style={{ color: "#22c55e" }}>steady income</span>
                </motion.h1>
                <motion.p
                  className="text-xl mb-10 max-w-lg"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  List your homestay, farm, campsite, or eco-lodge on
                  India&apos;s fastest-growing off-beat travel platform. Reach
                  the right guests. Earn on your terms.
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
                    List My Property Free <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="btn-dark text-base px-7 py-3.5"
                  >
                    How It Works
                  </Link>
                </motion.div>
              </div>
              {/* Stats cards */}
              <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {[
                  { n: "3,200+", label: "Properties listed", emoji: "🏡" },
                  { n: "10K+", label: "Bookings / month", emoji: "📅" },
                  { n: "₹0", label: "Listing fee", emoji: "🎉" },
                  { n: "4.7★", label: "Host satisfaction", emoji: "⭐" },
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

        {/* Property Categories */}
        <section className="py-12" style={{ background: "#F1EFEA" }}>
          <div className="container">
            <p className="text-center text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">
              We accept all types of rural & off-beat properties
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {propertyCategories.map((c) => (
                <div
                  key={c.label}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold"
                  style={{ background: "#fff", border: "1px solid #e5e5e5" }}
                >
                  <span>{c.emoji}</span> {c.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          className="section"
          style={{ background: "#fff" }}
        >
          <div className="container">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
                List &amp; earn in 3 simple steps
              </h2>
              <p className="text-gray-600 text-lg">
                From registration to your first booking in less than a week
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

        {/* Benefits */}
        <section className="section" style={{ background: "#0A0A0A" }}>
          <div className="container">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Why hosts choose Bayaroo
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.title}
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
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: `${b.color}20`, color: b.color }}
                  >
                    {b.icon}
                  </div>
                  <h3 className="text-lg font-black text-white mb-2">
                    {b.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {b.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Host Testimonials */}
        <section className="section" style={{ background: "#F1EFEA" }}>
          <div className="container">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-black text-gray-900 mb-3">
                Hear from our hosts
              </h2>
              <p className="text-gray-600">
                Real stories from property owners across India
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  className="bg-white rounded-2xl p-7"
                  style={{ border: "1px solid #efefef" }}
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
                  <p className="text-gray-700 leading-relaxed mb-6 text-sm">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                      style={{ background: "#f3f3f3" }}
                    >
                      {t.emoji}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">
                        {t.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t.role} · {t.location}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section" style={{ background: "#fff" }}>
          <div className="container max-w-3xl">
            <motion.h2
              className="text-3xl font-black text-gray-900 text-center mb-10"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Frequently asked questions
            </motion.h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={faq.q}
                  className="rounded-2xl p-6"
                  style={{ background: "#f7f7f7" }}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {faq.a}
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
                Ready to start earning?
              </h2>
              <p className="text-lg text-gray-800 mb-8 max-w-xl mx-auto">
                Join 3,200+ property owners across India. Listing is free, setup
                is fast, and your first 10 bookings have zero commission.
              </p>
              <Link
                href="https://agent.bayaroo.space"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-black text-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                List My Property Now <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
