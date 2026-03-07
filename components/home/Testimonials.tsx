"use client";

import { motion } from "motion/react";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Priya Sharma",
    loc: "Delhi",
    avatar: "PS",
    rating: 5,
    text: "Found a gorgeous dome stay in Kutch through Bayaroo. The AI planner suggested it instantly when I said I wanted something unusual. Booking was seamless!",
    property: "Rann Dome Retreat, Kutch",
    date: "Feb 2026",
    tag: "Dome",
    color: "#FECB19",
  },
  {
    name: "Rohan Mehta",
    loc: "Pune",
    avatar: "RM",
    rating: 5,
    text: "The homestay in Coorg was beyond expectations. Real coffee estate experience. The host was warm, food was amazing. Will be my go-to app for offbeat travel.",
    property: "Green Valley Homestay, Coorg",
    date: "Jan 2026",
    tag: "Homestay",
    color: "#F95622",
  },
  {
    name: "Anika Bose",
    loc: "Kolkata",
    avatar: "AB",
    rating: 5,
    text: "Discovered Bayaroo when looking for a Darjeeling homestay. In 5 minutes, AI put together a 4-night package under ₹14K for two. Absolutely incredible value.",
    property: "Misty Heights, Darjeeling",
    date: "Mar 2026",
    tag: "AI Package",
    color: "#4ade80",
  },
  {
    name: "Vikram Singh",
    loc: "Mumbai",
    avatar: "VS",
    rating: 5,
    text: "Rented a private villa in Alibaug for the weekend. Room-level meal customization is brilliant — we ordered separate veg/non-veg breakfasts. Super thoughtful.",
    property: "Coastal Villa, Alibaug",
    date: "Feb 2026",
    tag: "Villa",
    color: "#60a5fa",
  },
  {
    name: "Divya Nair",
    loc: "Bangalore",
    avatar: "DN",
    rating: 5,
    text: "The Spiti circuit was my dream trip. Bayaroo had properties I had NEVER seen on any other platform. Offline booking worked perfectly in low connectivity zones.",
    property: "Mud House, Kaza, Spiti",
    date: "Jan 2026",
    tag: "Off-Beat",
    color: "#c084fc",
  },
  {
    name: "Arjun Patel",
    loc: "Ahmedabad",
    avatar: "AP",
    rating: 5,
    text: "Three families, 9 adults, 4 kids. Used Bayaroo to book a resort with multiple room types. The per-room meal and extra bed options saved us from a planning nightmare.",
    property: "Forest Resort, Saputara",
    date: "Dec 2025",
    tag: "Family",
    color: "#fb923c",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={12} style={{ color: "#FECB19" }} fill="#FECB19" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="section" style={{ background: "#F1EFEA" }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            className="badge badge-yellow mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Real Traveller Stories
          </motion.span>
          <motion.h2
            className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            10,000+ travellers found their
            <br />
            <span className="text-gradient">perfect escape</span>
          </motion.h2>
        </div>

        {/* Review grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              className="bg-white rounded-3xl p-6 card-hover flex flex-col gap-4 border border-gray-100 shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              {/* Top row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black text-white"
                    style={{ background: r.color }}
                  >
                    {r.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.loc}</p>
                  </div>
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{
                    background: `${r.color}18`,
                    color: r.color,
                    border: `1px solid ${r.color}30`,
                  }}
                >
                  {r.tag}
                </span>
              </div>

              <Stars count={r.rating} />

              <p className="text-sm text-gray-600 leading-relaxed flex-1">
                &ldquo;{r.text}&rdquo;
              </p>

              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-700">
                  {r.property}
                </p>
                <p className="text-xs text-gray-400">{r.date}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Aggregate rating */}
        <motion.div
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <p className="text-6xl font-black text-gray-900">4.8</p>
            <Stars count={5} />
            <p className="text-sm text-gray-500 mt-1">Average rating</p>
          </div>
          <div className="hidden sm:block w-px h-16 bg-gray-200" />
          <div className="flex flex-col gap-2">
            {[
              { label: "Hospitality", pct: 96 },
              { label: "Location", pct: 94 },
              { label: "Cleanliness", pct: 93 },
            ].map((r) => (
              <div key={r.label} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-20">{r.label}</span>
                <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${r.pct}%`,
                      background: "linear-gradient(90deg,#FECB19,#F95622)",
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-700">
                  {r.pct}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
