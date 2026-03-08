"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  CalendarDays,
  Users,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  X,
  Check,
  Info,
} from "lucide-react";
import { format, differenceInCalendarDays, parseISO } from "date-fns";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const STORAGE_BASE = API_BASE.replace(/\/api$/, "");

function resolveImg(src: string | null | undefined): string {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${STORAGE_BASE}/${src.replace(/^\//, "")}`;
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface MealPricing {
  breakfast_veg: number;
  breakfast_non_veg: number;
  lunch_veg: number;
  lunch_non_veg: number;
  snacks_veg: number;
  snacks_non_veg: number;
  dinner_veg: number;
  dinner_non_veg: number;
}

interface RoomAmenity {
  id: number;
  name: string;
  is_chargeable?: boolean;
  charge_amount?: number;
  charge_type?: string;
}

interface RoomImage {
  id: number;
  url: string;
  title?: string;
}

interface Room {
  id: number;
  name: string;
  room_name?: string;
  type?: string;
  floor?: string;
  bathroom_type?: string;
  bathroom_style?: string;
  description?: string;
  capacity: number;
  base_capacity?: number;
  max_capacity: number;
  price_per_night: number;
  rate_type?: "per_room" | "per_person";
  extra_beds: { beds: number; sleeps: number; price_per_bed?: number } | null;
  extra_bed_price: number;
  meal_pricing: MealPricing | null;
  base_price_includes_meals?: boolean;
  base_price_included_meals?: string[];
  images: RoomImage[];
  amenities: RoomAmenity[];
  bathroom_amenities?: RoomAmenity[];
}

interface PropertyDetail {
  id: number;
  name: string;
  property_name?: string;
  city: string;
  state: string;
  location?: string;
  tax_slab?: string;
  rooms: Room[];
}

interface AvailableRoom {
  room_id: number;
  available_quantity: number;
  pricing: { average_per_night: number; total_price: number };
}

interface AvailabilityResponse {
  available_rooms: AvailableRoom[];
  total_available_rooms: number;
  nights: number;
}

interface SelectedRoomData {
  roomId: number;
  assignedGuests: number;
  extraBeds: number;
  mealOption: "room-only" | "with-meals";
  selectedMeals: {
    breakfast: "none" | "veg" | "non-veg";
    lunch: "none" | "veg" | "non-veg";
    snacks: "none" | "veg" | "non-veg";
    dinner: "none" | "veg" | "non-veg";
  };
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SelectRoomsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params.id as string;
  const checkIn = searchParams.get("check_in") ?? "";
  const checkOut = searchParams.get("check_out") ?? "";
  const adults = parseInt(searchParams.get("adults") ?? "2");
  const children = parseInt(searchParams.get("children") ?? "0");
  const infants = parseInt(searchParams.get("infants") ?? "0");
  const totalGuests = adults + children;

  const checkInDate = checkIn ? parseISO(checkIn) : null;
  const checkOutDate = checkOut ? parseISO(checkOut) : null;
  const nights =
    checkInDate && checkOutDate
      ? Math.max(0, differenceInCalendarDays(checkOutDate, checkInDate))
      : 0;

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [availabilityData, setAvailabilityData] =
    useState<AvailabilityResponse | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<SelectedRoomData[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsRoomId, setDetailsRoomId] = useState<number | null>(null);
  const [imageIndexes, setImageIndexes] = useState<Record<number, number>>({});
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [autoSuggested, setAutoSuggested] = useState(false);
  const [showGuestEditor, setShowGuestEditor] = useState(false);
  const [editAdults, setEditAdults] = useState(adults);
  const [editChildren, setEditChildren] = useState(children);
  const [editInfants, setEditInfants] = useState(infants);

  const rooms = property?.rooms ?? [];
  const totalAssignedGuests = selectedRooms.reduce(
    (s, r) => s + r.assignedGuests,
    0,
  );
  const remainingGuests = totalGuests - totalAssignedGuests;

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchAvailability = useCallback(async () => {
    if (!checkIn || !checkOut) return;
    try {
      setCheckingAvailability(true);
      const res = await fetch(
        `${API_BASE}/properties/${id}/check-availability`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ check_in: checkIn, check_out: checkOut }),
        },
      );
      const data = await res.json();
      setAvailabilityData(data);
    } catch {
      // availability remains null
    } finally {
      setCheckingAvailability(false);
    }
  }, [id, checkIn, checkOut]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/properties/${id}`);
        const data = await res.json();
        setProperty(data);
      } catch {
        // property remains null
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
    fetchAvailability();
  }, [id, fetchAvailability]);

  // Auto-suggest rooms once both property + availability are loaded
  useEffect(() => {
    if (property && availabilityData && !autoSuggested) {
      setAutoSuggested(true);
      const roomList = property.rooms ?? [];
      const available = roomList
        .filter((r) => {
          const a = availabilityData.available_rooms.find(
            (ar) => ar.room_id === r.id,
          );
          return a && a.available_quantity > 0;
        })
        .sort((a, b) => {
          if (b.capacity !== a.capacity) return b.capacity - a.capacity;
          return a.price_per_night - b.price_per_night;
        });

      let remaining = totalGuests;
      const suggested: SelectedRoomData[] = [];
      for (const room of available) {
        if (remaining <= 0) break;
        const assignedGuests =
          room.capacity >= remaining ? remaining : room.capacity;
        suggested.push({
          roomId: room.id,
          assignedGuests,
          extraBeds: 0,
          mealOption: "room-only",
          selectedMeals: {
            breakfast: "none",
            lunch: "none",
            snacks: "none",
            dinner: "none",
          },
        });
        remaining -= assignedGuests;
      }
      if (suggested.length > 0) setSelectedRooms(suggested);
    }
  }, [property, availabilityData, autoSuggested, totalGuests]);

  // ── Room Logic ─────────────────────────────────────────────────────────────

  const toggleRoomSelection = (roomId: number) => {
    const existing = selectedRooms.find((r) => r.roomId === roomId);
    if (existing) {
      setSelectedRooms((prev) => prev.filter((r) => r.roomId !== roomId));
      return;
    }
    if (availabilityData) {
      const a = availabilityData.available_rooms.find(
        (ar) => ar.room_id === roomId,
      );
      if (!a || a.available_quantity === 0) return;
    }
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;
    const guestsToAssign = Math.min(
      room.max_capacity || room.capacity,
      Math.max(1, remainingGuests),
    );
    setSelectedRooms((prev) => [
      ...prev,
      {
        roomId,
        assignedGuests: guestsToAssign,
        extraBeds: 0,
        mealOption: "room-only",
        selectedMeals: {
          breakfast: "none",
          lunch: "none",
          snacks: "none",
          dinner: "none",
        },
      },
    ]);
  };

  const updateRoomField = (
    roomId: number,
    patch: Partial<SelectedRoomData>,
  ) => {
    setSelectedRooms((prev) =>
      prev.map((r) => (r.roomId === roomId ? { ...r, ...patch } : r)),
    );
  };

  const updateSelectedMeal = (
    roomId: number,
    mealType: keyof SelectedRoomData["selectedMeals"],
    value: "none" | "veg" | "non-veg",
  ) => {
    setSelectedRooms((prev) =>
      prev.map((r) =>
        r.roomId === roomId
          ? { ...r, selectedMeals: { ...r.selectedMeals, [mealType]: value } }
          : r,
      ),
    );
  };

  // ── Price Calculations ─────────────────────────────────────────────────────

  const calcMealCostPerPerson = (rd: SelectedRoomData, room: Room): number => {
    if (rd.mealOption !== "with-meals" || !room.meal_pricing) return 0;
    const mp = room.meal_pricing;
    let cost = 0;
    if (rd.selectedMeals.breakfast !== "none")
      cost +=
        rd.selectedMeals.breakfast === "veg"
          ? mp.breakfast_veg
          : mp.breakfast_non_veg;
    if (rd.selectedMeals.lunch !== "none")
      cost +=
        rd.selectedMeals.lunch === "veg" ? mp.lunch_veg : mp.lunch_non_veg;
    if (rd.selectedMeals.snacks !== "none")
      cost +=
        rd.selectedMeals.snacks === "veg" ? mp.snacks_veg : mp.snacks_non_veg;
    if (rd.selectedMeals.dinner !== "none")
      cost +=
        rd.selectedMeals.dinner === "veg" ? mp.dinner_veg : mp.dinner_non_veg;
    return cost;
  };

  const calcRoomTotalPerNight = (rd: SelectedRoomData, room: Room): number => {
    const base =
      room.rate_type === "per_person"
        ? room.price_per_night * rd.assignedGuests
        : room.price_per_night;
    const extraBed = rd.extraBeds * (room.extra_bed_price || 0);
    const meals = calcMealCostPerPerson(rd, room) * rd.assignedGuests;
    return base + extraBed + meals;
  };

  const grandTotalPerNight = selectedRooms.reduce((sum, rd) => {
    const room = rooms.find((r) => r.id === rd.roomId);
    return room ? sum + calcRoomTotalPerNight(rd, room) : sum;
  }, 0);

  const grandTotal = grandTotalPerNight * nights;

  // ── Book Now ───────────────────────────────────────────────────────────────

  const handleBookNow = () => {
    if (selectedRooms.length === 0) {
      setBookingError("Please select at least one room.");
      return;
    }
    if (!property) return;

    const roomTotal = selectedRooms.reduce((sum, rd) => {
      const room = rooms.find((r) => r.id === rd.roomId);
      if (!room) return sum;
      const base =
        room.rate_type === "per_person"
          ? room.price_per_night * rd.assignedGuests
          : room.price_per_night;
      return sum + base * nights;
    }, 0);

    const extraBedCharges = selectedRooms.reduce((sum, rd) => {
      const room = rooms.find((r) => r.id === rd.roomId);
      if (!room || rd.extraBeds === 0) return sum;
      return sum + rd.extraBeds * (room.extra_bed_price || 0) * nights;
    }, 0);

    const mealCharges = selectedRooms.reduce((sum, rd) => {
      const room = rooms.find((r) => r.id === rd.roomId);
      if (!room) return sum;
      return sum + calcMealCostPerPerson(rd, room) * rd.assignedGuests * nights;
    }, 0);

    const subtotal = roomTotal + extraBedCharges + mealCharges;
    const taxRate = property.tax_slab
      ? parseFloat(property.tax_slab) / 100
      : 0.12;
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    const transformedRooms = selectedRooms
      .map((rd) => {
        const room = rooms.find((r) => r.id === rd.roomId);
        if (!room) return null;

        let mealOptionName: string | null = null;
        if (rd.mealOption === "with-meals") {
          const parts: string[] = [];
          if (rd.selectedMeals.breakfast !== "none")
            parts.push(`${rd.selectedMeals.breakfast} breakfast`);
          if (rd.selectedMeals.lunch !== "none")
            parts.push(`${rd.selectedMeals.lunch} lunch`);
          if (rd.selectedMeals.snacks !== "none")
            parts.push(`${rd.selectedMeals.snacks} snacks`);
          if (rd.selectedMeals.dinner !== "none")
            parts.push(`${rd.selectedMeals.dinner} dinner`);
          mealOptionName = parts.length > 0 ? parts.join(", ") : "With Meals";
        } else if (
          room.base_price_includes_meals &&
          room.base_price_included_meals?.length
        ) {
          mealOptionName = `${room.base_price_included_meals.length} meals included`;
        }

        const actualPricePerNight =
          room.rate_type === "per_person"
            ? room.price_per_night * rd.assignedGuests
            : room.price_per_night;

        return {
          room_id: room.id.toString(),
          room_name: room.room_name || room.name,
          quantity: 1,
          rate_type: room.rate_type || "per_room",
          assigned_guests: rd.assignedGuests,
          price_per_night: actualPricePerNight,
          base_price_per_night: room.price_per_night,
          meal_option_id: rd.mealOption === "with-meals" ? "1" : null,
          meal_option_name: mealOptionName,
          meal_price:
            rd.mealOption === "with-meals"
              ? calcMealCostPerPerson(rd, room)
              : null,
          extra_beds: rd.extraBeds > 0 ? rd.extraBeds : null,
          extra_bed_price: rd.extraBeds > 0 ? room.extra_bed_price || 0 : null,
        };
      })
      .filter(Boolean);

    const bookingData = {
      property_id: property.id.toString(),
      property: {
        property_name: property.property_name || property.name,
        location: property.location || `${property.city}, ${property.state}`,
        tax_slab: property.tax_slab,
      },
      check_in: checkIn,
      check_out: checkOut,
      nights,
      adults,
      children,
      infants,
      total_guests: totalGuests,
      selected_rooms: transformedRooms,
      room_total: roomTotal,
      extra_bed_charges: extraBedCharges,
      meal_charges: mealCharges,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      rooms: rooms.filter((r) =>
        selectedRooms.some((sr) => sr.roomId === r.id),
      ),
    };

    sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
    router.push("/checkout");
  };

  // ── Sorted rooms (available first, sold-out last) ──────────────────────────

  const sortedRooms = [...rooms].sort((a, b) => {
    const aQty =
      availabilityData?.available_rooms.find((ar) => ar.room_id === a.id)
        ?.available_quantity ?? 0;
    const bQty =
      availabilityData?.available_rooms.find((ar) => ar.room_id === b.id)
        ?.available_quantity ?? 0;
    if (aQty === 0 && bQty > 0) return 1;
    if (bQty === 0 && aQty > 0) return -1;
    return 0;
  });

  const detailsRoom = rooms.find((r) => r.id === detailsRoomId);

  // ── Render-time price breakdown ────────────────────────────────────────────

  const displayExtras = selectedRooms.reduce((sum, rd) => {
    const room = rooms.find((r) => r.id === rd.roomId);
    if (!room || rd.extraBeds === 0) return sum;
    return sum + rd.extraBeds * (room.extra_bed_price || 0) * nights;
  }, 0);

  const displayMeals = selectedRooms.reduce((sum, rd) => {
    const room = rooms.find((r) => r.id === rd.roomId);
    if (!room) return sum;
    return sum + calcMealCostPerPerson(rd, room) * rd.assignedGuests * nights;
  }, 0);

  const displayTaxRate = property?.tax_slab
    ? parseFloat(property.tax_slab) / 100
    : 0.12;
  const displayTax = Math.round(grandTotal * displayTaxRate);
  const displayTotal = grandTotal + displayTax;

  // ── Guest update helper ────────────────────────────────────────────────────

  const applyGuestChange = () => {
    const p = new URLSearchParams({
      check_in: checkIn,
      check_out: checkOut,
      adults: editAdults.toString(),
      children: editChildren.toString(),
      infants: editInfants.toString(),
    });
    router.push(`/select-rooms/${id}?${p.toString()}`);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <main style={{ background: "#f0efea", minHeight: "100vh" }}>
      <Navbar forceDark />

      <div className="container max-w-6xl mx-auto px-4 pt-24 pb-44 lg:pb-16">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl font-black text-gray-900 leading-tight truncate">
              {loading ? "Loading…" : (property?.name ?? "Select Rooms")}
            </h1>
            {nights > 0 && checkInDate && checkOutDate && (
              <p className="text-sm text-gray-500">
                {nights} night{nights !== 1 ? "s" : ""} ·{" "}
                {format(checkInDate, "MMM d")} –{" "}
                {format(checkOutDate, "MMM d, yyyy")}
              </p>
            )}
          </div>
        </div>

        {/* ── Two-column layout: scrollable left + sticky right ─────────── */}
        <div className="lg:flex lg:gap-8 lg:items-start">
          <div className="lg:flex-1 min-w-0">
            {/* Summary bar — mobile only */}
            <div
              className="flex items-center gap-4 flex-wrap mb-6 px-4 py-3 rounded-2xl text-sm lg:hidden"
              style={{ background: "#fff", border: "1px solid #e5e5e5" }}
            >
              <div className="flex items-center gap-2 text-gray-700">
                <BedDouble size={15} className="text-gray-400" />
                <span>
                  <span className="font-semibold">Check-in:</span>{" "}
                  {checkInDate ? format(checkInDate, "dd MMM yyyy") : checkIn}
                </span>
              </div>
              <div className="w-px h-4 bg-gray-200 hidden sm:block" />
              <div className="flex items-center gap-2 text-gray-700">
                <BedDouble size={15} className="text-gray-400" />
                <span>
                  <span className="font-semibold">Check-out:</span>{" "}
                  {checkOutDate
                    ? format(checkOutDate, "dd MMM yyyy")
                    : checkOut}
                </span>
              </div>
              <div className="w-px h-4 bg-gray-200 hidden sm:block" />
              <div className="flex items-center gap-2 text-gray-700">
                <Users size={15} className="text-gray-400" />
                <span>
                  {adults} adult{adults !== 1 ? "s" : ""}
                  {children > 0
                    ? `, ${children} child${children !== 1 ? "ren" : ""}`
                    : ""}
                  {infants > 0
                    ? `, ${infants} infant${infants !== 1 ? "s" : ""}`
                    : ""}
                </span>
              </div>
              <Link
                href={`/listing/${id}`}
                className="ml-auto text-xs font-semibold underline text-gray-400 hover:text-gray-700 transition-colors"
              >
                Change dates
              </Link>
            </div>

            {/* Rooms heading + guest tracker */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-gray-900">
                Select Your Room
              </h2>
              {selectedRooms.length > 0 && (
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: remainingGuests > 0 ? "#FFF7E0" : "#E8F5E9",
                    color: remainingGuests > 0 ? "#92400E" : "#1B5E20",
                  }}
                >
                  <Users size={12} />
                  {remainingGuests > 0
                    ? `${remainingGuests} guest${remainingGuests !== 1 ? "s" : ""} unassigned`
                    : "All guests assigned"}
                </div>
              )}
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex justify-center py-16">
                <div
                  className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                  style={{
                    borderColor: "#FECB19",
                    borderTopColor: "transparent",
                  }}
                />
              </div>
            )}

            {/* Availability check spinner */}
            {!loading && checkingAvailability && (
              <div className="flex items-center justify-center gap-3 py-6 text-sm text-gray-500">
                <div
                  className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                  style={{
                    borderColor: "#FECB19",
                    borderTopColor: "transparent",
                  }}
                />
                Checking availability…
              </div>
            )}

            {/* Room cards */}
            {!loading && (
              <div className="flex flex-col gap-4">
                {sortedRooms.map((room) => {
                  const avail = availabilityData?.available_rooms.find(
                    (ar) => ar.room_id === room.id,
                  );
                  const availQty = avail?.available_quantity ?? 0;
                  const isSoldOut = availabilityData !== null && availQty === 0;
                  const isSelected = !!selectedRooms.find(
                    (r) => r.roomId === room.id,
                  );
                  const roomData = selectedRooms.find(
                    (r) => r.roomId === room.id,
                  );

                  const images = room.images ?? [];
                  const imgIndex = imageIndexes[room.id] ?? 0;
                  const currentImg =
                    images.length > 0
                      ? resolveImg(images[imgIndex]?.url)
                      : "/images/dummy-image/1.jpg";

                  const roomTotalPerNight = roomData
                    ? calcRoomTotalPerNight(roomData, room)
                    : null;

                  return (
                    <div
                      key={room.id}
                      className="rounded-3xl overflow-hidden transition-all duration-200"
                      style={{
                        background: "#fff",
                        border: isSelected
                          ? "2px solid #FECB19"
                          : "2px solid transparent",
                        boxShadow: isSelected
                          ? "0 4px 24px rgba(254,203,25,0.25)"
                          : "0 2px 12px rgba(0,0,0,0.06)",
                        opacity: isSoldOut ? 0.6 : 1,
                      }}
                    >
                      {/* Room image */}
                      <div
                        className="relative overflow-hidden"
                        style={{ height: "200px" }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={currentImg}
                          alt={room.name}
                          className="w-full h-full object-cover"
                        />

                        {/* Image navigation */}
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={() =>
                                setImageIndexes((prev) => ({
                                  ...prev,
                                  [room.id]:
                                    (imgIndex - 1 + images.length) %
                                    images.length,
                                }))
                              }
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors"
                            >
                              <ChevronLeft size={16} className="text-white" />
                            </button>
                            <button
                              onClick={() =>
                                setImageIndexes((prev) => ({
                                  ...prev,
                                  [room.id]: (imgIndex + 1) % images.length,
                                }))
                              }
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors"
                            >
                              <ChevronRight size={16} className="text-white" />
                            </button>
                            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/40 text-white text-xs">
                              {imgIndex + 1}/{images.length}
                            </div>
                          </>
                        )}

                        {/* Availability badge */}
                        {availabilityData && (
                          <div className="absolute top-2 left-2">
                            {isSoldOut ? (
                              <span
                                className="px-2 py-0.5 rounded-full text-xs font-bold"
                                style={{
                                  background: "#FFEBEE",
                                  color: "#C62828",
                                  border: "1px solid #EF5350",
                                }}
                              >
                                Sold Out
                              </span>
                            ) : availQty <= 2 ? (
                              <span
                                className="px-2 py-0.5 rounded-full text-xs font-bold"
                                style={{
                                  background: "#FFF3E0",
                                  color: "#E65100",
                                  border: "1px solid #FF9800",
                                }}
                              >
                                {availQty} Left
                              </span>
                            ) : null}
                          </div>
                        )}

                        {/* Selected check */}
                        {isSelected && (
                          <div
                            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                            style={{ background: "#FECB19" }}
                          >
                            <Check
                              size={14}
                              strokeWidth={3}
                              className="text-gray-900"
                            />
                          </div>
                        )}
                      </div>

                      {/* Room details */}
                      <div className="p-4">
                        {/* Name + rate-type badge */}
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-base font-black text-gray-900 leading-tight">
                            {room.name}
                          </h3>
                          {room.rate_type === "per_person" && (
                            <span
                              className="shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold"
                              style={{
                                background: "#E8F5E9",
                                color: "#2E7D32",
                                border: "1px solid #4CAF50",
                              }}
                            >
                              Per Person
                            </span>
                          )}
                        </div>

                        {/* Capacity */}
                        <p className="text-xs text-gray-400 mb-2">
                          Max {room.max_capacity || room.capacity} guests
                        </p>

                        {/* Free amenities preview */}
                        {room.amenities && room.amenities.length > 0 && (
                          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                            <span className="font-medium text-gray-600">
                              Amenities:
                            </span>{" "}
                            {room.amenities
                              .filter((a) => !a.is_chargeable)
                              .slice(0, 5)
                              .map((a) => a.name)
                              .join(" · ")}
                            {room.amenities.filter((a) => !a.is_chargeable)
                              .length > 5
                              ? " · …"
                              : ""}
                          </p>
                        )}

                        {/* Price + actions */}
                        <div className="flex items-end justify-between mb-0">
                          <div>
                            <p className="text-xl font-black text-gray-900">
                              ₹{room.price_per_night.toLocaleString("en-IN")}
                              <span className="text-sm font-medium text-gray-400 ml-1">
                                {room.rate_type === "per_person"
                                  ? "/person/night"
                                  : "/night"}
                              </span>
                            </p>
                            {isSelected &&
                              roomData &&
                              roomTotalPerNight !== null && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                  ₹
                                  {(roomTotalPerNight * nights).toLocaleString(
                                    "en-IN",
                                  )}{" "}
                                  total for {nights} night
                                  {nights !== 1 ? "s" : ""}
                                </p>
                              )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setDetailsRoomId(room.id);
                                setShowDetailsModal(true);
                              }}
                              className="text-xs font-semibold underline text-gray-400 hover:text-gray-700 transition-colors"
                            >
                              Details
                            </button>
                            {!isSoldOut && (
                              <button
                                onClick={() => toggleRoomSelection(room.id)}
                                className="px-4 py-2 rounded-full text-sm font-black transition-all"
                                style={
                                  isSelected
                                    ? {
                                        background: "#f0efea",
                                        color: "#0A0A0A",
                                        border: "1.5px solid #d1d1d1",
                                      }
                                    : {
                                        background:
                                          "linear-gradient(135deg,#FECB19,#F95622)",
                                        color: "#0A0A0A",
                                        border: "none",
                                      }
                                }
                              >
                                {isSelected ? "Remove" : "Select"}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Expanded options when selected */}
                        {isSelected && roomData && (
                          <div
                            className="border-t mt-3 pt-3 space-y-4"
                            style={{ borderColor: "#f0efea" }}
                          >
                            {/* Assigned guests stepper */}
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold text-gray-800">
                                  Guests in this room
                                </p>
                                <p className="text-xs text-gray-400">
                                  Max {room.max_capacity || room.capacity}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() =>
                                    updateRoomField(room.id, {
                                      assignedGuests: Math.max(
                                        1,
                                        roomData.assignedGuests - 1,
                                      ),
                                    })
                                  }
                                  disabled={roomData.assignedGuests <= 1}
                                  className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40"
                                  style={{ borderColor: "#d1d1d1" }}
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="w-6 text-center font-bold text-sm">
                                  {roomData.assignedGuests}
                                </span>
                                <button
                                  onClick={() =>
                                    updateRoomField(room.id, {
                                      assignedGuests: Math.min(
                                        room.max_capacity || room.capacity,
                                        roomData.assignedGuests + 1,
                                      ),
                                    })
                                  }
                                  disabled={
                                    roomData.assignedGuests >=
                                    (room.max_capacity || room.capacity)
                                  }
                                  className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40"
                                  style={{ borderColor: "#d1d1d1" }}
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </div>

                            {/* Extra beds */}
                            {room.extra_beds && room.extra_beds.beds > 0 && (
                              <div
                                className="rounded-2xl p-3"
                                style={{ background: "#f0efea" }}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-semibold text-gray-800">
                                      Extra Beds
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      ₹
                                      {(
                                        room.extra_bed_price || 0
                                      ).toLocaleString("en-IN")}{" "}
                                      / bed / night · max {room.extra_beds.beds}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <button
                                      onClick={() =>
                                        updateRoomField(room.id, {
                                          extraBeds: Math.max(
                                            0,
                                            roomData.extraBeds - 1,
                                          ),
                                        })
                                      }
                                      disabled={roomData.extraBeds === 0}
                                      className="w-8 h-8 rounded-full border bg-white flex items-center justify-center disabled:opacity-40"
                                      style={{ borderColor: "#d1d1d1" }}
                                    >
                                      <Minus size={14} />
                                    </button>
                                    <span className="w-6 text-center font-bold text-sm">
                                      {roomData.extraBeds}
                                    </span>
                                    <button
                                      onClick={() =>
                                        updateRoomField(room.id, {
                                          extraBeds: Math.min(
                                            room.extra_beds!.beds,
                                            roomData.extraBeds + 1,
                                          ),
                                        })
                                      }
                                      disabled={
                                        roomData.extraBeds >=
                                        room.extra_beds.beds
                                      }
                                      className="w-8 h-8 rounded-full border bg-white flex items-center justify-center disabled:opacity-40"
                                      style={{ borderColor: "#d1d1d1" }}
                                    >
                                      <Plus size={14} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Meals */}
                            {room.meal_pricing && (
                              <div
                                className="rounded-2xl p-3"
                                style={{
                                  background: "#F8F7F4",
                                  border: "1px solid #D2CEC4",
                                }}
                              >
                                {room.base_price_includes_meals &&
                                room.base_price_included_meals &&
                                room.base_price_included_meals.length > 0 ? (
                                  <>
                                    <p className="text-sm font-semibold text-gray-800 mb-1">
                                      Meals Included
                                    </p>
                                    <p className="text-xs text-gray-500 mb-2">
                                      No extra charge for these meals:
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {room.base_price_included_meals.map(
                                        (meal) => (
                                          <span
                                            key={meal}
                                            className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                                            style={{
                                              background: "#fff",
                                              border: "1px solid #A39E93",
                                              color: "#373327",
                                            }}
                                          >
                                            {meal}
                                          </span>
                                        ),
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <p className="text-sm font-semibold text-gray-800 mb-2">
                                      Meal Package
                                    </p>
                                    {/* Room Only / With Meals toggle */}
                                    <div className="flex gap-2 mb-3">
                                      {(
                                        ["room-only", "with-meals"] as const
                                      ).map((opt) => (
                                        <button
                                          key={opt}
                                          onClick={() =>
                                            updateRoomField(room.id, {
                                              mealOption: opt,
                                            })
                                          }
                                          className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
                                          style={{
                                            background:
                                              roomData.mealOption === opt
                                                ? "#FECB19"
                                                : "#fff",
                                            color: "#0A0A0A",
                                            boxShadow:
                                              "0 1px 6px rgba(0,0,0,0.08)",
                                          }}
                                        >
                                          {opt === "room-only"
                                            ? "Room Only"
                                            : "With Meals"}
                                        </button>
                                      ))}
                                    </div>

                                    {/* Per-meal selection */}
                                    {roomData.mealOption === "with-meals" && (
                                      <div className="space-y-3">
                                        {(
                                          [
                                            {
                                              key: "breakfast" as const,
                                              label: "Breakfast",
                                              veg: room.meal_pricing
                                                .breakfast_veg,
                                              nonVeg:
                                                room.meal_pricing
                                                  .breakfast_non_veg,
                                            },
                                            {
                                              key: "lunch" as const,
                                              label: "Lunch",
                                              veg: room.meal_pricing.lunch_veg,
                                              nonVeg:
                                                room.meal_pricing.lunch_non_veg,
                                            },
                                            {
                                              key: "snacks" as const,
                                              label: "Snacks",
                                              veg: room.meal_pricing.snacks_veg,
                                              nonVeg:
                                                room.meal_pricing
                                                  .snacks_non_veg,
                                            },
                                            {
                                              key: "dinner" as const,
                                              label: "Dinner",
                                              veg: room.meal_pricing.dinner_veg,
                                              nonVeg:
                                                room.meal_pricing
                                                  .dinner_non_veg,
                                            },
                                          ] as const
                                        )
                                          .filter(
                                            ({ veg, nonVeg }) =>
                                              veg > 0 || nonVeg > 0,
                                          )
                                          .map(
                                            ({ key, label, veg, nonVeg }) => (
                                              <div key={key}>
                                                <p className="text-xs font-semibold text-gray-700 mb-1.5">
                                                  {label}
                                                </p>
                                                <div className="flex gap-1.5">
                                                  <button
                                                    onClick={() =>
                                                      updateSelectedMeal(
                                                        room.id,
                                                        key,
                                                        "none",
                                                      )
                                                    }
                                                    className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                                                    style={{
                                                      background:
                                                        roomData.selectedMeals[
                                                          key
                                                        ] === "none"
                                                          ? "#FECB19"
                                                          : "#fff",
                                                      border:
                                                        "1px solid #e5e5e5",
                                                      color: "#0A0A0A",
                                                    }}
                                                  >
                                                    None
                                                  </button>
                                                  {veg > 0 && (
                                                    <button
                                                      onClick={() =>
                                                        updateSelectedMeal(
                                                          room.id,
                                                          key,
                                                          "veg",
                                                        )
                                                      }
                                                      className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                                                      style={{
                                                        background:
                                                          roomData
                                                            .selectedMeals[
                                                            key
                                                          ] === "veg"
                                                            ? "#FECB19"
                                                            : "#fff",
                                                        border:
                                                          "1px solid #e5e5e5",
                                                        color: "#0A0A0A",
                                                      }}
                                                    >
                                                      Veg ₹{veg}
                                                    </button>
                                                  )}
                                                  {nonVeg > 0 && (
                                                    <button
                                                      onClick={() =>
                                                        updateSelectedMeal(
                                                          room.id,
                                                          key,
                                                          "non-veg",
                                                        )
                                                      }
                                                      className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                                                      style={{
                                                        background:
                                                          roomData
                                                            .selectedMeals[
                                                            key
                                                          ] === "non-veg"
                                                            ? "#FECB19"
                                                            : "#fff",
                                                        border:
                                                          "1px solid #e5e5e5",
                                                        color: "#0A0A0A",
                                                      }}
                                                    >
                                                      Non-Veg ₹{nonVeg}
                                                    </button>
                                                  )}
                                                </div>
                                              </div>
                                            ),
                                          )}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {!loading && rooms.length === 0 && (
                  <div className="text-center py-16 text-gray-400">
                    <BedDouble size={40} className="mx-auto mb-3 opacity-40" />
                    <p className="font-semibold">
                      No rooms found for this property.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* T&C note */}
            {!loading && rooms.length > 0 && (
              <p className="text-xs text-gray-400 mt-6 leading-relaxed">
                By selecting &ldquo;Book Now&rdquo;, you agree to the rules and
                policies of this property. Bayaroo reserves the right to charge
                your payment method if you do not show up or for any damage.
              </p>
            )}
          </div>
          {/* /left column */}

          {/* ── Right sticky panel (desktop only) ────────────────────────── */}
          <div className="hidden lg:block w-80 xl:w-96 shrink-0">
            <div className="sticky space-y-4" style={{ top: "88px" }}>
              {/* ── Trip Details ── */}
              <div
                className="rounded-3xl p-5"
                style={{
                  background: "#fff",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <h3 className="text-base font-black text-gray-900 mb-4">
                  Your Trip
                </h3>

                {/* Dates */}
                <div
                  className="flex items-start justify-between pb-4 border-b"
                  style={{ borderColor: "#f0efea" }}
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <CalendarDays size={13} className="text-gray-400" />
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                        Dates
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      {checkInDate ? format(checkInDate, "MMM d") : checkIn} –{" "}
                      {checkOutDate
                        ? format(checkOutDate, "MMM d, yyyy")
                        : checkOut}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {nights} night{nights !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <Link
                    href={`/listing/${id}`}
                    className="text-xs font-bold hover:opacity-70 transition-opacity mt-0.5"
                    style={{ color: "#F95622" }}
                  >
                    Edit
                  </Link>
                </div>

                {/* Guests */}
                <div className="pt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Users size={13} className="text-gray-400" />
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                          Guests
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-800">
                        {adults} adult{adults !== 1 ? "s" : ""}
                        {children > 0
                          ? `, ${children} child${children !== 1 ? "ren" : ""}`
                          : ""}
                        {infants > 0
                          ? `, ${infants} infant${infants !== 1 ? "s" : ""}`
                          : ""}
                      </p>
                      {selectedRooms.length > 0 && (
                        <p
                          className="text-xs mt-0.5 font-medium"
                          style={{
                            color: remainingGuests > 0 ? "#E65100" : "#2E7D32",
                          }}
                        >
                          {remainingGuests > 0
                            ? `${remainingGuests} guest${remainingGuests !== 1 ? "s" : ""} unassigned`
                            : "All guests assigned ✓"}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setShowGuestEditor((v) => !v)}
                      className="text-xs font-bold hover:opacity-70 transition-opacity mt-0.5"
                      style={{ color: "#F95622" }}
                    >
                      {showGuestEditor ? "Cancel" : "Edit"}
                    </button>
                  </div>

                  {/* Inline guest editor */}
                  {showGuestEditor && (
                    <div
                      className="mt-3 pt-3 border-t space-y-3"
                      style={{ borderColor: "#f0efea" }}
                    >
                      {/* Adults */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            Adults
                          </p>
                          <p className="text-xs text-gray-400">Age 13+</p>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() =>
                              setEditAdults((v) => Math.max(1, v - 1))
                            }
                            disabled={editAdults <= 1}
                            className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-40 hover:bg-gray-50 transition-colors"
                            style={{ borderColor: "#d1d1d1" }}
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-5 text-center font-bold text-sm">
                            {editAdults}
                          </span>
                          <button
                            onClick={() => setEditAdults((v) => v + 1)}
                            className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50 transition-colors"
                            style={{ borderColor: "#d1d1d1" }}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Children */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            Children
                          </p>
                          <p className="text-xs text-gray-400">Age 2–12</p>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() =>
                              setEditChildren((v) => Math.max(0, v - 1))
                            }
                            disabled={editChildren <= 0}
                            className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-40 hover:bg-gray-50 transition-colors"
                            style={{ borderColor: "#d1d1d1" }}
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-5 text-center font-bold text-sm">
                            {editChildren}
                          </span>
                          <button
                            onClick={() => setEditChildren((v) => v + 1)}
                            className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50 transition-colors"
                            style={{ borderColor: "#d1d1d1" }}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Infants */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            Infants
                          </p>
                          <p className="text-xs text-gray-400">Under 2</p>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() =>
                              setEditInfants((v) => Math.max(0, v - 1))
                            }
                            disabled={editInfants <= 0}
                            className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-40 hover:bg-gray-50 transition-colors"
                            style={{ borderColor: "#d1d1d1" }}
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-5 text-center font-bold text-sm">
                            {editInfants}
                          </span>
                          <button
                            onClick={() => setEditInfants((v) => v + 1)}
                            className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50 transition-colors"
                            style={{ borderColor: "#d1d1d1" }}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={applyGuestChange}
                        className="w-full py-2.5 rounded-xl text-sm font-black hover:opacity-90 transition-opacity"
                        style={{ background: "#0A0A0A", color: "#fff" }}
                      >
                        Update Guests
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Price Summary ── */}
              {selectedRooms.length > 0 ? (
                <div
                  className="rounded-3xl p-5"
                  style={{
                    background: "#fff",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  <h3 className="text-base font-black text-gray-900 mb-4">
                    Price Details
                  </h3>

                  <div className="space-y-2.5 text-sm">
                    {selectedRooms.map((rd) => {
                      const room = rooms.find((r) => r.id === rd.roomId);
                      if (!room) return null;
                      const perNight =
                        room.rate_type === "per_person"
                          ? room.price_per_night * rd.assignedGuests
                          : room.price_per_night;
                      return (
                        <div
                          key={rd.roomId}
                          className="flex justify-between items-start gap-2"
                        >
                          <span className="text-gray-600 leading-snug">
                            {room.name}
                            <span className="text-gray-400">
                              {" "}
                              &times; {nights}n
                            </span>
                          </span>
                          <span className="font-semibold text-gray-900 shrink-0">
                            ₹{(perNight * nights).toLocaleString("en-IN")}
                          </span>
                        </div>
                      );
                    })}

                    {displayExtras > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Extra beds</span>
                        <span className="font-semibold text-gray-900">
                          +₹{displayExtras.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}

                    {displayMeals > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Meals</span>
                        <span className="font-semibold text-gray-900">
                          +₹{displayMeals.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxes & fees</span>
                      <span className="font-semibold text-gray-900">
                        +₹{displayTax.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div
                    className="border-t mt-4 pt-4 flex items-center justify-between"
                    style={{ borderColor: "#f0efea" }}
                  >
                    <div>
                      <p className="text-lg font-black text-gray-900">
                        ₹{displayTotal.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {selectedRooms.length} room
                        {selectedRooms.length !== 1 ? "s" : ""} · {nights} night
                        {nights !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {bookingError && (
                    <div className="mt-3 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-2">
                      <Info size={14} />
                      {bookingError}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setBookingError(null);
                      handleBookNow();
                    }}
                    className="w-full mt-4 py-3.5 rounded-full font-black text-sm hover:opacity-90 transition-opacity"
                    style={{
                      background: "linear-gradient(135deg,#FECB19,#F95622)",
                      color: "#0A0A0A",
                    }}
                  >
                    Book Now →
                  </button>
                </div>
              ) : (
                !loading && (
                  <div
                    className="rounded-2xl px-4 py-3.5 text-sm text-center font-medium"
                    style={{ background: "#FFF7E0", color: "#92400E" }}
                  >
                    Select a room to see pricing
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        {/* /two-column flex */}
      </div>

      {/* Fixed booking footer */}
      <AnimatePresence>
        {selectedRooms.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-4 px-4 lg:hidden"
          >
            <div className="container max-w-4xl mx-auto pointer-events-auto">
              {bookingError && (
                <div className="mb-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-2">
                  <Info size={14} />
                  {bookingError}
                </div>
              )}
              <div
                className="flex items-center justify-between gap-4 px-5 py-3.5 rounded-3xl"
                style={{
                  background: "#0A0A0A",
                  boxShadow: "0 -4px 32px rgba(0,0,0,0.18)",
                }}
              >
                <div>
                  <p className="text-white font-black text-base">
                    ₹{grandTotal.toLocaleString("en-IN")}
                    <span className="text-gray-400 text-xs font-medium ml-1">
                      total
                    </span>
                  </p>
                  <p className="text-gray-400 text-xs">
                    {selectedRooms.length} room
                    {selectedRooms.length !== 1 ? "s" : ""} · {nights} night
                    {nights !== 1 ? "s" : ""}
                    {remainingGuests > 0 && (
                      <span style={{ color: "#FECB19" }}>
                        {" "}
                        · {remainingGuests} guest
                        {remainingGuests !== 1 ? "s" : ""} unassigned
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setBookingError(null);
                    handleBookNow();
                  }}
                  className="font-black text-sm px-6 py-3 rounded-full hover:opacity-90 transition-opacity shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#FECB19,#F95622)",
                    color: "#0A0A0A",
                  }}
                >
                  Book Now →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Room details modal */}
      <AnimatePresence>
        {showDetailsModal && detailsRoom && (
          <motion.div
            className="fixed inset-0 z-200 flex items-end sm:items-center justify-center p-0 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetailsModal(false)}
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
                  {detailsRoom.name}
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div
                className="overflow-y-auto px-6 py-4 space-y-4"
                style={{ maxHeight: "70vh" }}
              >
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {detailsRoom.type && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Type
                      </p>
                      <p className="font-semibold">{detailsRoom.type}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Capacity
                    </p>
                    <p className="font-semibold">
                      Up to {detailsRoom.max_capacity || detailsRoom.capacity}{" "}
                      guests
                      {detailsRoom.base_capacity
                        ? ` (base ${detailsRoom.base_capacity})`
                        : ""}
                    </p>
                  </div>
                  {detailsRoom.floor && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Floor
                      </p>
                      <p className="font-semibold">{detailsRoom.floor}</p>
                    </div>
                  )}
                  {detailsRoom.bathroom_type && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Bathroom
                      </p>
                      <p className="font-semibold">
                        {detailsRoom.bathroom_type}
                        {detailsRoom.bathroom_style
                          ? ` (${detailsRoom.bathroom_style})`
                          : ""}
                      </p>
                    </div>
                  )}
                </div>

                {detailsRoom.description && (
                  <div>
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-1">
                      Description
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {detailsRoom.description}
                    </p>
                  </div>
                )}

                {detailsRoom.amenities && detailsRoom.amenities.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">
                      Room Amenities
                    </p>
                    <ul className="space-y-1">
                      {detailsRoom.amenities.map((a) => (
                        <li
                          key={a.id}
                          className="text-sm text-gray-700 flex items-start gap-2"
                        >
                          <span className="text-gray-300 mt-0.5">·</span>
                          <span>
                            {a.name}
                            {a.is_chargeable && a.charge_amount ? (
                              <span className="ml-1 text-xs text-orange-500">
                                (₹
                                {a.charge_amount.toLocaleString("en-IN")}{" "}
                                {a.charge_type === "per-day"
                                  ? "/ day"
                                  : "one-time"}
                                )
                              </span>
                            ) : null}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {detailsRoom.bathroom_amenities &&
                  detailsRoom.bathroom_amenities.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">
                        Bathroom Amenities
                      </p>
                      <ul className="space-y-1">
                        {detailsRoom.bathroom_amenities.map((a) => (
                          <li
                            key={a.id}
                            className="text-sm text-gray-700 flex items-start gap-2"
                          >
                            <span className="text-gray-300 mt-0.5">·</span>
                            {a.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {detailsRoom.extra_beds && detailsRoom.extra_beds.beds > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-1">
                      Extra Beds
                    </p>
                    <p className="text-sm text-gray-600">
                      {detailsRoom.extra_beds.beds} extra bed
                      {detailsRoom.extra_beds.beds !== 1 ? "s" : ""} available
                      at ₹
                      {(detailsRoom.extra_bed_price || 0).toLocaleString(
                        "en-IN",
                      )}{" "}
                      / bed / night
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
