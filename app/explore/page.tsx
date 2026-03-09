"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
} from "lucide-react";
import { type DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { GuestPicker, type GuestCounts } from "@/components/ui/guest-picker";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const STORAGE_BASE = API_BASE.replace(/\/api$/, "");

function resolveImg(src: string | null | undefined): string {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${STORAGE_BASE}/${src.replace(/^\//, "")}`;
}

//    Types

type ApiProperty = {
  id: number;
  name: string;
  property_type: string;
  experience_types: string[];
  location: string;
  city: string;
  state: string;
  address: string;
  image: string;
  images: string[];
  min_price: number;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  rating: string;
  reviews_count: number;
  is_featured: boolean;
  distance: string | null;
  distance_km: number | null;
  latitude: number | null;
  longitude: number | null;
  amenities: { id: number; name: string; icon: string }[];
};

//    Data

function haversine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const experienceFilters = [
  { id: "mountain", icon: "???", label: "Mountains" },
  { id: "beach", icon: "???", label: "Beaches" },
  { id: "forest", icon: "??", label: "Forests" },
  { id: "valley", icon: "???", label: "Valleys" },
  { id: "wildlife", icon: "??", label: "Wildlife" },
  { id: "heritage", icon: "???", label: "Heritage" },
  { id: "wellness", icon: "?????", label: "Wellness" },
  { id: "adventure", icon: "?????", label: "Adventure" },
  { id: "village", icon: "???", label: "Village Life" },
  { id: "rural", icon: "??", label: "Rural" },
];

//    Property Card

function PropertyCard({
  property,
  userCoords,
  dateRange,
}: {
  property: ApiProperty;
  userCoords: { lat: number; lng: number } | null;
  dateRange?: DateRange;
}) {
  const router = useRouter();
  const [imgIdx, setImgIdx] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  const rawImages: string[] = Array.isArray(property.images)
    ? property.images
    : [];
  const allImages = [
    ...new Set([property.image, ...rawImages].map(resolveImg).filter(Boolean)),
  ].slice(0, 6);

  // Distance from user
  let distKm: number | null = property.distance_km ?? null;
  if (
    distKm === null &&
    userCoords &&
    property.latitude != null &&
    property.longitude != null
  ) {
    distKm = haversine(
      userCoords.lat,
      userCoords.lng,
      property.latitude,
      property.longitude,
    );
  }

  // Nights from selected dates
  const nights =
    dateRange?.from && dateRange?.to
      ? Math.round(
          (dateRange.to.getTime() - dateRange.from.getTime()) / 86_400_000,
        )
      : 0;

  const totalPrice = nights > 0 ? property.min_price * nights : null;
  const ratingInt = Math.round(parseFloat(property.rating ?? "0"));

  return (
    <motion.div
      className="group bg-white rounded-2xl overflow-hidden cursor-pointer w-full"
      style={{
        border: "1px solid #efefef",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.2 }}
      onClick={() => window.open(`/listing/${property.id}`, "_blank")}
    >
      {/* Image */}
      <div className="card-img-area relative h-52 overflow-hidden">
        <Image
          src={allImages[imgIdx] || resolveImg(property.image)}
          alt={property.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="320px"
          unoptimized
        />

        {/* Wishlist */}
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center z-10"
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

        {/* Multi-image navigation */}
        {allImages.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                setImgIdx((i) => (i - 1 + allImages.length) % allImages.length);
              }}
            >
              <ChevronLeft size={14} color="#333" />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                setImgIdx((i) => (i + 1) % allImages.length);
              }}
            >
              <ChevronRight size={14} color="#333" />
            </button>
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {allImages.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-200 ${
                    i === imgIdx
                      ? "w-4 h-1.5 bg-white"
                      : "w-1.5 h-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Body */}
      <div className="p-3.5">
        {/* Name */}
        <h3 className="font-black text-gray-900 text-[15px] leading-snug mb-0.5 line-clamp-1">
          {property.name}
        </h3>

        {/* City, State � distance */}
        <p className="text-xs text-gray-500 mb-2.5">
          {property.city}, {property.state}
          {distKm !== null && (
            <span className="text-gray-400">
              {" "}
              &middot; {Math.round(distKm)} km away
            </span>
          )}
        </p>

        {/* Amenities */}
        {property.amenities.length > 0 && (
          <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
            {property.amenities.slice(0, 4).map((a) => (
              <span
                key={a.id}
                className="text-[11px] text-gray-500 px-2 py-0.5 rounded-full shrink-0"
                style={{ background: "#f5f5f5", border: "1px solid #eeeeee" }}
              >
                {a.name}
              </span>
            ))}
            {property.amenities.length > 4 && (
              <span className="text-[11px] text-gray-400 font-medium">
                + {property.amenities.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Guests � Bedrooms � Bathrooms */}
        {(property.max_guests > 0 ||
          property.bedrooms > 0 ||
          property.bathrooms > 0) && (
          <p className="text-xs font-semibold text-gray-700 mb-2">
            {property.max_guests > 0 && <>{property.max_guests} Guests</>}
            {property.max_guests > 0 && property.bedrooms > 0 && <>&middot;</>}
            {property.bedrooms > 0 && <>{property.bedrooms} Bedrooms</>}
            {property.bedrooms > 0 && property.bathrooms > 0 && <>&middot;</>}
            {property.bathrooms > 0 && <>{property.bathrooms} Bathrooms</>}
          </p>
        )}

        {/* Stars + reviews */}
        <div className="flex items-center gap-0.5 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={13}
              fill={i < ratingInt ? "#FECB19" : "none"}
              color={i < ratingInt ? "#FECB19" : "#d1d5db"}
              strokeWidth={1.5}
            />
          ))}
          <span className="text-xs font-bold text-gray-800 ml-1">
            {property.rating}
          </span>
          <span className="text-xs text-gray-400 ml-1">
            &middot; {property.reviews_count} reviews
          </span>
        </div>

        {/* Pricing */}
        <div
          className="flex items-start justify-between pt-2.5"
          style={{ borderTop: "1px solid #f0f0f0" }}
        >
          <div>
            <p className="text-[11px] text-gray-400 leading-none mb-0.5">
              Starting from
            </p>
            <p className="text-lg font-black text-gray-900 leading-tight">
              &#8377;
              {(totalPrice ?? property.min_price).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="text-right">
            {nights > 0 ? (
              <>
                <p className="text-[11px] text-gray-400 leading-snug">
                  For {nights} Nights + Taxes
                </p>
                <p className="text-[11px] text-gray-400 leading-snug">
                  &#8377;{property.min_price.toLocaleString("en-IN")} per night
                </p>
              </>
            ) : (
              <p className="text-[11px] text-gray-400 leading-snug mt-4">
                per night
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

//    Section Row

function SectionRow({
  title,
  subtitle,
  properties,
  loading,
  userCoords,
  dateRange,
}: {
  title: string;
  subtitle: string;
  properties: ApiProperty[];
  loading: boolean;
  userCoords: { lat: number; lng: number } | null;
  dateRange?: DateRange;
}) {
  if (!loading && properties.length === 0) return null;

  return (
    <section className="py-10">
      <div className="container">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">{title}</h2>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
          {properties.length > 0 && (
            <button
              className="flex items-center gap-1.5 text-sm font-bold hover:gap-2.5 transition-all"
              style={{ color: "#F95622" }}
            >
              See all <ArrowRight size={15} />
            </button>
          )}
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {properties.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                userCoords={userCoords}
                dateRange={dateRange}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

//    Page

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
  const [activeExperiences, setActiveExperiences] = useState<string[]>([]);
  // API states
  const [states, setStates] = useState<{ id: number; name: string }[]>([]);

  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Section data
  const [nearbyProps, setNearbyProps] = useState<ApiProperty[]>([]);
  const [featuredProps, setFeaturedProps] = useState<ApiProperty[]>([]);
  const [honeymoonProps, setHoneymoonProps] = useState<ApiProperty[]>([]);
  const [mountainProps, setMountainProps] = useState<ApiProperty[]>([]);
  const [loadingNearby, setLoadingNearby] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingHoneymoon, setLoadingHoneymoon] = useState(true);
  const [loadingMountain, setLoadingMountain] = useState(true);

  useEffect(() => {
    // States for dropdown
    fetch(`${API_BASE}/states`)
      .then((r) => r.json())
      .then((data) => setStates(data.states ?? []))
      .catch(() => {});

    // Featured / Explore Places
    fetch(`${API_BASE}/properties?is_featured=1&per_page=10`)
      .then((r) => r.json())
      .then((data) => setFeaturedProps(data.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingFeatured(false));

    // Honeymoon Couples
    fetch(`${API_BASE}/properties?experience_types[]=honeymoon&per_page=10`)
      .then((r) => r.json())
      .then((data) => setHoneymoonProps(data.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingHoneymoon(false));

    // Mountain Lovers
    fetch(`${API_BASE}/properties?experience_types[]=mountain&per_page=10`)
      .then((r) => r.json())
      .then((data) => setMountainProps(data.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingMountain(false));

    // Spaces Near You — requires geolocation
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserCoords({ lat: latitude, lng: longitude });
          fetch(
            `${API_BASE}/properties?latitude=${latitude}&longitude=${longitude}&radius=50&per_page=10`,
          )
            .then((r) => r.json())
            .then((data) => setNearbyProps(data.data ?? []))
            .catch(() => {})
            .finally(() => setLoadingNearby(false));
        },
        () => setLoadingNearby(false),
      );
    } else {
      setLoadingNearby(false);
    }
  }, []);

  const toggleExperience = (id: string) =>
    setActiveExperiences((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  return (
    <>
      <Navbar />

      {/*   Hero with video background + search           */}
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

          {/*   Search bar   */}
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
                {states.map((s) => (
                  <option
                    key={s.id}
                    value={s.name}
                    style={{ background: "#1a1a1a" }}
                  >
                    {s.name}
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
                  onClick={() => toggleExperience(ef.id)}
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

      {/* --- Spaces Near You ---------------------------------------------- */}
      <main style={{ background: "#F8F7F4" }}>
        <SectionRow
          title="Spaces Near You"
          subtitle="Properties closest to your current location"
          properties={nearbyProps}
          loading={loadingNearby}
          userCoords={userCoords}
          dateRange={dateRange}
        />

        <SectionRow
          title="Explore Places"
          subtitle="Handpicked featured stays across India"
          properties={featuredProps}
          loading={loadingFeatured}
          userCoords={userCoords}
          dateRange={dateRange}
        />

        <SectionRow
          title="Honeymoon Couples"
          subtitle="Romantic escapes perfect for two"
          properties={honeymoonProps}
          loading={loadingHoneymoon}
          userCoords={userCoords}
          dateRange={dateRange}
        />

        <SectionRow
          title="Mountain Lovers"
          subtitle="Breathtaking hill retreats and mountain getaways"
          properties={mountainProps}
          loading={loadingMountain}
          userCoords={userCoords}
          dateRange={dateRange}
        />

        {/* AI CTA */}
        <div className="container pb-16">
          <div
            className="rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6"
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
    </>
  );
}
