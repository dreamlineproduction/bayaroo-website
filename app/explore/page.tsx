"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  Filter,
  Star,
  Wifi,
  Car,
  Utensils,
  ArrowRight,
  Leaf,
  Mountain,
  Waves,
  TreePine,
  Home as HomeIcon,
  X,
  ChevronDown,
  SlidersHorizontal,
  Heart,
  Share2,
  CheckCircle2,
  Sparkles,
  Minus,
  Plus,
  Phone,
} from "lucide-react";
import { type DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { GuestPicker, type GuestCounts } from "@/components/ui/guest-picker";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ─── Data ────────────────────────────────────────────────────────────────────

const propertyTypeFilters = [
  { id: "homestay", emoji: "🏡", label: "Homestay" },
  { id: "resort", emoji: "🏖️", label: "Resort" },
  { id: "farmstay", emoji: "🌿", label: "Farmstay" },
  { id: "campsite", emoji: "⛺", label: "Campsite" },
  { id: "villa", emoji: "🏰", label: "Villa" },
  { id: "dome", emoji: "🔮", label: "Dome / Tent" },
  { id: "eco-lodge", emoji: "🛖", label: "Eco Lodge" },
  { id: "heritage", emoji: "🏛️", label: "Heritage Home" },
];

const experienceFilters = [
  { id: "mountain", icon: "🏔", label: "Mountains" },
  { id: "beach", icon: "🌊", label: "Beaches" },
  { id: "forest", icon: "🌲", label: "Forests" },
  { id: "valley", icon: "🏞️", label: "Valleys" },
  { id: "wildlife", icon: "🦁", label: "Wildlife" },
  { id: "heritage", icon: "🏛️", label: "Heritage" },
  { id: "wellness", icon: "🍃", label: "Wellness" },
  { id: "adventure", icon: "🚵", label: "Adventure" },
  { id: "village", icon: "🏘️", label: "Village Life" },
  { id: "rural", icon: "🌾", label: "Rural" },
];

const amenityFilters = [
  { id: "wifi", icon: <Wifi size={14} />, label: "Free Wi-Fi" },
  { id: "pickup", icon: <Car size={14} />, label: "Pickup & Drop" },
  { id: "meals", icon: <Utensils size={14} />, label: "Meals Included" },
  { id: "eco", icon: <Leaf size={14} />, label: "Eco Friendly" },
  { id: "mountain-view", icon: <Mountain size={14} />, label: "Mountain View" },
  { id: "river", icon: <Waves size={14} />, label: "River Access" },
  { id: "forest-walk", icon: <TreePine size={14} />, label: "Forest Walks" },
  { id: "entire", icon: <HomeIcon size={14} />, label: "Entire Property" },
];

const sortOptions = [
  { id: "recommended", label: "Recommended" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
  { id: "newest", label: "Newest First" },
];

const stateOptions = [
  "West Bengal",
  "Kerala",
  "Himachal Pradesh",
  "Uttarakhand",
  "Karnataka",
  "Goa",
  "Assam",
  "Meghalaya",
  "Sikkim",
  "Rajasthan",
  "Madhya Pradesh",
  "Odisha",
];

const properties = [
  {
    id: 1,
    name: "Lamahatta Mist Cottage",
    location: "Lamahatta, Darjeeling",
    state: "West Bengal",
    type: "homestay",
    experience: ["mountain", "forest"],
    image: "/darjeeling.jpg",
    price: 2200,
    originalPrice: 2800,
    rating: 4.9,
    reviews: 128,
    guests: 4,
    bedrooms: 2,
    amenities: ["wifi", "meals", "pickup", "mountain-view", "forest-walk"],
    tag: "Hill Station · Tea Gardens",
    badge: "Top Rated",
    badgeColor: "#FECB19",
    description:
      "A cozy mountain cottage nestled in the pine forests above Darjeeling. Wake up to mist rolling through the valley, sip local Darjeeling tea on the verandah, and experience genuine Gorkha hospitality.",
    host: "Pem Doma Tamang",
    hostYears: 3,
  },
  {
    id: 2,
    name: "Sundarbans Delta Camp",
    location: "Gosaba, Sundarbans",
    state: "West Bengal",
    type: "campsite",
    experience: ["wildlife", "forest"],
    image: "/sundarban.webp",
    price: 1800,
    originalPrice: null as number | null,
    rating: 4.7,
    reviews: 84,
    guests: 6,
    bedrooms: 3,
    amenities: ["meals", "pickup", "eco", "river"],
    tag: "Mangrove Forest · Tiger Reserve",
    badge: "Eco Stay",
    badgeColor: "#22c55e",
    description:
      "Deep in the world's largest mangrove delta, this riverside camp offers sunrise boat safaris, guided forest walks, and authentic Bengali village cuisine. Spot Bengal tigers in their natural habitat.",
    host: "Subhash Mondal",
    hostYears: 5,
  },
  {
    id: 3,
    name: "Dooars Forest Retreat",
    location: "Gorumara, Dooars",
    state: "West Bengal",
    type: "eco-lodge",
    experience: ["wildlife", "forest", "village"],
    image: "/dooars.jpg",
    price: 1600,
    originalPrice: 2000 as number | null,
    rating: 4.8,
    reviews: 96,
    guests: 4,
    bedrooms: 2,
    amenities: ["meals", "eco", "forest-walk", "river", "wifi"],
    tag: "Tea Gardens · Elephant Safaris",
    badge: "New",
    badgeColor: "#6366f1",
    description:
      "A jungle-edge retreat at the foothills of the Himalayas. Fall asleep to elephant calls, explore the Gorumara National Park, and immerse in the culture of the tea garden communities.",
    host: "Bikram Oraon",
    hostYears: 2,
  },
  {
    id: 4,
    name: "Coorg Coffee Bungalow",
    location: "Madikeri, Coorg",
    state: "Karnataka",
    type: "villa",
    experience: ["forest", "wellness"],
    image: "/corg.webp",
    price: 3500,
    originalPrice: 4200 as number | null,
    rating: 4.9,
    reviews: 213,
    guests: 8,
    bedrooms: 4,
    amenities: ["wifi", "meals", "pickup", "entire"],
    tag: "Coffee Estate · Waterfall Treks",
    badge: "Top Rated",
    badgeColor: "#FECB19",
    description:
      "A colonial-era planter's bungalow in the heart of a working coffee and pepper estate. Guided estate tours, waterfall hikes, and slow mornings with freshly brewed single-origin coffee.",
    host: "Kavitha Cariappa",
    hostYears: 7,
  },
  {
    id: 5,
    name: "Spiti Monastery Homestay",
    location: "Kaza, Spiti Valley",
    state: "Himachal Pradesh",
    type: "homestay",
    experience: ["mountain", "heritage", "adventure"],
    image: "/spiti.avif",
    price: 2800,
    originalPrice: null as number | null,
    rating: 4.8,
    reviews: 72,
    guests: 3,
    bedrooms: 2,
    amenities: ["meals", "mountain-view", "pickup"],
    tag: "Desert Mountain · Monasteries",
    badge: "Offbeat Pick",
    badgeColor: "#f97316",
    description:
      "Stay with a local family in the shadow of ancient Buddhist monasteries. The highest inhabited plateau on Earth offers the most dramatic landscapes you'll ever see — and the warmest hosts.",
    host: "Tenzin Wangchuk",
    hostYears: 4,
  },
  {
    id: 6,
    name: "Munnar Mist Villa",
    location: "Top Station, Munnar",
    state: "Kerala",
    type: "villa",
    experience: ["mountain", "wellness", "forest"],
    image: "/munnar.jpg",
    price: 2400,
    originalPrice: 3000 as number | null,
    rating: 4.7,
    reviews: 156,
    guests: 6,
    bedrooms: 3,
    amenities: ["wifi", "meals", "eco", "mountain-view", "forest-walk"],
    tag: "Tea Plantations · Ayurveda",
    badge: null as string | null,
    badgeColor: null as string | null,
    description:
      "A secluded villa perched at 2,000m with uninterrupted views over Kerala's most famous tea valley. Enjoy Ayurvedic wellness treatments, plantation walks, and home-cooked Kerala meals.",
    host: "Jijo Thomas",
    hostYears: 6,
  },
  {
    id: 7,
    name: "Chopta Alpine Camp",
    location: "Chopta, Kedarnath Wildlife Sanctuary",
    state: "Uttarakhand",
    type: "campsite",
    experience: ["mountain", "adventure", "wildlife"],
    image: "/chopta.jpg",
    price: 1500,
    originalPrice: null as number | null,
    rating: 4.6,
    reviews: 48,
    guests: 4,
    bedrooms: 2,
    amenities: ["meals", "mountain-view", "eco"],
    tag: "Alpine Meadows · Himalayan Treks",
    badge: "Adventure Pick",
    badgeColor: "#ef4444",
    description:
      "Camp at 2,700m in India's 'Mini Switzerland' — a government-declared eco-zone. Trek to Tungnath temple, India's highest Shiva shrine, and watch the Himalayas turn pink at sunrise.",
    host: "Deepak Rawat",
    hostYears: 3,
  },
  {
    id: 8,
    name: "Goa Village Farmstay",
    location: "Ponda, Goa Hinterland",
    state: "Goa",
    type: "farmstay",
    experience: ["village", "rural", "wellness"],
    image: "/goa.avif",
    price: 2600,
    originalPrice: 3100 as number | null,
    rating: 4.8,
    reviews: 194,
    guests: 5,
    bedrooms: 3,
    amenities: ["wifi", "meals", "eco", "entire", "river"],
    tag: "Spice Farms · Village Life",
    badge: null as string | null,
    badgeColor: null as string | null,
    description:
      "Escape Goa's tourist trail and discover the real Goa — a world of spice plantations, village festivals, and century-old homes. Guided spice tours, local cooking classes, and river kayaking.",
    host: "Maria Fernandes",
    hostYears: 5,
  },
];

type Property = (typeof properties)[0];

// ─── Property Card ────────────────────────────────────────────────────────────

function PropertyCard({
  property,
  onSelect,
}: {
  property: Property;
  onSelect: (p: Property) => void;
}) {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <motion.div
      className="group bg-white rounded-2xl overflow-hidden cursor-pointer"
      style={{
        border: "1px solid #efefef",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect(property)}
    >
      <div className="relative h-52 overflow-hidden">
        <Image
          src={property.image}
          alt={property.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
          }}
        />
        {property.badge && (
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-black"
            style={{ background: property.badgeColor!, color: "#0A0A0A" }}
          >
            {property.badge}
          </div>
        )}
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(8px)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setWishlisted(!wishlisted);
          }}
        >
          <Heart
            size={15}
            fill={wishlisted ? "#ef4444" : "none"}
            color={wishlisted ? "#ef4444" : "#666"}
          />
        </button>
        <div className="absolute bottom-3 left-3">
          <span className="text-white font-black text-lg">
            ₹{property.price.toLocaleString("en-IN")}
          </span>
          <span className="text-white/70 text-xs"> /night</span>
        </div>
        {property.originalPrice && (
          <div className="absolute bottom-3 right-3">
            <span className="text-white/60 text-xs line-through">
              ₹{property.originalPrice.toLocaleString("en-IN")}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-black text-gray-900 text-base leading-tight">
            {property.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star size={13} fill="#FECB19" color="#FECB19" />
            <span className="text-sm font-bold text-gray-800">
              {property.rating}
            </span>
            <span className="text-xs text-gray-400">({property.reviews})</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
          <MapPin size={11} /> {property.location}
        </p>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
          {property.tag}
        </p>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {property.amenities.slice(0, 4).map((a) => {
            const amenity = amenityFilters.find((af) => af.id === a);
            return amenity ? (
              <span
                key={a}
                className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full"
                style={{ border: "1px solid #f0f0f0" }}
              >
                <span style={{ color: "#FECB19" }}>{amenity.icon}</span>
                {amenity.label}
              </span>
            ) : null;
          })}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {property.bedrooms} bed · {property.guests} guests
          </span>
          <button
            className="flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-full hover:-translate-y-0.5 transition-transform"
            style={{
              background: "linear-gradient(135deg,#FECB19,#F95622)",
              color: "#0A0A0A",
            }}
          >
            View <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Property Modal ───────────────────────────────────────────────────────────

function PropertyModal({
  property,
  onClose,
}: {
  property: Property;
  onClose: () => void;
}) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.round(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              86400000,
          ),
        )
      : 0;
  const total = nights * property.price;

  return (
    <motion.div
      className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-0 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      />
      <motion.div
        className="relative w-full sm:max-w-3xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative h-64 sm:h-80 shrink-0">
          <Image
            src={property.image}
            alt={property.name}
            fill
            className="object-cover"
            sizes="800px"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
            }}
          >
            <X size={18} color="#fff" />
          </button>
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setWishlisted(!wishlisted)}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Heart
                size={16}
                fill={wishlisted ? "#ef4444" : "none"}
                color={wishlisted ? "#ef4444" : "#fff"}
              />
            </button>
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Share2 size={16} color="#fff" />
            </button>
          </div>
          <div className="absolute bottom-4 left-5">
            <p className="text-white font-black text-2xl">
              ₹{property.price.toLocaleString("en-IN")}
              <span className="text-sm font-medium text-white/70"> /night</span>
            </p>
            {property.originalPrice && (
              <p className="text-white/50 text-sm line-through">
                ₹{property.originalPrice.toLocaleString("en-IN")}
              </p>
            )}
          </div>
          {property.badge && (
            <div
              className="absolute bottom-4 right-5 px-3 py-1 rounded-full text-xs font-black"
              style={{ background: property.badgeColor!, color: "#0A0A0A" }}
            >
              {property.badge}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h2 className="text-2xl font-black text-gray-900 leading-tight">
              {property.name}
            </h2>
            <div className="flex items-center gap-1.5 shrink-0 mt-1">
              <Star size={16} fill="#FECB19" color="#FECB19" />
              <span className="font-black text-gray-900">
                {property.rating}
              </span>
              <span className="text-sm text-gray-400">
                ({property.reviews} reviews)
              </span>
            </div>
          </div>
          <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-4">
            <MapPin size={13} /> {property.location}, {property.state}
          </p>

          {/* Stats row */}
          <div
            className="flex items-center gap-4 p-4 rounded-2xl mb-6"
            style={{ background: "#F1EFEA" }}
          >
            {[
              { label: "Bedrooms", value: `${property.bedrooms} rooms` },
              { label: "Max guests", value: `${property.guests} people` },
              {
                label: "Type",
                value:
                  propertyTypeFilters.find((t) => t.id === property.type)
                    ?.label ?? property.type,
              },
            ].map((s) => (
              <div key={s.label} className="text-center flex-1">
                <p className="font-black text-gray-900 text-sm">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          <h3 className="font-black text-gray-900 mb-2">About this stay</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {property.description}
          </p>

          <h3 className="font-black text-gray-900 mb-3">
            What&apos;s included
          </h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {property.amenities.map((a) => {
              const amenity = amenityFilters.find((af) => af.id === a);
              return amenity ? (
                <span
                  key={a}
                  className="flex items-center gap-1.5 text-sm text-gray-700 px-3 py-1.5 rounded-full"
                  style={{ background: "#F1EFEA", border: "1px solid #e8e5df" }}
                >
                  <CheckCircle2 size={13} style={{ color: "#22c55e" }} />
                  {amenity.label}
                </span>
              ) : null;
            })}
          </div>

          {/* Host */}
          <div
            className="flex items-center gap-3 p-4 rounded-2xl mb-6"
            style={{ border: "1px solid #efefef" }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
              style={{ background: "#F1EFEA" }}
            >
              👤
            </div>
            <div>
              <p className="font-black text-gray-900">
                Hosted by {property.host}
              </p>
              <p className="text-sm text-gray-500">
                {property.hostYears} years hosting on Bayaroo
              </p>
            </div>
          </div>

          {/* Booking widget */}
          <div className="rounded-2xl p-5" style={{ background: "#0A0A0A" }}>
            <h3 className="font-black text-white mb-4">Check availability</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label
                  className="text-xs font-bold mb-1.5 block"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  CHECK-IN
                </label>
                <input
                  type="date"
                  value={checkIn}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-white outline-none"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    colorScheme: "dark",
                  }}
                />
              </div>
              <div>
                <label
                  className="text-xs font-bold mb-1.5 block"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  CHECK-OUT
                </label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-white outline-none"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    colorScheme: "dark",
                  }}
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                className="text-xs font-bold mb-1.5 block"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                GUESTS
              </label>
              <button
                className="w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-between"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
                onClick={() => setShowGuestPicker(!showGuestPicker)}
              >
                <span>
                  {adults} adult{adults !== 1 ? "s" : ""}
                  {children > 0
                    ? `, ${children} child${children !== 1 ? "ren" : ""}`
                    : ""}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${showGuestPicker ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {showGuestPicker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="mt-2 p-3 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      {[
                        {
                          label: "Adults",
                          sub: "Age 13+",
                          val: adults,
                          set: setAdults,
                          min: 1,
                        },
                        {
                          label: "Children",
                          sub: "Age 2–12",
                          val: children,
                          set: setChildren,
                          min: 0,
                        },
                      ].map(({ label, sub, val, set, min }) => (
                        <div
                          key={label}
                          className="flex items-center justify-between py-2"
                        >
                          <div>
                            <p className="text-sm font-bold text-white">
                              {label}
                            </p>
                            <p
                              className="text-xs"
                              style={{ color: "rgba(255,255,255,0.4)" }}
                            >
                              {sub}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => set(Math.max(min, val - 1))}
                              className="w-7 h-7 rounded-full flex items-center justify-center"
                              style={{ background: "rgba(255,255,255,0.12)" }}
                            >
                              <Minus size={12} color="#fff" />
                            </button>
                            <span className="text-white font-black w-4 text-center">
                              {val}
                            </span>
                            <button
                              onClick={() => set(val + 1)}
                              className="w-7 h-7 rounded-full flex items-center justify-center"
                              style={{ background: "rgba(255,255,255,0.12)" }}
                            >
                              <Plus size={12} color="#fff" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {nights > 0 && (
              <div className="flex items-center justify-between mb-4 px-1">
                <p
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  ₹{property.price.toLocaleString("en-IN")} × {nights} night
                  {nights !== 1 ? "s" : ""}
                </p>
                <p className="font-black text-white">
                  ₹{total.toLocaleString("en-IN")}
                </p>
              </div>
            )}

            <Link
              href="/download"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-black text-sm hover:opacity-90 transition-opacity"
              style={{
                background: "linear-gradient(135deg,#FECB19,#F95622)",
                color: "#0A0A0A",
              }}
            >
              <Phone size={15} /> Book via Bayaroo App
            </Link>
            <p
              className="text-center text-xs mt-2"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Free cancellation available · No hidden charges
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [guestCounts, setGuestCounts] = useState<GuestCounts>({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [activeExperiences, setActiveExperiences] = useState<string[]>([]);
  const [activeAmenities, setActiveAmenities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([500, 10000]);
  const [sortBy, setSortBy] = useState("recommended");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );

  const toggleFilter = (
    arr: string[],
    setArr: (v: string[]) => void,
    id: string,
  ) => setArr(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

  const activeFilterCount =
    activeTypes.length +
    activeExperiences.length +
    activeAmenities.length +
    (selectedState ? 1 : 0) +
    (priceRange[0] > 500 || priceRange[1] < 10000 ? 1 : 0);

  const filteredProperties = useMemo(() => {
    let list = [...properties];
    if (search)
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.location.toLowerCase().includes(search.toLowerCase()) ||
          p.state.toLowerCase().includes(search.toLowerCase()),
      );
    if (selectedState) list = list.filter((p) => p.state === selectedState);
    if (activeTypes.length)
      list = list.filter((p) => activeTypes.includes(p.type));
    if (activeExperiences.length)
      list = list.filter((p) =>
        p.experience.some((e) => activeExperiences.includes(e)),
      );
    if (activeAmenities.length)
      list = list.filter((p) =>
        activeAmenities.every((a) => p.amenities.includes(a)),
      );
    list = list.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );
    if (sortBy === "price-low") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [
    search,
    selectedState,
    activeTypes,
    activeExperiences,
    activeAmenities,
    priceRange,
    sortBy,
  ]);

  const clearAllFilters = () => {
    setSearch("");
    setSelectedState("");
    setDateRange(undefined);
    setGuestCounts({ adults: 1, children: 0, infants: 0, pets: 0 });
    setActiveTypes([]);
    setActiveExperiences([]);
    setActiveAmenities([]);
    setPriceRange([500, 10000]);
    setSortBy("recommended");
  };

  return (
    <>
      <Navbar />

      {/* ── Hero with video background + search ───────────────── */}
      <section
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{ minHeight: "88vh", paddingTop: "5rem" }}
      >
        {/* Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          src="/hero3.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,10,10,0.78) 0%, rgba(10,10,10,0.62) 50%, rgba(10,10,10,0.88) 100%)",
          }}
        />
        {/* Yellow glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-100 rounded-full opacity-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #FECB19 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />

        <div className="container relative z-10 text-center pt-8 pb-16">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: "rgba(254,203,25,0.14)",
                color: "#FECB19",
                border: "1px solid rgba(254,203,25,0.28)",
              }}
            >
              <MapPin size={12} /> Search 3,200+ properties across India
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Find Your Perfect
            <br />
            <span className="text-gradient">Rural Escape</span>
          </motion.h1>
          <motion.p
            className="text-lg max-w-xl mx-auto mb-10"
            style={{ color: "rgba(255,255,255,0.55)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Homestays, campsites, eco-lodges and more — filtered by your dates,
            budget, and vibe.
          </motion.p>

          {/* ── Search bar ── */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Main search row */}
            <div
              className="flex flex-wrap gap-2 items-center p-2.5 rounded-2xl mb-3"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              {/* Text search */}
              <div
                className="flex items-center gap-2 flex-1 min-w-52 px-3 py-2.5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <Search size={15} style={{ color: "#FECB19" }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Where do you want to go?"
                  className="bg-transparent text-sm font-medium text-white outline-none w-full placeholder:text-white/40"
                />
                {search && (
                  <button onClick={() => setSearch("")}>
                    <X size={13} className="text-white/50" />
                  </button>
                )}
              </div>

              {/* State */}
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-3 py-2.5 rounded-xl text-sm font-semibold outline-none"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: selectedState ? "#fff" : "rgba(255,255,255,0.45)",
                  border: "none",
                  colorScheme: "dark",
                }}
              >
                <option value="" style={{ background: "#1a1a1a" }}>
                  All States
                </option>
                {stateOptions.map((s) => (
                  <option key={s} value={s} style={{ background: "#1a1a1a" }}>
                    {s}
                  </option>
                ))}
              </select>

              {/* Date range picker */}
              <DateRangePicker value={dateRange} onChange={setDateRange} />

              {/* Guests */}
              <GuestPicker value={guestCounts} onChange={setGuestCounts} />

              {/* Search button */}
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm transition-all hover:-translate-y-0.5 shrink-0"
                style={{
                  background: "linear-gradient(135deg,#FECB19,#F95622)",
                  color: "#0A0A0A",
                  boxShadow: "0 4px 20px rgba(249,86,34,0.45)",
                }}
              >
                <Search size={15} /> Search
              </button>
            </div>

            {/* Experience pill filters */}
            <div className="flex gap-2 overflow-x-auto pb-1 justify-center flex-wrap">
              {experienceFilters.map((ef) => (
                <button
                  key={ef.id}
                  onClick={() =>
                    toggleFilter(activeExperiences, setActiveExperiences, ef.id)
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all hover:scale-105"
                  style={
                    activeExperiences.includes(ef.id)
                      ? {
                          background: "#FECB19",
                          color: "#0A0A0A",
                          border: "1px solid #FECB19",
                        }
                      : {
                          background: "rgba(255,255,255,0.12)",
                          color: "rgba(255,255,255,0.8)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          backdropFilter: "blur(8px)",
                        }
                  }
                >
                  {ef.icon} {ef.label}
                </button>
              ))}
            </div>

            {/* Advanced filters toggle */}
            <div className="mt-3 flex justify-center">
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all hover:scale-105"
                style={
                  activeFilterCount > 0
                    ? {
                        background: "#FECB19",
                        color: "#0A0A0A",
                      }
                    : {
                        background: "rgba(255,255,255,0.12)",
                        color: "rgba(255,255,255,0.75)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        backdropFilter: "blur(8px)",
                      }
                }
              >
                <SlidersHorizontal size={13} />
                {showFilterPanel ? "Hide filters" : "More filters"}
                {activeFilterCount > 0 && (
                  <span
                    className="w-4 h-4 rounded-full text-xs font-black flex items-center justify-center"
                    style={{ background: "#0A0A0A", color: "#FECB19" }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Expandable advanced filter panel */}
            <AnimatePresence>
              {showFilterPanel && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-3"
                >
                  <div
                    className="p-5 rounded-2xl text-left"
                    style={{
                      background: "rgba(10,10,10,0.75)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                      {/* Property type */}
                      <div>
                        <p
                          className="text-xs font-black uppercase tracking-widest mb-3"
                          style={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          Property Type
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {propertyTypeFilters.map((pt) => (
                            <button
                              key={pt.id}
                              onClick={() =>
                                toggleFilter(activeTypes, setActiveTypes, pt.id)
                              }
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                              style={
                                activeTypes.includes(pt.id)
                                  ? {
                                      background: "#FECB19",
                                      color: "#0A0A0A",
                                    }
                                  : {
                                      background: "rgba(255,255,255,0.08)",
                                      color: "rgba(255,255,255,0.7)",
                                      border:
                                        "1px solid rgba(255,255,255,0.12)",
                                    }
                              }
                            >
                              {pt.emoji} {pt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Amenities */}
                      <div>
                        <p
                          className="text-xs font-black uppercase tracking-widest mb-3"
                          style={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          Amenities
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {amenityFilters.map((a) => (
                            <button
                              key={a.id}
                              onClick={() =>
                                toggleFilter(
                                  activeAmenities,
                                  setActiveAmenities,
                                  a.id,
                                )
                              }
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                              style={
                                activeAmenities.includes(a.id)
                                  ? {
                                      background: "#FECB19",
                                      color: "#0A0A0A",
                                    }
                                  : {
                                      background: "rgba(255,255,255,0.08)",
                                      color: "rgba(255,255,255,0.7)",
                                      border:
                                        "1px solid rgba(255,255,255,0.12)",
                                    }
                              }
                            >
                              <span
                                style={{
                                  color: activeAmenities.includes(a.id)
                                    ? "#0A0A0A"
                                    : "#FECB19",
                                }}
                              >
                                {a.icon}
                              </span>
                              {a.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Price */}
                      <div>
                        <p
                          className="text-xs font-black uppercase tracking-widest mb-3"
                          style={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          Price per Night
                        </p>
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <label
                              className="text-xs mb-1 block"
                              style={{ color: "rgba(255,255,255,0.35)" }}
                            >
                              Min ₹
                            </label>
                            <input
                              type="number"
                              value={priceRange[0]}
                              min={500}
                              max={priceRange[1]}
                              step={100}
                              onChange={(e) =>
                                setPriceRange([+e.target.value, priceRange[1]])
                              }
                              className="w-full px-3 py-2 rounded-xl text-sm font-semibold text-white outline-none"
                              style={{
                                background: "rgba(255,255,255,0.1)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                colorScheme: "dark",
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <label
                              className="text-xs mb-1 block"
                              style={{ color: "rgba(255,255,255,0.35)" }}
                            >
                              Max ₹
                            </label>
                            <input
                              type="number"
                              value={priceRange[1]}
                              min={priceRange[0]}
                              max={20000}
                              step={100}
                              onChange={(e) =>
                                setPriceRange([priceRange[0], +e.target.value])
                              }
                              className="w-full px-3 py-2 rounded-xl text-sm font-semibold text-white outline-none"
                              style={{
                                background: "rgba(255,255,255,0.1)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                colorScheme: "dark",
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Clear */}
                      <div className="flex flex-col justify-end">
                        {activeFilterCount > 0 && (
                          <button
                            onClick={clearAllFilters}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
                            style={{
                              background: "rgba(239,68,68,0.15)",
                              color: "#fca5a5",
                              border: "1px solid rgba(239,68,68,0.25)",
                            }}
                          >
                            <X size={14} /> Clear all ({activeFilterCount})
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Trust stats */}
          <motion.div
            className="mt-10 flex items-center justify-center gap-6 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.7 }}
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

      {/* ── Main content ──────────────────────────────────────── */}
      <main style={{ background: "#F8F7F4", minHeight: "100vh" }}>
        <div className="container py-8">
          {/* Results header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <p className="text-lg font-black text-gray-900">
                {filteredProperties.length} propert
                {filteredProperties.length !== 1 ? "ies" : "y"} found
              </p>
              {(search || selectedState || activeFilterCount > 0) && (
                <p className="text-sm text-gray-500">
                  {search ? `"${search}"` : ""}
                  {selectedState ? ` in ${selectedState}` : ""}
                  {activeFilterCount > 0
                    ? ` · ${activeFilterCount} filter${activeFilterCount !== 1 ? "s" : ""} active`
                    : ""}
                </p>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white"
                style={{ border: "1px solid #e5e7eb" }}
              >
                <Filter size={14} style={{ color: "#F95622" }} />
                {sortOptions.find((s) => s.id === sortBy)?.label}
                <ChevronDown
                  size={13}
                  className={`transition-transform ${showSortDropdown ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute top-full mt-1 right-0 w-52 bg-white rounded-2xl shadow-2xl py-2 z-50"
                    style={{ border: "1px solid #efefef" }}
                  >
                    {sortOptions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSortBy(s.id);
                          setShowSortDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-amber-50 transition-colors"
                        style={{
                          color: sortBy === s.id ? "#F95622" : "#374151",
                          fontWeight: sortBy === s.id ? 800 : 500,
                        }}
                      >
                        {sortBy === s.id && <span className="mr-1">✓</span>}
                        {s.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {activeTypes.map((id) => {
                const t = propertyTypeFilters.find((x) => x.id === id)!;
                return (
                  <button
                    key={id}
                    onClick={() =>
                      toggleFilter(activeTypes, setActiveTypes, id)
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ background: "#0A0A0A", color: "#FECB19" }}
                  >
                    {t.emoji} {t.label} <X size={11} />
                  </button>
                );
              })}
              {activeExperiences.map((id) => {
                const e = experienceFilters.find((x) => x.id === id)!;
                return (
                  <button
                    key={id}
                    onClick={() =>
                      toggleFilter(activeExperiences, setActiveExperiences, id)
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ background: "#0A0A0A", color: "#FECB19" }}
                  >
                    {e.icon} {e.label} <X size={11} />
                  </button>
                );
              })}
              {activeAmenities.map((id) => {
                const a = amenityFilters.find((x) => x.id === id)!;
                return (
                  <button
                    key={id}
                    onClick={() =>
                      toggleFilter(activeAmenities, setActiveAmenities, id)
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ background: "#0A0A0A", color: "#FECB19" }}
                  >
                    {a.label} <X size={11} />
                  </button>
                );
              })}
            </div>
          )}

          {/* Property grid */}
          {filteredProperties.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-black text-gray-900 mb-2">
                No properties found
              </h3>
              <p className="text-gray-500 mb-6">
                Try removing some filters or changing your search
              </p>
              <button onClick={clearAllFilters} className="btn-primary">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProperties.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                >
                  <PropertyCard property={p} onSelect={setSelectedProperty} />
                </motion.div>
              ))}
            </div>
          )}

          {/* AI CTA banner */}
          <div
            className="mt-16 rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{ background: "#0A0A0A" }}
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} style={{ color: "#FECB19" }} />
                <span
                  className="text-xs font-black uppercase tracking-widest"
                  style={{ color: "#FECB19" }}
                >
                  Try AI Trip Planner
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
                Can&apos;t decide where to go?
              </h3>
              <p
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                Tell our AI your budget, interests, and travel dates — it will
                find the perfect property for you in seconds.
              </p>
            </div>
            <Link
              href="/download"
              className="flex items-center gap-2 font-black text-sm rounded-full shrink-0 hover:-translate-y-1 transition-transform"
              style={{
                background: "linear-gradient(135deg,#FECB19,#F95622)",
                color: "#0A0A0A",
                padding: "0.875rem 2rem",
                boxShadow: "0 6px 32px rgba(249,86,34,0.4)",
              }}
            >
              Plan with AI <Sparkles size={15} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />

      {/* Property detail modal */}
      <AnimatePresence>
        {selectedProperty && (
          <PropertyModal
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
