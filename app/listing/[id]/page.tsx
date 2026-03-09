"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  Heart,
  Star,
  MapPin,
  Users,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ExternalLink,
  Minus,
  Plus,
  X,
  ChevronDown,
} from "lucide-react";
import { format, differenceInCalendarDays } from "date-fns";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getTablerIcon, getAttractionIcon } from "@/utils/iconMapper";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const STORAGE_BASE = API_BASE.replace(/\/api$/, "");

function resolveImg(src: string | null | undefined): string {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${STORAGE_BASE}/${src.replace(/^\//, "")}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type PropertyImage = { id: number; url: string; caption: string | null };
type PropertyAmenity = { id: number; name: string; icon: string | null };
type PropertyAttraction = {
  id: number;
  name: string;
  icon: string | null;
  distance: string | null;
  description: string | null;
};
type PropertyRoom = {
  id: number;
  name: string;
  capacity: number;
  max_capacity: number;
  price_per_night: number;
  extra_beds: { beds: number; sleeps: number } | null;
};
type PropertyOwner = {
  name: string;
  avatar: string | null;
  city?: string;
  state?: string;
};

type PropertyDetail = {
  id: number;
  name: string;
  description: string;
  property_type: string;
  city: string;
  state: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  check_in_time: string;
  check_out_time: string;
  cancellation_policy: string | null;
  refund_policy: string | null;
  house_rules: string | null;
  check_in_rules: string[];
  check_out_rules: string[];
  house_rules_list: string[];
  safety_guidelines: string[];
  guest_responsibilities: string[];
  rating: string;
  reviews_count: number;
  images: PropertyImage[];
  amenities: PropertyAmenity[];
  attractions: PropertyAttraction[];
  rooms: PropertyRoom[];
  owner: PropertyOwner;
};

type Review = {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  photos: string[];
  user?: { avatar_url?: string };
};

type RatingBreakdown = {
  hospitality: number;
  food: number;
  rooms: number;
  hygiene: number;
  location: number;
};

type AvailableRoom = {
  room_id: number;
  room_type: string;
  pricing: { average_per_night: number; total_price: number };
};
type AvailabilityData = {
  available_rooms: AvailableRoom[];
  total_available_rooms: number;
  nights: number;
} | null;

// ─── Calendar Widget ────────────────────────────────────────────────────────────

interface CalendarWidgetProps {
  currentMonth: Date;
  selectedDates: Date[];
  unavailableDates: string[];
  onDateClick: (day: number) => void;
  onMonthChange: (increment: boolean) => void;
}

function CalendarWidget({
  currentMonth,
  selectedDates,
  unavailableDates,
  onDateClick,
  onMonthChange,
}: CalendarWidgetProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const isPast = (day: number) => {
    const d = new Date(year, month, day);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const isSoldOut = (day: number) => {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return unavailableDates.includes(key);
  };

  const isSelected = (day: number) => {
    if (selectedDates.length === 0) return false;
    const d = new Date(year, month, day);
    return selectedDates.some((s) => s.getTime() === d.getTime());
  };

  const isInRange = (day: number) => {
    if (selectedDates.length !== 2) return false;
    const d = new Date(year, month, day);
    return d > selectedDates[0] && d < selectedDates[1];
  };

  const isStart = (day: number) =>
    selectedDates.length >= 1 &&
    new Date(year, month, day).getTime() === selectedDates[0].getTime();

  const isEnd = (day: number) =>
    selectedDates.length === 2 &&
    new Date(year, month, day).getTime() === selectedDates[1].getTime();

  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div
      className="bg-white rounded-2xl p-5"
      style={{ border: "1px solid #efefef" }}
    >
      <p className="text-sm font-bold text-gray-700 mb-5">
        Select check-in &amp; check-out date
      </p>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => onMonthChange(false)}
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors"
          style={{ border: "1px solid #e5e7eb" }}
        >
          <ChevronLeft size={16} color="#555" />
        </button>
        <span className="font-bold text-gray-900">{monthLabel}</span>
        <button
          onClick={() => onMonthChange(true)}
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors"
          style={{ border: "1px solid #e5e7eb" }}
        >
          <ChevronRight size={16} color="#555" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold text-gray-400 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`e${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const disabled = isPast(day) || isSoldOut(day);
          const selected = isSelected(day);
          const inRange = isInRange(day);
          const start = isStart(day);
          const end = isEnd(day);
          const hasRange = selectedDates.length === 2;
          return (
            <div
              key={day}
              onClick={() => !disabled && onDateClick(day)}
              className="relative flex items-center justify-center"
              style={{ height: "44px" }}
            >
              {/* Continuous yellow band for range */}
              {(inRange || (start && hasRange) || (end && hasRange)) && (
                <div
                  className="absolute inset-y-1"
                  style={{
                    background: "rgba(254,203,25,0.18)",
                    left: start ? "50%" : 0,
                    right: end ? "50%" : 0,
                  }}
                />
              )}
              <span
                className={`relative z-10 w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
                  selected
                    ? "bg-gray-900 text-white"
                    : inRange
                      ? "text-gray-800"
                      : disabled
                        ? "text-gray-300"
                        : "text-gray-900 hover:bg-gray-100 cursor-pointer"
                }`}
              >
                {day}
              </span>
              {/* Sold-out dot */}
              {isSoldOut(day) && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-400" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Rating Circle ─────────────────────────────────────────────────────────────

function RatingCircle({ value, label }: { value: number; label: string }) {
  const circumference = 2 * Math.PI * 40;
  const filled = (value / 5) * circumference;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#F1EFEA"
            strokeWidth="10"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#FECB19"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - filled}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-black text-sm text-gray-900">
          {value > 0 ? value.toFixed(1) : "—"}
        </span>
      </div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ListingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Image gallery
  const [imgIdx, setImgIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  // UI states
  const [wishlisted, setWishlisted] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [galleryTab, setGalleryTab] = useState<"hotel" | "guest">("hotel");
  const [amenitiesModalOpen, setAmenitiesModalOpen] = useState(false);
  const [attractionsModalOpen, setAttractionsModalOpen] = useState(false);
  const [expandedRules, setExpandedRules] = useState(false);
  const [expandedCancellation, setExpandedCancellation] = useState(false);
  const [expandedRefund, setExpandedRefund] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(
    new Set(),
  );

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingBreakdown, setRatingBreakdown] = useState<RatingBreakdown>({
    hospitality: 0,
    food: 0,
    rooms: 0,
    hygiene: 0,
    location: 0,
  });

  // Availability
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0 });
  const [availabilityData, setAvailabilityData] =
    useState<AvailabilityData>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null,
  );

  // ── Derived ──────────────────────────────────────────────────────────────────

  const nights =
    selectedDates.length === 2
      ? Math.max(
          0,
          differenceInCalendarDays(selectedDates[1], selectedDates[0]),
        )
      : 0;

  const minPrice =
    property?.rooms && property.rooms.length > 0
      ? Math.min(...property.rooms.map((r) => r.price_per_night))
      : 0;

  const allImages =
    property?.images?.map((img) => resolveImg(img.url)).filter(Boolean) ?? [];

  const guestImages = reviews
    .flatMap((r) => r.photos ?? [])
    .map(resolveImg)
    .filter(Boolean);
  const displayImages =
    galleryTab === "guest" && guestImages.length > 0 ? guestImages : allImages;

  const maxGuests =
    property?.rooms?.reduce(
      (s, r) => s + (r.max_capacity || r.capacity || 0),
      0,
    ) ?? 0;

  const ratingInt = Math.round(parseFloat(property?.rating ?? "0"));

  const shortDesc =
    (property?.description?.length ?? 0) > 220
      ? property!.description.substring(0, 220) + "…"
      : (property?.description ?? "");

  const hasRules =
    property &&
    (property.house_rules ||
      property.check_in_rules.length > 0 ||
      property.check_out_rules.length > 0 ||
      property.house_rules_list.length > 0 ||
      property.safety_guidelines.length > 0 ||
      property.guest_responsibilities.length > 0);

  // ── Data fetching ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/properties/${id}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Not found");
        const raw = await res.json();
        // Handle both { data: PropertyDetail } and direct PropertyDetail responses
        const detail: PropertyDetail = raw?.id ? raw : (raw?.data ?? raw);
        setProperty(detail);
        fetchReviews(detail.id);
      } catch (e: unknown) {
        if (e instanceof Error && e.name !== "AbortError")
          setError("Failed to load property details.");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [id]);

  const fetchReviews = async (propertyId: number) => {
    try {
      const res = await fetch(`${API_BASE}/properties/${propertyId}/reviews`);
      if (!res.ok) return;
      const data = await res.json();
      setReviews(data.reviews ?? []);
      if (data.rating_breakdown) setRatingBreakdown(data.rating_breakdown);
    } catch {
      /* no-op */
    }
  };

  const checkAvailability = async (checkIn: Date, checkOut: Date) => {
    if (!property) return;
    setCheckingAvailability(true);
    setAvailabilityError(null);
    try {
      const res = await fetch(
        `${API_BASE}/properties/${property.id}/check-availability`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            check_in: format(checkIn, "yyyy-MM-dd"),
            check_out: format(checkOut, "yyyy-MM-dd"),
          }),
        },
      );
      if (!res.ok) throw new Error("availability_failed");
      const data = await res.json();
      setAvailabilityData(data);
    } catch {
      setAvailabilityError("Unable to check availability. Please try again.");
      setAvailabilityData(null);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const fetchUnavailableDates = async (year: number, month: number) => {
    if (!property) return;
    try {
      const res = await fetch(
        `${API_BASE}/properties/${property.id}/unavailable-dates?year=${year}&month=${month}`,
      );
      if (!res.ok) return;
      const data = await res.json();
      const freshDates: string[] = data.unavailable_dates ?? [];
      const prefix = `${year}-${String(month).padStart(2, "0")}`;
      setUnavailableDates((prev) => [
        ...prev.filter((d) => !d.startsWith(prefix)),
        ...freshDates,
      ]);
    } catch {
      /* no-op */
    }
  };

  const handleDateClick = (day: number) => {
    const clicked = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    if (selectedDates.length === 0 || selectedDates.length === 2) {
      setAvailabilityData(null);
      setAvailabilityError(null);
      setSelectedDates([clicked]);
    } else {
      const sorted =
        selectedDates[0] <= clicked
          ? [selectedDates[0], clicked]
          : [clicked, selectedDates[0]];
      setSelectedDates(sorted);
      checkAvailability(sorted[0], sorted[1]);
    }
  };

  const changeMonth = (increment: boolean) => {
    setCurrentMonth(
      (prev) =>
        new Date(prev.getFullYear(), prev.getMonth() + (increment ? 1 : -1)),
    );
  };

  // Fetch unavailable dates when property loads or month changes
  useEffect(() => {
    if (property) {
      fetchUnavailableDates(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property?.id, currentMonth.getFullYear(), currentMonth.getMonth()]);

  const handleShare = async () => {
    const url = window.location.href;
    const title = property?.name ?? "Property";
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* dismissed */
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        /* no-op */
      }
    }
  };

  const toggleReadMore = (reviewId: number) => {
    setExpandedReviews((prev) => {
      const s = new Set(prev);
      s.has(reviewId) ? s.delete(reviewId) : s.add(reviewId);
      return s;
    });
  };

  // ── Loading ───────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-16 container max-w-4xl py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-72 bg-gray-100 rounded-2xl" />
            <div className="h-8 bg-gray-100 rounded-xl w-2/3" />
            <div className="h-4 bg-gray-100 rounded-xl w-1/3" />
            <div className="h-32 bg-gray-100 rounded-2xl" />
            <div className="h-32 bg-gray-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────────

  if (error || !property) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-16 container max-w-4xl py-20 text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-4">
            Property not found
          </h2>
          <p className="text-gray-500 mb-8">
            {error ?? "This listing may have been removed or does not exist."}
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm"
            style={{ background: "#FECB19", color: "#0A0A0A" }}
          >
            <ArrowLeft size={16} /> Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  const displayPrice =
    availabilityData && availabilityData.available_rooms.length > 0
      ? Math.min(
          ...availabilityData.available_rooms.map(
            (r) => r.pricing.average_per_night,
          ),
        )
      : minPrice;

  return (
    <div className="min-h-screen" style={{ background: "#f0efea" }}>
      <Navbar forceDark />

      {/* ── Image Gallery ─────────────────────────────────────────────────── */}
      <div className="pt-16" style={{ background: "#f0efea" }}>
        <div className="container max-w-4xl">
          <div
            className="relative overflow-hidden"
            style={{
              height: "clamp(340px, 65vh, 600px)",
              borderRadius: "0 0 1.5rem 1.5rem",
            }}
          >
            {displayImages.length > 0 ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={displayImages[imgIdx]}
                alt={property.name}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => {
                  setLightboxIdx(imgIdx);
                  setLightboxOpen(true);
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <p className="text-gray-400">No images available</p>
              </div>
            )}

            {/* Image nav arrows */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setImgIdx(
                      (i) =>
                        (i - 1 + displayImages.length) % displayImages.length,
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
                >
                  <ChevronLeft size={20} color="#333" />
                </button>
                <button
                  onClick={() =>
                    setImgIdx((i) => (i + 1) % displayImages.length)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
                >
                  <ChevronRight size={20} color="#333" />
                </button>

                {/* Dots — hidden when guest tab is available */}
                {guestImages.length === 0 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {displayImages.slice(0, 8).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        className={`rounded-full transition-all duration-200 ${
                          i === imgIdx
                            ? "w-5 h-2 bg-white"
                            : "w-2 h-2 bg-white/60"
                        }`}
                      />
                    ))}
                    {displayImages.length > 8 && (
                      <span className="text-white/70 text-xs self-center ml-1">
                        +{displayImages.length - 8}
                      </span>
                    )}
                  </div>
                )}

                {/* Counter pill */}
                <div
                  className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{
                    background: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {imgIdx + 1} / {displayImages.length}
                </div>
              </>
            )}

            {/* Hotel / Guest photo tabs */}
            {guestImages.length > 0 && (
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 p-1 rounded-full z-10"
                style={{
                  background: "rgba(0,0,0,0.45)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <button
                  onClick={() => {
                    setGalleryTab("hotel");
                    setImgIdx(0);
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                    galleryTab === "hotel"
                      ? "bg-white text-gray-900"
                      : "text-white/90"
                  }`}
                >
                  Hotel ({allImages.length})
                </button>
                <button
                  onClick={() => {
                    setGalleryTab("guest");
                    setImgIdx(0);
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                    galleryTab === "guest"
                      ? "bg-white text-gray-900"
                      : "text-white/90"
                  }`}
                >
                  Guest ({guestImages.length})
                </button>
              </div>
            )}

            {/* Back + actions overlay */}
            <div className="absolute top-4 left-4">
              <button
                onClick={() => router.back()}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <ArrowLeft size={18} color="#fff" />
              </button>
            </div>
            <div className="absolute top-4 right-16 flex gap-2">
              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Share2 size={16} color="#fff" />
              </button>
              <button
                onClick={() => setWishlisted((w) => !w)}
                className="w-10 h-10 rounded-full flex items-center justify-center"
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
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <div className="container max-w-4xl py-6 pb-36">
        <div
          className="bg-white rounded-3xl p-6 sm:p-8"
          style={{ marginTop: "1rem", marginBottom: "14rem" }}
        >
          {/* Property header */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="text-3xl font-black text-gray-900 leading-tight">
                {property.name}
              </h1>
              <span
                className="shrink-0 px-3 py-1 rounded-full text-xs font-bold capitalize mt-1"
                style={{ background: "#F1EFEA", color: "#555" }}
              >
                {property.property_type}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {property.city}, {property.state}
              </span>
              {property.reviews_count > 0 && (
                <span className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      fill={i < ratingInt ? "#FECB19" : "none"}
                      color={i < ratingInt ? "#FECB19" : "#d1d5db"}
                      strokeWidth={1.5}
                    />
                  ))}
                  <span className="font-bold text-gray-900 ml-0.5">
                    {property.rating}
                  </span>
                  <span className="text-gray-400">
                    ({property.reviews_count} reviews)
                  </span>
                </span>
              )}
            </div>

            {/* Quick info chips */}
            <div className="flex flex-wrap gap-2">
              {maxGuests > 0 && (
                <span
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
                  style={{ background: "#F1EFEA" }}
                >
                  <Users size={14} color="#666" /> Up to {maxGuests} guests
                </span>
              )}
              {property.rooms.length > 0 && (
                <span
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
                  style={{ background: "#F1EFEA" }}
                >
                  <BedDouble size={14} color="#666" /> {property.rooms.length}{" "}
                  {property.rooms.length === 1 ? "room" : "rooms"}
                </span>
              )}
              {property.check_in_time && (
                <span
                  className="px-3 py-1.5 rounded-full text-sm font-semibold"
                  style={{ background: "#F1EFEA" }}
                >
                  Check-in: {property.check_in_time}
                </span>
              )}
              {property.check_out_time && (
                <span
                  className="px-3 py-1.5 rounded-full text-sm font-semibold"
                  style={{ background: "#F1EFEA" }}
                >
                  Check-out: {property.check_out_time}
                </span>
              )}
            </div>
          </div>

          <hr className="border-gray-100 mb-6" />

          {/* Host */}
          <div className="flex items-center gap-4 mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                resolveImg(property.owner?.avatar) ||
                "/images/default-avatar.jpg"
              }
              alt={property.owner?.name ?? "Host"}
              className="w-14 h-14 rounded-full object-cover flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/images/default-avatar.jpg";
              }}
            />
            <div>
              <p className="text-sm text-gray-400">Hosted by</p>
              <p className="font-black text-gray-900 text-lg">
                {property.owner?.name}
              </p>
              {(property.owner?.city || property.owner?.state) && (
                <p className="text-xs text-gray-400">
                  {[property.owner.city, property.owner.state]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
            </div>
          </div>

          <hr className="border-gray-100 mb-6" />

          {/* About */}
          {property.description && (
            <section className="mb-6">
              <h2 className="text-xl font-black text-gray-900 mb-3">
                About this place
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                {showFullDescription ? property.description : shortDesc}
              </p>
              {(property.description?.length ?? 0) > 220 && (
                <button
                  onClick={() => setShowFullDescription((f) => !f)}
                  className="text-sm font-bold mt-2 underline underline-offset-2"
                  style={{ color: "#F95622" }}
                >
                  {showFullDescription ? "Show less" : "Show more"}
                </button>
              )}
            </section>
          )}

          {property.description && <hr className="border-gray-100 mb-6" />}

          {/* Rating breakdown */}
          {property.reviews_count > 0 && (
            <>
              <section className="mb-6">
                <div className="flex items-center gap-2 mb-5">
                  <Star size={20} fill="#FECB19" color="#FECB19" />
                  <span className="text-2xl font-black text-gray-900">
                    {property.rating}
                  </span>
                  <span className="text-gray-500 font-medium">
                    · {property.reviews_count}{" "}
                    {property.reviews_count === 1 ? "review" : "reviews"}
                  </span>
                </div>
                <div className="flex gap-6 flex-wrap">
                  {(
                    [
                      {
                        label: "Hospitality",
                        value: ratingBreakdown.hospitality,
                      },
                      { label: "Food", value: ratingBreakdown.food },
                      { label: "Rooms", value: ratingBreakdown.rooms },
                      { label: "Hygiene", value: ratingBreakdown.hygiene },
                      { label: "Location", value: ratingBreakdown.location },
                    ] as { label: string; value: number }[]
                  ).map((item) => (
                    <RatingCircle
                      key={item.label}
                      value={item.value}
                      label={item.label}
                    />
                  ))}
                </div>
              </section>
              <hr className="border-gray-100 mb-6" />
            </>
          )}

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <>
              <section className="mb-6">
                <h2 className="text-xl font-black text-gray-900 mb-4">
                  What&apos;s included
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.slice(0, 6).map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-2.5 p-3 rounded-xl"
                      style={{
                        background: "#F8F7F4",
                        border: "1px solid #efefef",
                      }}
                    >
                      <span className="shrink-0 text-gray-500">
                        {getTablerIcon(a.icon, 17, 1.5)}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {a.name}
                      </span>
                    </div>
                  ))}
                </div>
                {property.amenities.length > 6 && (
                  <button
                    onClick={() => setAmenitiesModalOpen(true)}
                    className="mt-3 text-sm font-bold underline underline-offset-2"
                    style={{ color: "#F95622" }}
                  >
                    Show all {property.amenities.length} amenities
                  </button>
                )}
              </section>
              <hr className="border-gray-100 mb-6" />
            </>
          )}

          {/* Attractions */}
          {property.attractions.length > 0 && (
            <>
              <section className="mb-6">
                <h2 className="text-xl font-black text-gray-900 mb-4">
                  Nearby attractions
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.attractions.slice(0, 6).map((a) => (
                    <div
                      key={a.id}
                      className="flex items-start gap-2.5 p-3 rounded-xl"
                      style={{
                        background: "#F8F7F4",
                        border: "1px solid #efefef",
                      }}
                    >
                      <span
                        className="shrink-0 mt-0.5"
                        style={{ color: "#F95622" }}
                      >
                        {getAttractionIcon(a.icon, 16, 1.5)}
                      </span>
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          {a.name}
                        </span>
                        {a.distance && (
                          <p className="text-xs text-gray-400">{a.distance}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {property.attractions.length > 6 && (
                  <button
                    onClick={() => setAttractionsModalOpen(true)}
                    className="mt-3 text-sm font-bold underline underline-offset-2"
                    style={{ color: "#F95622" }}
                  >
                    Show all {property.attractions.length} attractions
                  </button>
                )}
              </section>
              <hr className="border-gray-100 mb-6" />
            </>
          )}

          {/* Check Availability */}
          <section id="availability" className="mb-6">
            <h2 className="text-xl font-black text-gray-900 mb-4">
              Check availability
            </h2>

            {/* Two-column layout: calendar left, panel right */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              {/* ── Left: Calendar ── */}
              <CalendarWidget
                currentMonth={currentMonth}
                selectedDates={selectedDates}
                unavailableDates={unavailableDates}
                onDateClick={handleDateClick}
                onMonthChange={changeMonth}
              />

              {/* ── Right: Status / Guest panel ── */}
              <div
                className="rounded-2xl p-5 flex flex-col gap-4 min-h-[220px]"
                style={{ background: "#F8F7F4", border: "1px solid #efefef" }}
              >
                {selectedDates.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full gap-3 py-8 text-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(254,203,25,0.18)" }}
                    >
                      <Star size={22} fill="#FECB19" color="#FECB19" />
                    </div>
                    <p className="font-bold text-gray-800 text-sm">
                      Pick your dates
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Select a check-in date on the calendar to begin
                    </p>
                  </div>
                )}

                {selectedDates.length === 1 && (
                  <div className="flex flex-col items-center justify-center h-full gap-3 py-8 text-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(249,86,34,0.1)" }}
                    >
                      <ChevronRight size={22} color="#F95622" />
                    </div>
                    <p className="font-bold text-gray-800 text-sm">
                      Check-in: {format(selectedDates[0], "dd MMM yyyy")}
                    </p>
                    <p className="text-xs text-gray-400">
                      Now select a check-out date
                    </p>
                  </div>
                )}

                {selectedDates.length === 2 && (
                  <>
                    {/* Date summary bar */}
                    <div
                      className="rounded-xl p-3"
                      style={{
                        background: "white",
                        border: "1px solid #efefef",
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs text-gray-400 space-y-1">
                          <div>
                            <span className="font-bold text-gray-600">
                              Check-in
                            </span>
                            <p className="font-black text-gray-900 text-sm">
                              {format(selectedDates[0], "dd MMM yyyy")}
                            </p>
                          </div>
                          <div>
                            <span className="font-bold text-gray-600">
                              Check-out
                            </span>
                            <p className="font-black text-gray-900 text-sm">
                              {format(selectedDates[1], "dd MMM yyyy")}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className="text-2xl font-black"
                            style={{ color: "#0A0A0A" }}
                          >
                            {nights}
                          </p>
                          <p className="text-xs text-gray-400">
                            night{nights !== 1 ? "s" : ""}
                          </p>
                          <button
                            onClick={() => {
                              setSelectedDates([]);
                              setAvailabilityData(null);
                              setAvailabilityError(null);
                            }}
                            className="text-xs font-bold underline underline-offset-2 mt-2 block"
                            style={{ color: "#F95622" }}
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Spinner */}
                    {checkingAvailability && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                        Checking availability…
                      </div>
                    )}

                    {/* Available → guest selector */}
                    {!checkingAvailability &&
                      availabilityData &&
                      (availabilityData.available_rooms.length > 0 ? (
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-green-700 flex items-center gap-1.5 mb-3">
                            <CheckCircle2 size={14} />
                            {availabilityData.total_available_rooms} room
                            {availabilityData.total_available_rooms !== 1
                              ? "s"
                              : ""}{" "}
                            available
                          </p>
                          {(
                            [
                              {
                                label: "Adults",
                                sub: "18+ years",
                                key: "adults" as const,
                                min: 1,
                              },
                              {
                                label: "Children",
                                sub: "2–17 years",
                                key: "children" as const,
                                min: 0,
                              },
                              {
                                label: "Infants",
                                sub: "Under 2",
                                key: "infants" as const,
                                min: 0,
                              },
                            ] as {
                              label: string;
                              sub: string;
                              key: keyof typeof guests;
                              min: number;
                            }[]
                          ).map((g) => (
                            <div
                              key={g.key}
                              className="flex items-center justify-between py-2"
                              style={{
                                borderBottom: "1px solid #f0f0f0",
                              }}
                            >
                              <div>
                                <p className="text-sm font-bold text-gray-900">
                                  {g.label}
                                </p>
                                <p className="text-xs text-gray-400">{g.sub}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() =>
                                    setGuests((prev) => ({
                                      ...prev,
                                      [g.key]: Math.max(g.min, prev[g.key] - 1),
                                    }))
                                  }
                                  disabled={guests[g.key] <= g.min}
                                  className="w-8 h-8 rounded-full flex items-center justify-center border font-bold text-gray-700 disabled:opacity-30 hover:border-gray-400 bg-white transition-colors"
                                  style={{ borderColor: "#e5e7eb" }}
                                >
                                  <Minus size={13} />
                                </button>
                                <span className="text-sm font-black text-gray-900 w-4 text-center">
                                  {guests[g.key]}
                                </span>
                                <button
                                  onClick={() =>
                                    setGuests((prev) => ({
                                      ...prev,
                                      [g.key]: prev[g.key] + 1,
                                    }))
                                  }
                                  className="w-8 h-8 rounded-full flex items-center justify-center border font-bold text-gray-700 hover:border-gray-400 bg-white transition-colors"
                                  style={{ borderColor: "#e5e7eb" }}
                                >
                                  <Plus size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div
                          className="p-3 rounded-xl"
                          style={{
                            background: "#fff0f0",
                            border: "1px solid #fecaca",
                          }}
                        >
                          <p className="font-bold text-red-700 text-sm">
                            ✗ No rooms available
                          </p>
                          <p className="text-gray-500 mt-1 text-xs">
                            Please try different dates
                          </p>
                        </div>
                      ))}

                    {/* Error */}
                    {!checkingAvailability && availabilityError && (
                      <div
                        className="p-3 rounded-xl"
                        style={{
                          background: "#fffbeb",
                          border: "1px solid #fde68a",
                        }}
                      >
                        <p className="font-bold text-yellow-700 text-sm">
                          ⚠ {availabilityError}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>

          <hr className="border-gray-100 mb-6" />

          {/* Map */}
          {property.latitude && property.longitude && (
            <>
              <section className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl font-black text-gray-900">Location</h2>
                  <button
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`,
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity shrink-0"
                    style={{
                      background: "#F1EFEA",
                      color: "#0A0A0A",
                    }}
                  >
                    <ExternalLink size={14} /> Open in Google Maps
                  </button>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  {property.address || `${property.city}, ${property.state}`}
                </p>
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ height: 320 }}
                >
                  <iframe
                    title="Property location"
                    className="w-full h-full"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed&hl=en`}
                  />
                </div>
              </section>
              <hr className="border-gray-100 mb-6" />
            </>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <>
              <section className="mb-6">
                <h2 className="text-xl font-black text-gray-900 mb-5">
                  Guest reviews
                </h2>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 rounded-2xl"
                      style={{ background: "#F8F7F4" }}
                    >
                      {/* Review header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              review.user?.avatar_url ||
                              "/images/user_placeholder.jpg"
                            }
                            alt={review.user_name}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/images/user_placeholder.jpg";
                            }}
                          />
                          <div>
                            <p className="font-bold text-gray-900 text-sm">
                              {review.user_name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(review.created_at).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-0.5 mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={13}
                              fill={i < review.rating ? "#FECB19" : "none"}
                              color={i < review.rating ? "#FECB19" : "#d1d5db"}
                              strokeWidth={1.5}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Comment */}
                      {review.comment && (
                        <div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {expandedReviews.has(review.id) ||
                            review.comment.length <= 200
                              ? review.comment
                              : `${review.comment.substring(0, 200)}…`}
                          </p>
                          {review.comment.length > 200 && (
                            <button
                              onClick={() => toggleReadMore(review.id)}
                              className="text-xs font-bold mt-1.5 underline"
                              style={{ color: "#F95622" }}
                            >
                              {expandedReviews.has(review.id)
                                ? "Read less"
                                : "Read more"}
                            </button>
                          )}
                        </div>
                      )}

                      {/* Review photos */}
                      {review.photos && review.photos.length > 0 && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {review.photos.slice(0, 4).map((photo, i) => (
                            <div
                              key={i}
                              className="relative w-16 h-16 rounded-xl overflow-hidden"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={photo}
                                alt={`Review photo ${i + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {i === 3 && review.photos.length > 4 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">
                                    +{review.photos.length - 4}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
              <hr className="border-gray-100 mb-6" />
            </>
          )}

          {/* Policies */}
          {(property.cancellation_policy ||
            property.refund_policy ||
            hasRules) && (
            <>
              <section className="mb-6">
                <h2 className="text-xl font-black text-gray-900 mb-4">
                  Policies
                </h2>
                <div className="space-y-3">
                  {/* Cancellation */}
                  {property.cancellation_policy && (
                    <div
                      className="rounded-2xl overflow-hidden"
                      style={{ border: "1px solid #efefef" }}
                    >
                      <button
                        onClick={() => setExpandedCancellation((v) => !v)}
                        className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-bold text-gray-900">
                          Cancellation policy
                        </span>
                        <ChevronDown
                          size={18}
                          className={`transition-transform text-gray-400 ${expandedCancellation ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence>
                        {expandedCancellation && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            {/* Admin-controlled HTML content — sanitized server-side */}
                            <div
                              className="px-4 pb-4 text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: property.cancellation_policy,
                              }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Refund */}
                  {property.refund_policy && (
                    <div
                      className="rounded-2xl overflow-hidden"
                      style={{ border: "1px solid #efefef" }}
                    >
                      <button
                        onClick={() => setExpandedRefund((v) => !v)}
                        className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-bold text-gray-900">
                          Refund policy
                        </span>
                        <ChevronDown
                          size={18}
                          className={`transition-transform text-gray-400 ${expandedRefund ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence>
                        {expandedRefund && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            {/* Admin-controlled HTML content — sanitized server-side */}
                            <div
                              className="px-4 pb-4 text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: property.refund_policy,
                              }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* House rules */}
                  {hasRules && (
                    <div
                      className="rounded-2xl overflow-hidden"
                      style={{ border: "1px solid #efefef" }}
                    >
                      <button
                        onClick={() => setExpandedRules((v) => !v)}
                        className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-bold text-gray-900">
                          Property rules
                        </span>
                        <ChevronDown
                          size={18}
                          className={`transition-transform text-gray-400 ${expandedRules ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence>
                        {expandedRules && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-1.5 text-sm text-gray-600">
                              {property.check_in_time && (
                                <p>
                                  <span className="font-bold">Check-in:</span>{" "}
                                  {property.check_in_time}
                                </p>
                              )}
                              {property.check_out_time && (
                                <p>
                                  <span className="font-bold">Check-out:</span>{" "}
                                  {property.check_out_time}
                                </p>
                              )}
                              {maxGuests > 0 && (
                                <p>
                                  <span className="font-bold">Max guests:</span>{" "}
                                  {maxGuests}
                                </p>
                              )}
                              {property.house_rules && (
                                <p>{property.house_rules}</p>
                              )}
                              {[
                                ...property.check_in_rules,
                                ...property.check_out_rules,
                                ...property.house_rules_list,
                                ...property.safety_guidelines,
                                ...property.guest_responsibilities,
                              ].map((rule, i) => (
                                <p key={i}>• {rule}</p>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </section>
              <hr className="border-gray-100 mb-6" />
            </>
          )}

          {/* About Host */}
          <section className="mb-6">
            <h2 className="text-xl font-black text-gray-900 mb-4">
              About your host
            </h2>
            <div
              className="p-5 rounded-2xl flex items-start gap-4"
              style={{ background: "#F8F7F4", border: "1px solid #efefef" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  resolveImg(property.owner?.avatar) ||
                  "/images/default-avatar.jpg"
                }
                alt={property.owner?.name ?? "Host"}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/images/default-avatar.jpg";
                }}
              />
              <div>
                <p className="font-black text-gray-900 text-lg mb-0.5">
                  {property.owner?.name}
                </p>
                {(property.owner?.city || property.owner?.state) && (
                  <p className="text-sm text-gray-500 mb-2">
                    {[property.owner.city, property.owner.state]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
                <span
                  className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "#F1EFEA", color: "#555" }}
                >
                  ✓ Identity Verified
                </span>
              </div>
            </div>
            <div
              className="mt-4 p-4 rounded-2xl flex items-start gap-3 text-sm text-gray-500"
              style={{ background: "#F8F7F4" }}
            >
              <span className="text-lg">🔒</span>
              <p>
                To safeguard your payment, refrain from transferring money or
                communicating through channels outside of the Bayaroo website or
                app.
              </p>
            </div>
          </section>
        </div>
        {/* end white card */}
      </div>

      {/* Footer */}
      <div className="pb-20">
        <Footer />
      </div>

      {/* ── Fixed booking footer ──────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-4 px-4">
        <div
          className="container max-w-4xl mx-auto pointer-events-auto"
          style={{ maxWidth: "640px" }}
        >
          <div
            className="flex items-center justify-between gap-4 py-3 px-5"
            style={{
              boxShadow: "#0000003b 0px 4px 32px",
              border: "1px solid #d1d1d1",
              borderRadius: "200px",
              background: "#ffffff",
            }}
          >
            <div>
              {checkingAvailability ? (
                <p className="text-sm text-gray-500 animate-pulse">
                  Checking availability…
                </p>
              ) : availabilityData &&
                availabilityData.available_rooms.length > 0 ? (
                <>
                  <p className="text-lg font-black text-gray-900 leading-tight">
                    ₹{displayPrice.toLocaleString("en-IN")}
                    <span className="text-sm font-medium text-gray-400">
                      {" "}
                      /night
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    {availabilityData.nights} nights ·{" "}
                    {availabilityData.total_available_rooms} room
                    {availabilityData.total_available_rooms !== 1
                      ? "s"
                      : ""}{" "}
                    available
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg font-black text-gray-900 leading-tight">
                    {minPrice > 0 ? (
                      <>
                        ₹{minPrice.toLocaleString("en-IN")}
                        <span className="text-sm font-medium text-gray-400">
                          {" "}
                          /night
                        </span>
                      </>
                    ) : (
                      <span className="text-base text-gray-400">
                        Price on request
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedDates.length === 2
                      ? "Check rooms on the calendar above"
                      : "Select dates to check availability"}
                  </p>
                </>
              )}
            </div>

            {/* CTA: Select Dates → scroll to calendar | Select Rooms → app */}
            {selectedDates.length === 2 &&
            availabilityData &&
            availabilityData.available_rooms.length > 0 ? (
              <Link
                href={`/select-rooms/${property?.id}?check_in=${format(selectedDates[0], "yyyy-MM-dd")}&check_out=${format(selectedDates[1], "yyyy-MM-dd")}&adults=${guests.adults}&children=${guests.children}&infants=${guests.infants}`}
                className="font-black text-sm px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity shrink-0"
                style={{
                  background: "linear-gradient(135deg,#FECB19,#F95622)",
                  color: "#0A0A0A",
                }}
              >
                Select Rooms
              </Link>
            ) : (
              <button
                onClick={() => {
                  document
                    .getElementById("availability")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="font-black text-sm px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity shrink-0"
                style={{
                  background: "linear-gradient(135deg,#FECB19,#F95622)",
                  color: "#0A0A0A",
                }}
              >
                Select Dates
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Amenities Modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {amenitiesModalOpen && property && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAmenitiesModalOpen(false)}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden"
              style={{ maxHeight: "85vh" }}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-gray-200" />
              </div>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-black text-gray-900">
                  What&apos;s included
                </h3>
                <button
                  onClick={() => setAmenitiesModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={16} color="#555" />
                </button>
              </div>
              <div
                className="overflow-y-auto p-6"
                style={{ maxHeight: "calc(85vh - 80px)" }}
              >
                <p className="text-sm text-gray-400 mb-4">
                  {property.amenities.length} amenities available
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {property.amenities.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-2.5 p-3 rounded-xl"
                      style={{
                        background: "#F8F7F4",
                        border: "1px solid #efefef",
                      }}
                    >
                      <span className="shrink-0 text-gray-500">
                        {getTablerIcon(a.icon, 17, 1.5)}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {a.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Attractions Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {attractionsModalOpen && property && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAttractionsModalOpen(false)}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden"
              style={{ maxHeight: "85vh" }}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-gray-200" />
              </div>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-black text-gray-900">
                  Nearby attractions
                </h3>
                <button
                  onClick={() => setAttractionsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={16} color="#555" />
                </button>
              </div>
              <div
                className="overflow-y-auto p-6"
                style={{ maxHeight: "calc(85vh - 80px)" }}
              >
                <p className="text-sm text-gray-400 mb-4">
                  {property.attractions.length} attractions nearby
                </p>
                <div className="space-y-3">
                  {property.attractions.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-start gap-3 p-4 rounded-xl"
                      style={{
                        background: "#F8F7F4",
                        border: "1px solid #efefef",
                      }}
                    >
                      <span
                        className="shrink-0 mt-0.5"
                        style={{ color: "#F95622" }}
                      >
                        {getAttractionIcon(a.icon, 16, 1.5)}
                      </span>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">
                          {a.name}
                        </p>
                        {a.distance && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {a.distance}
                          </p>
                        )}
                        {a.description && (
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            {a.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Image Lightbox ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxOpen && displayImages.length > 0 && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X size={20} color="#fff" />
            </button>
            <button
              onClick={() =>
                setLightboxIdx(
                  (i) => (i - 1 + displayImages.length) % displayImages.length,
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={22} color="#fff" />
            </button>
            <motion.img
              key={lightboxIdx}
              src={displayImages[lightboxIdx]}
              alt=""
              className="max-w-full max-h-full object-contain px-16 py-16"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            />
            <button
              onClick={() =>
                setLightboxIdx((i) => (i + 1) % displayImages.length)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <ChevronRight size={22} color="#fff" />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium">
              {lightboxIdx + 1} / {displayImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
