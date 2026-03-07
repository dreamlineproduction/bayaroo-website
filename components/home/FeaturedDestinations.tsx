"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";

const destinations = [
  {
    name: "Darjeeling",
    state: "West Bengal",
    tag: "Hill Station · Tea Gardens",
    emoji: "🍵",
    image: "/darjeeling.jpg",
    accent: "#4ade80",
    from: "₹1,800",
    properties: 87,
    gradient: "from-emerald-900/70 to-emerald-900/20",
  },
  {
    name: "Coorg",
    state: "Karnataka",
    tag: "Coffee Estates · Waterfalls",
    emoji: "☕",
    image: "/corg.webp",
    accent: "#fb923c",
    from: "₹2,200",
    properties: 143,
    gradient: "from-orange-900/70 to-orange-900/20",
  },
  {
    name: "Goa Hinterland",
    state: "Goa",
    tag: "Villages · Spice Farms",
    emoji: "🌿",
    image: "/goa.avif",
    accent: "#34d399",
    from: "₹2,500",
    properties: 219,
    gradient: "from-teal-900/70 to-teal-900/20",
  },
  {
    name: "Spiti Valley",
    state: "Himachal Pradesh",
    tag: "Desert Mountain · Monasteries",
    emoji: "🏔",
    image: "/spiti.avif",
    accent: "#60a5fa",
    from: "₹3,000",
    properties: 56,
    gradient: "from-blue-900/70 to-blue-900/20",
  },
  {
    name: "Munnar",
    state: "Kerala",
    tag: "Tea Plantations · Mist",
    emoji: "🌄",
    image: "/munnar.jpg",
    accent: "#a3e635",
    from: "₹2,100",
    properties: 164,
    gradient: "from-lime-900/70 to-lime-900/20",
  },
  {
    name: "Chopta",
    state: "Uttarakhand",
    tag: "Hidden Trek · Alpine Meadows",
    emoji: "⛺",
    image: "/chopta.jpg",
    accent: "#c084fc",
    from: "₹1,500",
    properties: 38,
    gradient: "from-purple-900/70 to-purple-900/20",
  },
  {
    name: "Sundarbans",
    state: "West Bengal",
    tag: "Mangrove Forest · Tiger Reserve",
    emoji: "🐯",
    image: "/sundarban.webp",
    accent: "#4ade80",
    from: "₹2,000",
    properties: 62,
    gradient: "from-green-900/70 to-green-900/20",
  },
  {
    name: "Dooars",
    state: "West Bengal",
    tag: "Tea Gardens · Wildlife",
    emoji: "🐘",
    image: "/dooars.jpg",
    accent: "#fb923c",
    from: "₹1,700",
    properties: 74,
    gradient: "from-amber-900/70 to-amber-900/20",
  },
];

const experiences = [
  { icon: "🏔", label: "Mountains" },
  { icon: "🏖️", label: "Beach" },
  { icon: "🌲", label: "Forest" },
  { icon: "🏞️", label: "Valley" },
  { icon: "⛰️", label: "Hills & Beach" },
  { icon: "🏙️", label: "City" },
  { icon: "🏘️", label: "Village" },
  { icon: "🛕", label: "Heritage" },
  { icon: "🌾", label: "Rural" },
];

export default function FeaturedDestinations() {
  return (
    <section className="section bg-cream-section">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <motion.span
              className="badge badge-orange mb-3"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Off-Beat India
            </motion.span>
            <motion.h2
              className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Places you&apos;ll actually
              <br />
              <span className="text-gradient">remember forever</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link href="/explore" className="btn-dark text-sm hidden sm:flex">
              All Destinations <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>

        {/* Experience type pills */}
        <motion.div
          className="flex items-center gap-3 mb-8 overflow-x-auto hide-scroll pb-1"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs font-bold text-gray-500 shrink-0 uppercase tracking-wide">
            Filter by:
          </span>
          {experiences.map((e) => (
            <Link
              key={e.label}
              href={`/explore?experience=${e.label.toLowerCase()}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white border border-gray-200 text-gray-700 hover:border-amber-400 hover:text-amber-700 transition-colors shrink-0 shadow-sm"
            >
              <span>{e.icon}</span>
              {e.label}
            </Link>
          ))}
        </motion.div>

        {/* Destination grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinations.map((d, i) => (
            <motion.div
              key={d.name}
              className={`relative rounded-3xl overflow-hidden card-hover cursor-pointer ${i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              {/* Image BG placeholder */}
              <div
                className="relative w-full h-full"
                style={{ minHeight: i === 0 ? "480px" : "220px" }}
              >
                {/* Actual photo */}
                <Image
                  src={d.image}
                  alt={d.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  priority={i < 3}
                />
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.1) 100%)",
                  }}
                />

                {/* Emoji */}
                <div className="absolute top-4 left-4 text-4xl">{d.emoji}</div>

                {/* Properties badge */}
                <div
                  className="absolute top-4 right-4 px-2.5 py-1 rounded-xl text-xs font-bold"
                  style={{
                    background: "rgba(0,0,0,0.5)",
                    color: "#fff",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {d.properties} stays
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p
                    className="text-xs font-semibold mb-1"
                    style={{ color: d.accent }}
                  >
                    <MapPin size={10} className="inline mr-1" />
                    {d.state}
                  </p>
                  <h3 className="text-xl font-black text-white mb-1">
                    {d.name}
                  </h3>
                  <p className="text-xs text-white/60 mb-3">{d.tag}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">
                      from <span style={{ color: d.accent }}>{d.from}</span>
                      /night
                    </span>
                    <Link
                      href={`/explore?destination=${d.name.toLowerCase()}`}
                      className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{ background: d.accent, color: "#0A0A0A" }}
                    >
                      Explore <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="sm:hidden text-center mt-8">
          <Link href="/explore" className="btn-dark text-sm">
            View All Destinations <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
