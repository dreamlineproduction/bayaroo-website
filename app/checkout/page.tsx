"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Shield,
  ChevronDown,
  ChevronUp,
  Utensils,
  BedDouble,
  Info,
  Tag,
  X,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SelectedRoom {
  room_id: string;
  room_name: string;
  quantity: number;
  rate_type?: "per_room" | "per_person";
  assigned_guests?: number;
  price_per_night: number;
  base_price_per_night?: number;
  meal_option_id?: string | null;
  meal_option_name?: string | null;
  meal_price?: number | null;
  extra_beds?: number | null;
  extra_bed_price?: number | null;
}

interface BookingData {
  property_id: string;
  property: {
    property_name: string;
    location: string;
    distance?: string;
    tax_slab?: string;
  };
  check_in: string;
  check_out: string;
  nights: number;
  adults: number;
  children: number;
  infants: number;
  total_guests: number;
  selected_rooms: SelectedRoom[];
  room_total: number;
  extra_bed_charges: number;
  meal_charges: number;
  tax_amount: number;
  total_amount: number;
  rooms: any[];
}

// ─── Static coupons (sorted best → worst; replace with API later) ───────────────

interface Coupon {
  code: string;
  discount: number; // percentage off pre-tax subtotal
  description: string;
}

const COUPONS: Coupon[] = [
  {
    code: "VIP25DEAL",
    discount: 25,
    description: "Exclusive VIP deal – Save 25% on premium stays.",
  },
  {
    code: "MEGA20OFF",
    discount: 20,
    description: "Mega sale! Enjoy 20% discount on selected stays.",
  },
  {
    code: "SAVE15NOW",
    discount: 15,
    description: "Save 15% on all homestays this season.",
  },
  {
    code: "WELCOME12",
    discount: 12,
    description: "Get 12% off on your first booking with us.",
  },
  {
    code: "HOLIDAY10",
    discount: 10,
    description: "Special holiday discount of 10% on all properties.",
  },
  {
    code: "QUICK8",
    discount: 8,
    description: "Quick booking offer – Get 8% instant discount.",
  },
];

// ─── Cashfree helpers ─────────────────────────────────────────────────────────

function loadCashfreeSDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).Cashfree) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
    document.head.appendChild(script);
  });
}

async function initiateCashfreePayment(
  paymentSessionId: string,
  orderId: string,
): Promise<void> {
  await loadCashfreeSDK();
  const cashfree = (window as any).Cashfree({
    mode: process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox",
  });
  cashfree.checkout({
    paymentSessionId,
    returnUrl: `${window.location.origin}/payment-status?order_id=${orderId}`,
    redirectTarget: "_self",
  });
}

// ─────────────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [showTaxInfo, setShowTaxInfo] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);
  // Coupon — best coupon auto-applied by default
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(COUPONS[0]);
  const [showCouponPanel, setShowCouponPanel] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [manualCodeError, setManualCodeError] = useState("");

  // ── Load from sessionStorage ───────────────────────────────────────────────
  useEffect(() => {
    const raw = sessionStorage.getItem("bookingData");
    if (!raw) {
      router.replace("/explore");
      return;
    }
    try {
      const data: BookingData = JSON.parse(raw);
      // Recalculate totals if they are zero (safety guard)
      if (!data.total_amount || data.total_amount === 0) {
        const roomTotal = data.selected_rooms.reduce((sum, r) => {
          return (
            sum +
            (r.price_per_night || 0) * (r.quantity || 1) * (data.nights || 1)
          );
        }, 0);
        const extraBedCharges = data.selected_rooms.reduce((sum, r) => {
          if (!r.extra_beds || !r.extra_bed_price) return sum;
          return sum + r.extra_beds * r.extra_bed_price * data.nights;
        }, 0);
        const mealCharges = data.selected_rooms.reduce((sum, r) => {
          if (!r.meal_price || !r.assigned_guests) return sum;
          return sum + r.meal_price * r.assigned_guests * data.nights;
        }, 0);
        const subtotal = roomTotal + extraBedCharges + mealCharges;
        const taxRate = data.property?.tax_slab
          ? parseFloat(data.property.tax_slab) / 100
          : 0.12;
        data.room_total = roomTotal;
        data.extra_bed_charges = extraBedCharges;
        data.meal_charges = mealCharges;
        data.tax_amount = Math.round(subtotal * taxRate);
        data.total_amount = subtotal + data.tax_amount;
      }
      setBookingData(data);
    } catch {
      router.replace("/explore");
    }
  }, [router]);

  // ── Payment ────────────────────────────────────────────────────────────────
  const handlePayNow = async () => {
    if (!bookingData) return;

    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const body = {
        property_id: parseInt(bookingData.property_id),
        check_in: bookingData.check_in,
        check_out: bookingData.check_out,
        adults: bookingData.adults,
        children: bookingData.children,
        infants: bookingData.infants,
        selected_rooms: bookingData.selected_rooms.map((r) => ({
          room_id: r.room_id,
          room_name: r.room_name,
          quantity: r.quantity,
          rate_type: r.rate_type,
          assigned_guests: r.assigned_guests,
          price_per_night: r.price_per_night,
          base_price_per_night: r.base_price_per_night,
          meal_option_id: r.meal_option_id,
          meal_option_name: r.meal_option_name,
          meal_price: r.meal_price,
          extra_beds: r.extra_beds,
          extra_bed_price: r.extra_bed_price,
        })),
        room_total: bookingData.room_total,
        extra_bed_charges: bookingData.extra_bed_charges,
        meal_charges: bookingData.meal_charges,
        // coupon fields — will be wired to backend later
        coupon_code: appliedCoupon?.code ?? null,
        discount_amount: discountAmount,
        tax_amount: taxOnDiscounted,
        total_amount: finalTotal,
      };

      const res = await fetch(`${API_BASE}/payment/create-booking`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create booking");
      }

      await initiateCashfreePayment(data.payment_session_id, data.cf_order_id);
    } catch (err: any) {
      setError(err.message || "Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (!bookingData) {
    return (
      <main style={{ background: "#f0efea" }} className="min-h-screen">
        <Navbar forceDark />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div
            className="w-8 h-8 border-2 rounded-full animate-spin"
            style={{ borderColor: "#FECB19", borderTopColor: "transparent" }}
          />
        </div>
      </main>
    );
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  const taxLabel = bookingData.property?.tax_slab
    ? `${bookingData.property.tax_slab}% GST`
    : "12% GST";

  let checkInDate: Date | null = null;
  let checkOutDate: Date | null = null;
  try {
    checkInDate = parseISO(bookingData.check_in);
    checkOutDate = parseISO(bookingData.check_out);
  } catch {}

  const fmtDate = (d: Date | null) =>
    d ? format(d, "EEE, dd MMM yyyy") : "--";

  // ── Coupon / price derivations ──────────────────────────────────────────────
  const subtotal =
    (bookingData.room_total || 0) +
    (bookingData.meal_charges || 0) +
    (bookingData.extra_bed_charges || 0);
  const discountAmount = appliedCoupon
    ? Math.round((subtotal * appliedCoupon.discount) / 100)
    : 0;
  const discountedSubtotal = subtotal - discountAmount;
  const taxRate = bookingData.property?.tax_slab
    ? parseFloat(bookingData.property.tax_slab) / 100
    : 0.12;
  const taxOnDiscounted = Math.round(discountedSubtotal * taxRate);
  const finalTotal = discountedSubtotal + taxOnDiscounted;

  const handleApplyManualCode = () => {
    const found = COUPONS.find(
      (c) => c.code === manualCode.trim().toUpperCase(),
    );
    if (found) {
      setAppliedCoupon(found);
      setManualCodeError("");
      setManualCode("");
      setShowCouponPanel(false);
    } else {
      setManualCodeError("Invalid coupon code. Please try again.");
    }
  };

  const guestSummary = [
    bookingData.adults > 0 &&
      `${bookingData.adults} adult${bookingData.adults > 1 ? "s" : ""}`,
    bookingData.children > 0 &&
      `${bookingData.children} child${bookingData.children > 1 ? "ren" : ""}`,
    bookingData.infants > 0 &&
      `${bookingData.infants} infant${bookingData.infants > 1 ? "s" : ""}`,
  ]
    .filter(Boolean)
    .join(", ");

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main style={{ background: "#f0efea" }} className="min-h-screen">
      <Navbar forceDark />

      <div
        className="container max-w-6xl mx-auto px-4 pt-24 pb-40 lg:pb-16"
        style={{ paddingTop: "7rem", paddingBottom: "14rem" }}
      >
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Review & Pay</h1>

        {/* ── Two-column layout ─────────────────────────────────────────────── */}
        <div className="lg:flex lg:gap-8">
          {/* LEFT: Details */}
          <div className="lg:flex-1 min-w-0 space-y-4">
            {/* Property card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                {bookingData.property.property_name}
              </h2>
              <div className="flex items-center gap-1.5 mt-1.5 text-sm text-gray-500">
                <MapPin size={13} />
                {bookingData.property.location}
              </div>
              <div
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                style={{
                  background: "rgba(254, 203, 25, 0.18)",
                  color: "#9a7200",
                }}
              >
                <Shield size={12} />
                Bayaroo Assured
              </div>
            </div>

            {/* Trip details */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Trip Details
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Check-in</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {fmtDate(checkInDate)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">From 2:00 PM</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Check-out</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {fmtDate(checkOutDate)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">By 11:00 AM</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Duration</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {bookingData.nights} night
                    {bookingData.nights > 1 ? "s" : ""}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Guests</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {guestSummary}
                  </p>
                </div>
              </div>
            </div>

            {/* Room cards */}
            {bookingData.selected_rooms.map((room, i) => {
              const roomTotal =
                (room.price_per_night || 0) *
                (room.quantity || 1) *
                bookingData.nights;
              const roomExtraBedTotal =
                room.extra_beds && room.extra_bed_price
                  ? room.extra_beds * room.extra_bed_price * bookingData.nights
                  : 0;

              return (
                <div
                  key={`${room.room_id}-${i}`}
                  className="bg-white rounded-2xl p-5 shadow-sm"
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base leading-tight">
                        {room.room_name}
                        {room.quantity > 1 && (
                          <span className="font-normal text-gray-400 ml-1.5 text-sm">
                            × {room.quantity}
                          </span>
                        )}
                      </h3>
                      {room.rate_type === "per_person" &&
                        room.assigned_guests != null && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {room.assigned_guests} guest
                            {room.assigned_guests > 1 ? "s" : ""}
                          </p>
                        )}
                    </div>
                    <p className="text-base font-bold text-gray-900 whitespace-nowrap">
                      ₹{roomTotal.toLocaleString()}
                    </p>
                  </div>

                  {/* Per-night label */}
                  <p className="text-xs text-gray-400 mt-1.5">
                    ₹{(room.price_per_night || 0).toLocaleString()} ×{" "}
                    {bookingData.nights} night
                    {bookingData.nights > 1 ? "s" : ""}
                    {room.quantity > 1 && ` × ${room.quantity} rooms`}
                    {room.rate_type === "per_person" &&
                      room.base_price_per_night &&
                      room.assigned_guests && (
                        <span>
                          {" "}
                          (₹{room.base_price_per_night}/person ×{" "}
                          {room.assigned_guests})
                        </span>
                      )}
                  </p>

                  {/* Meal badge */}
                  {room.meal_option_name && (
                    <div className="flex items-center gap-1.5 mt-3 text-xs font-medium text-green-700 bg-green-50 rounded-xl px-3 py-2">
                      <Utensils size={12} />
                      {room.meal_option_name}
                    </div>
                  )}

                  {/* Extra beds */}
                  {room.extra_beds != null && room.extra_beds > 0 && (
                    <div className="flex items-center justify-between mt-3 bg-amber-50 rounded-xl px-3 py-2">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
                        <BedDouble size={12} />
                        {room.extra_beds} extra bed
                        {room.extra_beds > 1 ? "s" : ""} added
                      </div>
                      <p className="text-xs font-bold text-amber-700">
                        +₹{roomExtraBedTotal.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Important information accordion */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={() => setShowPolicies(!showPolicies)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-bold text-gray-900 text-sm">
                  Important Information
                </span>
                {showPolicies ? (
                  <ChevronUp size={16} className="text-gray-400" />
                ) : (
                  <ChevronDown size={16} className="text-gray-400" />
                )}
              </button>
              {showPolicies && (
                <div className="px-5 pb-5 border-t border-gray-100">
                  <ul className="mt-4 space-y-2 text-sm text-gray-600 list-disc list-inside">
                    <li>
                      Passport, Aadhar, Driving License and Govt. ID are
                      accepted as ID proof(s)
                    </li>
                    <li>Unmarried couples allowed</li>
                    <li>Local IDs are allowed</li>
                    <li>Smoking within the premises is allowed</li>
                  </ul>
                </div>
              )}
            </div>

            {/* T&C */}
            <div className="bg-white rounded-2xl p-5 shadow-sm text-xs text-gray-500 leading-relaxed">
              <p className="mb-2">
                Please ensure &amp; thoroughly review your order details prior
                to submitting to prevent any potential cancellations.
              </p>
              <p>
                If you cancel within 60 seconds of booking you will receive a
                100% refund. For further rules read our{" "}
                <span className="font-semibold text-gray-700 underline cursor-pointer">
                  Refund Policy
                </span>{" "}
                &amp;{" "}
                <span className="font-semibold text-gray-700 underline cursor-pointer">
                  Cancellation Policy
                </span>
                .
              </p>
            </div>
          </div>

          {/* RIGHT: Price summary (desktop sticky) */}
          <div className="hidden lg:block w-80 xl:w-96 shrink-0">
            <div className="sticky space-y-4" style={{ top: "96px" }}>
              {/* ── Coupon card ── */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setShowCouponPanel((p) => !p)}
                  className="w-full flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-2">
                    <Tag size={14} style={{ color: "#c98e00" }} />
                    <span className="font-bold text-sm text-gray-900">
                      {appliedCoupon ? (
                        <>
                          <span style={{ color: "#c98e00" }}>
                            {appliedCoupon.code}
                          </span>
                          <span className="font-normal text-gray-500 text-xs ml-1.5">
                            {appliedCoupon.discount}% off applied
                          </span>
                        </>
                      ) : (
                        "Apply Coupon"
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {appliedCoupon && (
                      <span className="text-sm font-bold text-green-600">
                        -₹{discountAmount.toLocaleString()}
                      </span>
                    )}
                    {showCouponPanel ? (
                      <ChevronUp size={14} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={14} className="text-gray-400" />
                    )}
                  </div>
                </button>

                {showCouponPanel && (
                  <div className="border-t border-gray-100">
                    {/* Manual input */}
                    <div className="p-4 border-b border-gray-50">
                      <div
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                        style={{ border: "1px solid #e5e7eb" }}
                      >
                        <input
                          type="text"
                          value={manualCode}
                          onChange={(e) => {
                            setManualCode(e.target.value.toUpperCase());
                            setManualCodeError("");
                          }}
                          placeholder="Enter Coupon Code"
                          className="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-400"
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleApplyManualCode()
                          }
                        />
                        <button
                          onClick={handleApplyManualCode}
                          className="text-gray-400 hover:text-gray-700 transition-colors"
                        >
                          <ArrowRight size={16} />
                        </button>
                      </div>
                      {manualCodeError && (
                        <p className="text-xs text-red-500 mt-1.5">
                          {manualCodeError}
                        </p>
                      )}
                    </div>
                    {/* Coupon list */}
                    <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                      {COUPONS.map((c) => {
                        const isApplied = appliedCoupon?.code === c.code;
                        return (
                          <div
                            key={c.code}
                            className="flex items-start gap-3 p-4 transition-colors"
                            style={
                              isApplied
                                ? {
                                    background: "rgba(254,203,25,0.1)",
                                    borderLeft: "3px solid #FECB19",
                                  }
                                : {}
                            }
                          >
                            <div className="shrink-0 text-center w-12">
                              <p className="text-[9px] font-bold text-gray-400 uppercase leading-none">
                                FLAT
                              </p>
                              <p
                                className="text-xl font-black leading-tight"
                                style={{ color: "#c98e00" }}
                              >
                                {c.discount}%
                              </p>
                              <p className="text-[9px] font-bold text-gray-400 uppercase leading-none">
                                OFF
                              </p>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm text-gray-900">
                                {c.code}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                {c.description}
                              </p>
                              {isApplied ? (
                                <div
                                  className="flex items-center gap-1 mt-1.5 text-xs font-bold"
                                  style={{ color: "#c98e00" }}
                                >
                                  <CheckCircle2 size={12} /> Selected
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setAppliedCoupon(null);
                                      setShowCouponPanel(false);
                                    }}
                                    className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="mt-1.5 text-xs font-bold underline text-gray-700 hover:text-gray-900"
                                  onClick={() => {
                                    setAppliedCoupon(c);
                                    setShowCouponPanel(false);
                                  }}
                                >
                                  Select Coupon
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Price Details ── */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Price Details</h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Room Total</span>
                    <span className="font-medium text-gray-900">
                      ₹{(bookingData.room_total || 0).toLocaleString()}
                    </span>
                  </div>

                  {bookingData.meal_charges > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Meal Charges</span>
                      <span className="font-medium text-gray-900">
                        +₹{bookingData.meal_charges.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {bookingData.extra_bed_charges > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Extra Bed Charges</span>
                      <span className="font-medium text-gray-900">
                        +₹{bookingData.extra_bed_charges.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {appliedCoupon && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 font-medium">
                        Discount ({appliedCoupon.code})
                      </span>
                      <span className="font-medium text-green-600">
                        -₹{discountAmount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600">
                        Taxes &amp; Fees ({taxLabel})
                      </span>
                      <button
                        onClick={() => setShowTaxInfo(!showTaxInfo)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Info size={13} />
                      </button>
                    </div>
                    <span className="font-medium text-gray-900">
                      +₹{taxOnDiscounted.toLocaleString()}
                    </span>
                  </div>

                  {showTaxInfo && (
                    <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 leading-relaxed">
                      GST is a mandatory government tax applicable on
                      accommodation and services.
                    </div>
                  )}

                  <div className="flex justify-between pt-3 border-t border-gray-100">
                    <span className="font-bold text-gray-900">
                      Total Payable
                    </span>
                    <div className="text-right">
                      {appliedCoupon && (
                        <p className="text-xs text-gray-400 line-through">
                          ₹{(bookingData.total_amount || 0).toLocaleString()}
                        </p>
                      )}
                      <span className="font-bold text-gray-900 text-lg">
                        ₹{finalTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600">
                    {error}
                  </div>
                )}

                <button
                  onClick={handlePayNow}
                  disabled={processing}
                  className="mt-5 w-full py-4 rounded-2xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-60"
                  style={{
                    background: processing
                      ? "#ccc"
                      : "linear-gradient(135deg, #FECB19 0%, #F95622 100%)",
                    color: processing ? "#666" : "#0A0A0A",
                  }}
                >
                  {processing
                    ? "Processing…"
                    : `Pay ₹${finalTotal.toLocaleString()}`}
                </button>

                <p className="mt-3 text-xs text-center text-gray-400">
                  Secured by Cashfree Payments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* ── Mobile sticky footer ────────────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-4 pt-3 pb-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400">Total Payable</p>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold text-gray-900">
                ₹{finalTotal.toLocaleString()}
              </p>
              {appliedCoupon && (
                <p className="text-xs text-gray-400 line-through">
                  ₹{(bookingData.total_amount || 0).toLocaleString()}
                </p>
              )}
            </div>
            <p className="text-xs text-gray-400">incl. taxes &amp; fees</p>
          </div>
          <button
            onClick={handlePayNow}
            disabled={processing}
            className="flex-1 max-w-50 py-3.5 rounded-2xl text-sm font-bold disabled:opacity-60 transition-all active:scale-95"
            style={{
              background: processing
                ? "#ccc"
                : "linear-gradient(135deg, #FECB19 0%, #F95622 100%)",
              color: processing ? "#666" : "#0A0A0A",
            }}
          >
            {processing ? "Processing…" : "Pay Now"}
          </button>
        </div>
        {error && (
          <p className="text-xs text-red-500 text-center mt-2">{error}</p>
        )}
      </div>
    </main>
  );
}
