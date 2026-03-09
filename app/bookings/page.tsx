"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarDays,
  MapPin,
  MoreVertical,
  Settings,
  Download,
  Phone,
  XCircle,
  HeadphonesIcon,
  ArrowRight,
  Search,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface BookingItem {
  id: number;
  booking_id: string;
  property?: {
    id?: number;
    name?: string;
    property_name?: string;
    location?: string;
    images?: { image_url: string }[];
  };
  check_in: string;
  check_out: string;
  nights: number;
  adults: number;
  children?: number;
  total_amount: number | string;
  payment_status: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function getStatusCategory(
  b: BookingItem,
): "active" | "finished" | "cancelled" {
  if (b.status === "cancelled") return "cancelled";
  const co = new Date(b.check_out);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return co < today ? "finished" : "active";
}

function hasCheckedIn(b: BookingItem): boolean {
  const ci = new Date(b.check_in);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  ci.setHours(0, 0, 0, 0);
  return ci <= today;
}

function fmtDate(d: string) {
  try {
    return format(parseISO(d), "dd MMM yyyy");
  } catch {
    return d;
  }
}

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  confirmed: { bg: "#E8F5E9", text: "#2E7D32", label: "Confirmed" },
  pending: { bg: "#FFF8E1", text: "#F9A825", label: "Pending" },
  cancelled: { bg: "#FFEBEE", text: "#C62828", label: "Cancelled" },
  completed: { bg: "#E3F2FD", text: "#1565C0", label: "Completed" },
};

const PAYMENT_STYLES: Record<string, { bg: string; text: string }> = {
  success: { bg: "#E8F5E9", text: "#2E7D32" },
  failed: { bg: "#FFEBEE", text: "#C62828" },
  pending: { bg: "#FFF8E1", text: "#F9A825" },
};

// ─── Main Component ────────────────────────────────────────────────────────────

export default function BookingsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"active" | "finished" | "cancelled">("active");
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/payment/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          const raw = data.bookings?.data ?? data.bookings ?? [];
          setBookings(Array.isArray(raw) ? raw : []);
        } else {
          setError(data.message ?? "Failed to load bookings.");
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  // Close menu on outside click
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = bookings.filter((b) => getStatusCategory(b) === tab);

  const tabs: { key: "active" | "finished" | "cancelled"; label: string }[] = [
    { key: "active", label: "Active" },
    { key: "finished", label: "Finished" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <main
      style={{ background: "#f0efea" }}
      className="min-h-screen flex flex-col"
    >
      <Navbar forceDark />

      <div className="container max-w-3xl mx-auto px-4 pt-28 pb-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

        {/* ── Tabs ── */}
        <div
          className="flex gap-1 p-1 rounded-2xl mb-6"
          style={{ background: "#e5e4df" }}
        >
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={
                tab === key
                  ? {
                      background: "#fff",
                      color: "#0A0A0A",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
                    }
                  : { color: "#6b7280" }
              }
            >
              {label}
              {key === "active" &&
                bookings.filter((b) => getStatusCategory(b) === "active")
                  .length > 0 && (
                  <span
                    className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: "#F95622", color: "#fff" }}
                  >
                    {
                      bookings.filter((b) => getStatusCategory(b) === "active")
                        .length
                    }
                  </span>
                )}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div
              className="w-10 h-10 rounded-full border-4 animate-spin"
              style={{ borderColor: "#FECB19", borderTopColor: "transparent" }}
            />
            <p className="text-sm text-gray-500">Loading bookings…</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-sm text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm font-semibold text-gray-700 underline"
            >
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState tab={tab} />
        ) : (
          <div className="space-y-4" ref={menuRef}>
            {filtered.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                menuOpen={openMenuId === booking.id}
                onToggleMenu={() =>
                  setOpenMenuId(openMenuId === booking.id ? null : booking.id)
                }
                onCloseMenu={() => setOpenMenuId(null)}
                router={router}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

// ─── Booking Card ──────────────────────────────────────────────────────────────

function BookingCard({
  booking,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  router,
}: {
  booking: BookingItem;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  const propertyName =
    booking.property?.property_name ?? booking.property?.name ?? "Property";
  const propertyImg =
    booking.property?.images?.[0]?.image_url ?? "/images/place.jpg";
  const statusStyle = STATUS_STYLES[booking.status] ?? STATUS_STYLES["pending"];
  const paymentStyle =
    PAYMENT_STYLES[booking.payment_status] ?? PAYMENT_STYLES["pending"];
  const checked = hasCheckedIn(booking);
  const amount = parseFloat(String(booking.total_amount));

  const menuActions = [
    {
      key: "manage",
      icon: Settings,
      label: "Manage booking",
      show: true,
    },
    {
      key: "download",
      icon: Download,
      label: "Download invoice",
      show: true,
    },
    {
      key: "contact",
      icon: Phone,
      label: "Contact owner",
      show: true,
    },
    {
      key: "cancel",
      icon: XCircle,
      label: "Cancel booking",
      show: !checked && booking.status !== "cancelled",
      danger: true,
    },
    {
      key: "support",
      icon: HeadphonesIcon,
      label: "Get support",
      show: true,
    },
  ];

  const handleAction = (key: string) => {
    onCloseMenu();
    if (key === "manage") router.push(`/bookings/${booking.id}`);
    if (key === "support") router.push("/support");
    // download / contact / cancel: placeholder
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden relative">
      {/* Image + Info row */}
      <div className="flex gap-0">
        {/* Thumbnail */}
        <div
          className="w-28 sm:w-36 shrink-0 cursor-pointer relative overflow-hidden"
          style={{ minHeight: "9rem" }}
          onClick={() =>
            booking.property?.id &&
            window.open(`/listing/${booking.property.id}`, "_blank")
          }
        >
          <Image
            src={propertyImg}
            alt={propertyName}
            fill
            className="object-cover"
            sizes="144px"
          />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3
                className="font-bold text-gray-900 text-sm leading-tight truncate cursor-pointer hover:underline"
                onClick={() =>
                  booking.property?.id &&
                  window.open(`/listing/${booking.property.id}`, "_blank")
                }
              >
                {propertyName}
              </h3>
              {booking.property?.location && (
                <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
                  <MapPin size={10} />
                  <span className="truncate">{booking.property.location}</span>
                </div>
              )}
            </div>

            {/* Menu button */}
            <div className="relative shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMenu();
                }}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
              >
                <MoreVertical size={16} className="text-gray-500" />
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={onCloseMenu} />
                  <div className="absolute right-0 top-9 z-20 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 overflow-hidden">
                    {menuActions
                      .filter((a) => a.show)
                      .map(({ key, icon: Icon, label, danger }) => (
                        <button
                          key={key}
                          onClick={() => handleAction(key)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors"
                          style={{
                            color: danger ? "#ef4444" : "#374151",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background =
                              danger ? "#fff5f5" : "#fafaf7";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background =
                              "transparent";
                          }}
                        >
                          <Icon
                            size={15}
                            className="shrink-0"
                            style={{ color: danger ? "#ef4444" : "#9ca3af" }}
                          />
                          {label}
                        </button>
                      ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="flex items-center gap-1.5 mt-2.5 text-xs text-gray-500">
            <CalendarDays size={11} />
            <span>
              {fmtDate(booking.check_in)} → {fmtDate(booking.check_out)}
            </span>
            <span className="text-gray-300">·</span>
            <span>
              {booking.nights} night{booking.nights !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Amount + Booking ID row */}
          <div className="flex items-end justify-between mt-3 gap-2">
            <div>
              <p className="text-base font-bold text-gray-900">
                ₹{amount.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 font-mono">
                {booking.booking_id}
              </p>
            </div>

            {/* Status badges */}
            <div className="flex flex-col gap-1 items-end shrink-0">
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{
                  background: statusStyle.bg,
                  color: statusStyle.text,
                }}
              >
                {statusStyle.label}
              </span>
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{
                  background: paymentStyle.bg,
                  color: paymentStyle.text,
                }}
              >
                {booking.payment_status === "success"
                  ? "Paid"
                  : booking.payment_status === "failed"
                    ? "Payment Failed"
                    : "Payment Pending"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Manage button (footer strip) */}
      <div
        className="border-t flex items-center justify-between px-4 py-2.5"
        style={{ borderColor: "#f3f2ef" }}
      >
        <span className="text-xs text-gray-400">
          {booking.adults} adult{booking.adults !== 1 ? "s" : ""}
          {booking.children ? ` · ${booking.children} children` : ""}
        </span>
        <button
          onClick={() => router.push(`/bookings/${booking.id}`)}
          className="flex items-center gap-1 text-xs font-bold transition-colors"
          style={{ color: "#F95622" }}
        >
          Manage
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ tab }: { tab: "active" | "finished" | "cancelled" }) {
  const copy = {
    active: {
      emoji: "🏕️",
      title: "No active bookings",
      desc: "You don't have any upcoming stays. Start exploring amazing properties!",
      cta: true,
    },
    finished: {
      emoji: "✅",
      title: "No past trips",
      desc: "Your completed stays will appear here.",
      cta: false,
    },
    cancelled: {
      emoji: "🚫",
      title: "No cancelled bookings",
      desc: "Cancelled bookings will appear here.",
      cta: false,
    },
  }[tab];

  return (
    <div className="bg-white rounded-2xl p-10 text-center shadow-sm flex flex-col items-center gap-4">
      <span className="text-4xl">{copy.emoji}</span>
      <div>
        <p className="font-bold text-gray-900 text-base">{copy.title}</p>
        <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
          {copy.desc}
        </p>
      </div>
      {copy.cta && (
        <Link
          href="/explore"
          className="flex items-center gap-2 mt-1 px-6 py-3 rounded-xl text-sm font-bold text-white"
          style={{ background: "linear-gradient(135deg, #FECB19, #F95622)" }}
        >
          <Search size={14} />
          Browse Properties
        </Link>
      )}
    </div>
  );
}
