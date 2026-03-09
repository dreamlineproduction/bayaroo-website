"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  Home,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

type Status = "loading" | "success" | "failed" | "pending";

interface Booking {
  id: number;
  booking_id: string;
  property?: { name?: string; property_name?: string };
  check_in: string;
  check_out: string;
  nights: number;
  adults: number;
  children?: number;
  total_amount: string | number;
  payment_status: string;
  payment_method?: string;
  cf_payment_id?: string;
}

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");

  const [status, setStatus] = useState<Status>("loading");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const checkStatus = useCallback(async () => {
    if (!orderId) {
      setStatus("failed");
      setErrorMsg("Invalid payment request – no order ID found.");
      return;
    }

    const token = localStorage.getItem("auth_token");
    if (!token) {
      setStatus("failed");
      setErrorMsg("Please log in to view your payment status.");
      return;
    }

    setStatus("loading");

    try {
      // 1. First, ask backend to sync with Cashfree
      try {
        await fetch(`${API_BASE}/payment/verify-status/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Non-fatal – continue to fetch booking details
      }

      // Short pause for backend to update
      await new Promise((r) => setTimeout(r, 1000));

      // 2. Fetch booking details
      const res = await fetch(`${API_BASE}/payment/booking/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus("failed");
        setErrorMsg(data.message ?? "Unable to fetch booking details.");
        return;
      }

      setBooking(data.booking);

      const ps = data.booking.payment_status;
      if (ps === "success") setStatus("success");
      else if (ps === "failed") {
        setStatus("failed");
        setErrorMsg("Your payment was not completed.");
      } else {
        setStatus("pending");
      }
    } catch (err: any) {
      setStatus("failed");
      setErrorMsg(err.message ?? "Something went wrong. Please try again.");
    }
  }, [orderId]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const fmtDate = (d: string) => {
    try {
      return format(parseISO(d), "dd MMM yyyy");
    } catch {
      return d;
    }
  };

  const propertyName =
    booking?.property?.property_name ??
    booking?.property?.name ??
    "Your Property";

  // ── Loading ────────────────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-5"
        style={{ background: "#f0efea" }}
      >
        <Image
          src="/logo-color.svg"
          alt="Bayaroo"
          width={120}
          height={28}
          className="h-8 w-auto"
        />
        <div
          className="w-10 h-10 rounded-full border-4 animate-spin"
          style={{ borderColor: "#FECB19", borderTopColor: "transparent" }}
        />
        <p className="text-sm font-medium text-gray-500">Verifying payment…</p>
      </div>
    );
  }

  // ── Result ─────────────────────────────────────────────────────────────────
  return (
    <main
      style={{ background: "#f0efea" }}
      className="min-h-screen flex flex-col"
    >
      <Navbar forceDark />

      <div className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="bg-white rounded-3xl shadow-sm border border-black/5 w-full max-w-lg p-8 sm:p-10">
          {/* ── Success ── */}
          {status === "success" && (
            <>
              <div className="flex justify-center mb-6">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: "#E8F5E9" }}
                >
                  <CheckCircle2
                    size={40}
                    className="text-green-600"
                    strokeWidth={1.8}
                  />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">
                Payment Successful!
              </h1>
              <p className="text-sm text-gray-500 text-center mb-8">
                Your booking has been confirmed.
              </p>

              {booking && (
                <div
                  className="rounded-2xl p-5 mb-6 space-y-3"
                  style={{ background: "#f8f8f5" }}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-gray-400 font-medium">
                      Property
                    </span>
                    <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%]">
                      {propertyName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">
                      Booking ID
                    </span>
                    <span className="text-sm font-mono font-bold text-gray-900">
                      {booking.booking_id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">
                      Check-in
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {fmtDate(booking.check_in)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">
                      Check-out
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {fmtDate(booking.check_out)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">
                      Guests
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {booking.adults + (booking.children ?? 0)} guests
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                    <span className="text-xs text-gray-400 font-medium">
                      Amount Paid
                    </span>
                    <span className="text-base font-bold text-gray-900">
                      ₹
                      {parseFloat(String(booking.total_amount)).toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </div>
                  {booking.payment_method && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 font-medium">
                        Paid via
                      </span>
                      <span className="text-sm font-semibold text-gray-900 capitalize">
                        {booking.payment_method.replace(/_/g, " ")}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Link
                  href="/bookings"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg, #FECB19, #F95622)",
                  }}
                >
                  View My Bookings
                  <ArrowRight size={15} />
                </Link>
                <Link
                  href="/"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Home size={15} />
                  Back to Home
                </Link>
              </div>
            </>
          )}

          {/* ── Failed ── */}
          {status === "failed" && (
            <>
              <div className="flex justify-center mb-6">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: "#FFEBEE" }}
                >
                  <XCircle
                    size={40}
                    className="text-red-500"
                    strokeWidth={1.8}
                  />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">
                Payment Failed
              </h1>
              <p className="text-sm text-gray-500 text-center mb-8">
                {errorMsg || "Your payment could not be processed."}
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.back()}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg, #FECB19, #F95622)",
                  }}
                >
                  <RotateCcw size={15} />
                  Try Again
                </button>
                <Link
                  href="/"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Home size={15} />
                  Back to Home
                </Link>
              </div>
            </>
          )}

          {/* ── Pending ── */}
          {status === "pending" && (
            <>
              <div className="flex justify-center mb-6">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: "#FFF8E1" }}
                >
                  <Clock
                    size={40}
                    strokeWidth={1.8}
                    style={{ color: "#F95622" }}
                  />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">
                Payment Pending
              </h1>
              <p className="text-sm text-gray-500 text-center mb-8">
                Your payment is being processed. This usually takes a few
                seconds.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={checkStatus}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg, #FECB19, #F95622)",
                  }}
                >
                  <RotateCcw size={15} />
                  Check Status Again
                </button>
                <Link
                  href="/"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Home size={15} />
                  Back to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
