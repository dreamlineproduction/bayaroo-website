"use client";

import { motion } from "motion/react";
import { Sparkles, Send, ArrowRight } from "lucide-react";
import Link from "next/link";

const chatMessages = [
  {
    sender: "ai",
    text: "Hi! 👋 Ready to plan an amazing trip? Where would you like to go?",
  },
  {
    sender: "user",
    text: "I want a mountain escape for 2 adults, 4 nights, budget ₹15K",
  },
  {
    sender: "ai",
    text: "Great choice! 🏔 I found 3 perfect mountain escapes for you:",
    packages: [
      {
        name: "Chopta Meadows Cottage",
        price: "₹3,200/n",
        tag: "Best Value",
        rating: "4.9",
      },
      {
        name: "Spiti Mud House Retreat",
        price: "₹4,100/n",
        tag: "Premium",
        rating: "5.0",
      },
    ],
  },
];

const quickReplies = [
  "🏖 Beach getaway",
  "🌲 Forest retreat",
  "🏔 Mountain escape",
  "🎭 Cultural trip",
];

export default function AIPackagePlanner() {
  return (
    <section
      className="section bg-dark-section"
      style={{ background: "#0f0f0f" }}
    >
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <motion.div
              className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                background: "rgba(254,203,25,0.12)",
                color: "#FECB19",
                border: "1px solid rgba(254,203,25,0.25)",
              }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Sparkles size={15} />
              AI-Powered Trip Planning
            </motion.div>

            <motion.h2
              className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Your perfect trip,
              <br />
              <span className="text-gradient">built by AI</span>
              <br />
              in minutes
            </motion.h2>

            <motion.p
              className="text-lg leading-relaxed mb-8"
              style={{ color: "rgba(255,255,255,0.55)" }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Just tell our AI where you want to go, your budget, who&apos;s
              travelling, and what experiences you want. It builds a custom
              package — yours in seconds.
            </motion.p>

            <motion.div
              className="grid grid-cols-2 gap-4 mb-8"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
            >
              {[
                { label: "Destination & dates", icon: "📍" },
                { label: "Group size & budget", icon: "👥" },
                { label: "Activity preferences", icon: "🎯" },
                { label: "Meal & transport needs", icon: "🍽" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span className="text-xl">{f.icon}</span>
                  <span className="text-sm font-medium text-white/70">
                    {f.label}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/explore#ai-planner" className="btn-primary">
                <Sparkles size={15} /> Try AI Planner Free{" "}
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          </div>

          {/* Right: Chat UI mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                background: "#141414",
              }}
            >
              {/* Chat header */}
              <div
                className="flex items-center gap-3 px-5 py-4"
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg,#FECB19,#F95622)",
                  }}
                >
                  <Sparkles size={14} color="#0A0A0A" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Bayaroo AI Planner
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    Powered by AI · Always free
                  </p>
                </div>
                <div className="ml-auto flex gap-1.5">
                  {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                    <div
                      key={c}
                      className="w-3 h-3 rounded-full"
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div
                className="p-5 flex flex-col gap-4"
                style={{ minHeight: "320px" }}
              >
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.sender === "ai" && (
                      <div className="flex gap-3 max-w-[90%]">
                        <div
                          className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center mt-1"
                          style={{
                            background:
                              "linear-gradient(135deg,#FECB19,#F95622)",
                          }}
                        >
                          <Sparkles size={11} color="#0A0A0A" />
                        </div>
                        <div>
                          <div
                            className="px-4 py-3 rounded-2xl rounded-tl-sm text-sm text-white leading-relaxed"
                            style={{ background: "rgba(255,255,255,0.08)" }}
                          >
                            {msg.text}
                          </div>
                          {msg.packages && (
                            <div className="flex flex-col gap-2 mt-2">
                              {msg.packages.map((p) => (
                                <div
                                  key={p.name}
                                  className="px-4 py-3 rounded-2xl flex items-center justify-between gap-3"
                                  style={{
                                    background: "rgba(254,203,25,0.08)",
                                    border: "1px solid rgba(254,203,25,0.2)",
                                  }}
                                >
                                  <div>
                                    <p className="text-xs font-bold text-white">
                                      {p.name}
                                    </p>
                                    <p
                                      className="text-xs"
                                      style={{ color: "#FECB19" }}
                                    >
                                      {p.price} · ⭐ {p.rating}
                                    </p>
                                  </div>
                                  <span
                                    className="text-xs font-bold px-2 py-0.5 rounded-lg shrink-0"
                                    style={{
                                      background: "#FECB19",
                                      color: "#0A0A0A",
                                    }}
                                  >
                                    {p.tag}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {msg.sender === "user" && (
                      <div
                        className="px-4 py-3 rounded-2xl rounded-tr-sm text-sm text-white max-w-[80%]"
                        style={{
                          background: "linear-gradient(135deg,#FECB19,#F95622)",
                          color: "#0A0A0A",
                        }}
                      >
                        <span className="font-semibold text-gray-900">
                          {msg.text}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick replies */}
              <div className="px-5 pb-3 flex flex-wrap gap-2">
                {quickReplies.map((r) => (
                  <span
                    key={r}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.7)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {r}
                  </span>
                ))}
              </div>

              {/* Input bar */}
              <div
                className="flex items-center gap-3 mx-5 mb-5 px-4 py-3 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <span className="text-sm text-white/30 flex-1">
                  Tell me your dream trip…
                </span>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#FECB19,#F95622)",
                  }}
                >
                  <Send size={13} color="#0A0A0A" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
