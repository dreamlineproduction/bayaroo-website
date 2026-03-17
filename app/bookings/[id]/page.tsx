"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format, differenceInDays, parseISO } from "date-fns";
import {
  MapPin,
  Map,
  QrCode,
  User,
  Mail,
  Phone,
  MessageCircle,
  Download,
  Headphones,
  XCircle,
  CheckCircle2,
  FileX,
  ReceiptText,
  Home,
  Pencil,
  Trash2,
  Plus,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  X,
  CalendarIcon,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface PropertyRule {
  id: number;
  rule_type: string;
  rule_text: string;
  display_order: number;
}

interface BookingGuest {
  id?: number;
  booking_id?: number;
  name: string;
  gender?: "male" | "female" | "other";
  date_of_birth?: string;
  pincode?: string;
  email?: string;
  phone?: string;
  is_primary?: boolean;
}

interface SelectedRoom {
  room_id?: number;
  room_name?: string;
  room_type?: string;
  quantity?: number;
  price_per_night?: number;
  total_price?: number;
  meal_option_name?: string | null;
  extra_beds?: number | null;
  assigned_guests?: number;
}

interface Property {
  id?: number;
  name?: string;
  property_name?: string;
  property_code?: string;
  address?: string;
  city?: string;
  state?: string;
  state_name?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  whatsapp_number?: string;
  check_in_time?: string;
  check_out_time?: string;
  cancellation_policy?: string;
  refund_policy?: string;
  house_rules?: string;
  rules?: PropertyRule[];
  vendor?: { name: string; email?: string; phone?: string };
  images?: { id: number; image_url: string; full_url?: string }[];
}

interface BookingDetail {
  id: number;
  booking_id: string;
  booking_number?: string;
  property?: Property;
  check_in: string;
  check_out: string;
  nights: number;
  total_amount?: number;
  payment_status?: string;
  status: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  number_of_guests?: number;
  total_guests?: number;
  adults?: number;
  children?: number;
  infants?: number;
  selected_rooms?: SelectedRoom[];
  room_total?: number;
  extra_bed_charges?: number;
  meal_charges?: number;
  subtotal?: number;
  tax_amount?: number;
  discount_amount?: number;
  created_at: string;
  cf_order_id?: string;
  payment_method?: string;
  cf_payment_id?: string;
  paid_at?: string;
  guests?: BookingGuest[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function formatTime(t?: string) {
  if (!t) return "";
  if (/AM|PM/i.test(t)) return t;
  const [h, m] = t.split(":");
  if (!m) return t;
  const hr = parseInt(h);
  const period = hr >= 12 ? "PM" : "AM";
  const h12 = hr % 12 || 12;
  return `${h12}:${m} ${period}`;
}

function fmtDate(d: string) {
  try {
    return format(parseISO(d), "dd MMM yyyy");
  } catch {
    return d;
  }
}
function fmtDateTime(d: string) {
  try {
    return format(new Date(d), "dd MMM yyyy, hh:mm a");
  } catch {
    return d;
  }
}

const STATUS_COLORS: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  confirmed: { bg: "#E8F5E9", text: "#2E7D32", label: "Confirmed" },
  pending: { bg: "#FFF8E1", text: "#F9A825", label: "Pending" },
  cancelled: { bg: "#FFEBEE", text: "#C62828", label: "Cancelled" },
  completed: { bg: "#E3F2FD", text: "#1565C0", label: "Completed" },
  "checked-in": { bg: "#E8F5E9", text: "#1B5E20", label: "Checked-In" },
  "checked-out": { bg: "#E3F2FD", text: "#0D47A1", label: "Checked-Out" },
};
const PAYMENT_COLORS: Record<string, { bg: string; text: string }> = {
  success: { bg: "#E8F5E9", text: "#2E7D32" },
  failed: { bg: "#FFEBEE", text: "#C62828" },
  pending: { bg: "#FFF8E1", text: "#F9A825" },
};

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function Card({
  title,
  children,
  action,
}: {
  title?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ManageBookingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [guests, setGuests] = useState<BookingGuest[]>([]);

  // Modal states
  const [showQR, setShowQR] = useState(false);
  const [showCancelPolicy, setShowCancelPolicy] = useState(false);
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);
  const [showHouseRules, setShowHouseRules] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // Guest form
  const [editingGuest, setEditingGuest] = useState<BookingGuest | null>(null);
  const [guestForm, setGuestForm] = useState<Partial<BookingGuest>>({
    name: "",
    gender: undefined,
    date_of_birth: "",
    pincode: "",
    email: "",
    phone: "",
  });
  const [guestFormError, setGuestFormError] = useState("");
  const [dobPickerOpen, setDobPickerOpen] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // ── Fetch ──

  const fetchBooking = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/payment/booking/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        router.replace("/login");
        return;
      }
      const data = await res.json();
      if (data.success && data.booking) {
        const bd: BookingDetail = data.booking;
        if (!bd.guest_name) {
          try {
            const user = JSON.parse(localStorage.getItem("user") ?? "{}");
            bd.guest_name = user.name ?? user.full_name;
            bd.guest_email = user.email;
            bd.guest_phone = user.phone ?? user.mobile;
          } catch {}
        }
        setBooking(bd);
        setGuests(bd.guests ?? []);
        if (!bd.guests?.length) fetchGuests(bd.id, token);
      } else {
        setError(data.message ?? "Booking not found.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchGuests = async (bookingId: number, token?: string) => {
    const t = token ?? localStorage.getItem("auth_token");
    if (!t) return;
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/guests`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.guests) setGuests(data.guests);
      }
    } catch {}
  };

  // Validate token first — booking is fetched from a public endpoint so
  // an expired token wouldn't be caught there; this catches it early.
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          router.replace("/login");
        } else {
          fetchBooking();
        }
      })
      .catch(() => fetchBooking()); // network error — still try to load
  }, [id]);

  // ── Status helpers ──

  const isCheckInToday = () =>
    booking
      ? new Date(booking.check_in).toDateString() === new Date().toDateString()
      : false;
  const isCheckOutToday = () =>
    booking
      ? new Date(booking.check_out).toDateString() === new Date().toDateString()
      : false;
  const daysUntilCheckIn = () =>
    booking ? differenceInDays(new Date(booking.check_in), new Date()) : 0;
  const isUpcoming = daysUntilCheckIn() > 0;
  const canCancel = isUpcoming && booking?.status !== "cancelled";

  const bookingStatusKey = () => {
    if (isCheckInToday()) return "checked-in";
    if (isCheckOutToday()) return "checked-out";
    return booking?.status ?? "pending";
  };
  const statusStyle =
    STATUS_COLORS[bookingStatusKey()] ?? STATUS_COLORS["pending"];
  const paymentStyle =
    PAYMENT_COLORS[booking?.payment_status ?? "pending"] ??
    PAYMENT_COLORS["pending"];

  // ── Guest management ──

  const openAddGuest = () => {
    setEditingGuest(null);
    setGuestForm({
      name: "",
      gender: undefined,
      date_of_birth: "",
      pincode: "",
      email: "",
      phone: "",
    });
    setGuestFormError("");
    setShowGuestModal(true);
  };
  const openEditGuest = (g: BookingGuest) => {
    setEditingGuest(g);
    setGuestForm({
      name: g.name,
      gender: g.gender,
      date_of_birth: g.date_of_birth,
      pincode: g.pincode,
      email: g.email,
      phone: g.phone,
    });
    setGuestFormError("");
    setShowGuestModal(true);
  };

  const handleSaveGuest = async () => {
    setGuestFormError("");
    if (!guestForm.name) return setGuestFormError("Name is required.");
    if (!guestForm.gender) return setGuestFormError("Gender is required.");
    if (!guestForm.date_of_birth)
      return setGuestFormError("Date of birth is required.");
    if (!guestForm.pincode) return setGuestFormError("PIN code is required.");

    const token = localStorage.getItem("auth_token");
    if (!token || !booking) return;
    try {
      if (editingGuest?.id) {
        const res = await fetch(
          `${API_BASE}/bookings/${booking.id}/guests/${editingGuest.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(guestForm),
          },
        );
        if (res.status === 401) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          router.replace("/login");
          return;
        }
        if (!res.ok)
          throw new Error(
            (await res.json()).message ?? "Failed to update guest",
          );
        showToast("Guest updated");
      } else {
        const maxGuests = booking.total_guests ?? booking.number_of_guests ?? 0;
        if (guests.length >= maxGuests)
          return setGuestFormError(`Max ${maxGuests} guests allowed.`);
        const res = await fetch(`${API_BASE}/bookings/${booking.id}/guests`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(guestForm),
        });
        if (res.status === 401) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          router.replace("/login");
          return;
        }
        if (!res.ok)
          throw new Error((await res.json()).message ?? "Failed to add guest");
        showToast("Guest added");
      }
      await fetchGuests(booking.id);
      setShowGuestModal(false);
    } catch (e: any) {
      setGuestFormError(e.message ?? "Something went wrong.");
    }
  };

  const handleDeleteGuest = async (guestId: number) => {
    if (!booking) return;
    const token = localStorage.getItem("auth_token");
    if (!token) return;
    if (!window.confirm("Remove this guest?")) return;
    try {
      const res = await fetch(
        `${API_BASE}/bookings/${booking.id}/guests/${guestId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        router.replace("/login");
        return;
      }
      await fetchGuests(booking.id);
      showToast("Guest removed");
    } catch {}
  };

  // ── Render ──

  if (loading)
    return (
      <main style={{ background: "#f0efea" }} className="min-h-screen">
        <Navbar forceDark />
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <div
            className="w-10 h-10 rounded-full border-4 animate-spin"
            style={{ borderColor: "#FECB19", borderTopColor: "transparent" }}
          />
          <p className="text-sm text-gray-500">Loading booking details…</p>
        </div>
      </main>
    );

  if (!booking)
    return (
      <main style={{ background: "#f0efea" }} className="min-h-screen">
        <Navbar forceDark />
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
          <p className="text-sm text-red-500 text-center">
            {error || "Booking not found."}
          </p>
          <Link
            href="/bookings"
            className="text-sm font-bold text-gray-700 underline"
          >
            ← Back to Bookings
          </Link>
        </div>
      </main>
    );

  const prop = booking.property;
  const totalGuests = booking.total_guests ?? booking.number_of_guests ?? 0;
  const waMsg = prop?.whatsapp_number
    ? encodeURIComponent(
        `Hi, I have a booking at *${prop.name ?? ""}*\n\nBooking ID: ${booking.booking_id}\nCheck-in: ${fmtDate(booking.check_in)}\nCheck-out: ${fmtDate(booking.check_out)}\nNights: ${booking.nights}\n\nI would like to inquire about my reservation.`,
      )
    : "";

  return (
    <main
      style={{ background: "#f0efea" }}
      className="min-h-screen flex flex-col"
    >
      <Navbar forceDark />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-xl shadow-xl">
          {toast}
        </div>
      )}

      <div
        className="container max-w-3xl mx-auto px-4 pt-28 pb-16 space-y-4"
        style={{ marginTop: "7rem", paddingBottom: "8rem" }}
      >
        {/* Back */}
        <button
          onClick={() => router.push("/bookings")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-1"
        >
          <ArrowLeft size={15} /> Back to Bookings
        </button>

        {/* ── Status Banner ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs text-gray-400 mb-1">Booking Status</p>
            <span
              className="px-3 py-1 rounded-full text-sm font-bold"
              style={{ background: statusStyle.bg, color: statusStyle.text }}
            >
              {statusStyle.label.toUpperCase()}
            </span>
            {isUpcoming && (
              <p className="text-xs text-gray-400 mt-2">
                {daysUntilCheckIn()} day{daysUntilCheckIn() !== 1 ? "s" : ""}{" "}
                until check-in
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-1">Payment</p>
            <span
              className="px-3 py-1 rounded-full text-sm font-bold"
              style={{ background: paymentStyle.bg, color: paymentStyle.text }}
            >
              {booking.payment_status === "success"
                ? "PAID"
                : (booking.payment_status ?? "PENDING").toUpperCase()}
            </span>
          </div>
        </div>

        {/* ── Property Overview ── */}
        <Card>
          <div>
            <h2 className="font-bold text-gray-900 text-lg leading-tight">
              {prop?.name ?? prop?.property_name ?? "Property"}
            </h2>
            {prop?.address && (
              <div className="flex items-start gap-1.5 mt-1.5 text-xs text-gray-500">
                <MapPin size={12} className="shrink-0 mt-0.5" />
                <span>
                  {prop.address}
                  {prop.city ? `, ${prop.city}` : ""}
                  {(prop.state_name ?? prop.state)
                    ? `, ${prop.state_name ?? prop.state}`
                    : ""}
                  {prop.pincode ? ` - ${prop.pincode}` : ""}
                </span>
              </div>
            )}
            <div className="flex gap-2 mt-3 flex-wrap">
              <button
                onClick={() => setShowQR(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <QrCode size={14} /> Show QR Code
              </button>
              {prop?.latitude && prop?.longitude && (
                <a
                  href={`https://www.google.com/maps?q=${prop.latitude},${prop.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <Map size={14} /> See Location
                </a>
              )}
            </div>
          </div>
        </Card>

        {/* ── Booking Information ── */}
        <Card title="Booking Information">
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Booking ID",
                value: (
                  <span className="font-mono text-xs">
                    {booking.booking_id}
                  </span>
                ),
              },
              { label: "Property Code", value: prop?.property_code ?? "—" },
              {
                label: "Check-in",
                value: (
                  <span>
                    {fmtDate(booking.check_in)}
                    {prop?.check_in_time && (
                      <span className="block text-gray-400 text-xs">
                        {formatTime(prop.check_in_time)}
                      </span>
                    )}
                  </span>
                ),
              },
              {
                label: "Check-out",
                value: (
                  <span>
                    {fmtDate(booking.check_out)}
                    {prop?.check_out_time && (
                      <span className="block text-gray-400 text-xs">
                        {formatTime(prop.check_out_time)}
                      </span>
                    )}
                  </span>
                ),
              },
              { label: "Nights", value: booking.nights },
              {
                label: "Guests",
                value: (
                  <span>
                    {totalGuests}
                    {(booking.adults ||
                      booking.children ||
                      booking.infants) && (
                      <span className="block text-gray-400 text-xs">
                        {booking.adults
                          ? `${booking.adults} Adult${booking.adults > 1 ? "s" : ""}`
                          : ""}
                        {booking.children
                          ? `, ${booking.children} Child${booking.children > 1 ? "ren" : ""}`
                          : ""}
                        {booking.infants
                          ? `, ${booking.infants} Infant${booking.infants > 1 ? "s" : ""}`
                          : ""}
                      </span>
                    )}
                  </span>
                ),
              },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* ── Guest Details ── */}
        <Card title="Primary Guest">
          <div className="space-y-2">
            {booking.guest_name && (
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <User size={15} className="shrink-0 text-gray-400" />
                <span>{booking.guest_name}</span>
              </div>
            )}
            {booking.guest_email && (
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Mail size={15} className="shrink-0 text-gray-400" />
                <span>{booking.guest_email}</span>
              </div>
            )}
            {booking.guest_phone && (
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Phone size={15} className="shrink-0 text-gray-400" />
                <span>{booking.guest_phone}</span>
              </div>
            )}
          </div>
        </Card>

        {/* ── Additional Guests ── */}
        <Card
          title="Additional Guests"
          action={
            <button
              onClick={openAddGuest}
              disabled={guests.length >= totalGuests}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-opacity disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, #FECB19, #F95622)",
              }}
            >
              <Plus size={12} /> Add Guest
            </button>
          }
        >
          <p className="text-xs text-gray-400 mb-3">
            Add details for all guests to speed up check-in.
            {totalGuests > 0 && (
              <strong>
                {" "}
                ({guests.length}/{totalGuests} added)
              </strong>
            )}
          </p>
          {guests.length > 0 ? (
            <div className="space-y-2">
              {guests.map((g) => (
                <div
                  key={g.id ?? g.name}
                  className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <User size={16} className="shrink-0 mt-0.5 text-gray-400" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {g.name}
                        {g.is_primary && (
                          <span
                            className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold"
                            style={{ background: "#FFF8E1", color: "#F9A825" }}
                          >
                            Primary
                          </span>
                        )}
                      </p>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                        {g.gender && (
                          <span className="text-xs text-gray-400 capitalize">
                            {g.gender}
                          </span>
                        )}
                        {g.date_of_birth && (
                          <span className="text-xs text-gray-400">
                            DOB: {fmtDate(g.date_of_birth)}
                          </span>
                        )}
                        {g.pincode && (
                          <span className="text-xs text-gray-400">
                            PIN: {g.pincode}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditGuest(g)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Pencil size={13} className="text-gray-500" />
                    </button>
                    {!g.is_primary && g.id && (
                      <button
                        onClick={() => handleDeleteGuest(g.id!)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={13} className="text-red-400" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-400">
                No additional guests added yet.
              </p>
            </div>
          )}
        </Card>

        {/* ── Payment Summary ── */}
        <Card title="Payment Summary">
          <div className="space-y-2">
            {booking.selected_rooms && booking.selected_rooms.length > 0 && (
              <div className="space-y-2 mb-3">
                {booking.selected_rooms.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-2 text-sm"
                  >
                    <div>
                      <span className="font-medium text-gray-700">
                        {r.quantity && r.quantity > 1 ? `${r.quantity}× ` : ""}
                        {r.room_name ?? r.room_type ?? `Room ${i + 1}`}
                      </span>
                      {r.meal_option_name && (
                        <span className="text-xs text-gray-400 ml-1.5">
                          ({r.meal_option_name})
                        </span>
                      )}
                      {r.extra_beds && r.extra_beds > 0 && (
                        <span className="text-xs text-gray-400 ml-1.5">
                          +{r.extra_beds} extra bed{r.extra_beds > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    {r.total_price && (
                      <span className="text-gray-700 shrink-0">
                        ₹{r.total_price.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                ))}
                <div className="border-t border-dashed border-gray-200 my-2" />
              </div>
            )}
            {[
              booking.room_total
                ? { label: "Room Total", val: booking.room_total }
                : null,
              (booking.extra_bed_charges ?? 0) > 0
                ? {
                    label: "Extra Bed Charges",
                    val: booking.extra_bed_charges!,
                  }
                : null,
              (booking.meal_charges ?? 0) > 0
                ? { label: "Meal Charges", val: booking.meal_charges! }
                : null,
              booking.subtotal
                ? { label: "Subtotal", val: booking.subtotal }
                : null,
            ]
              .filter(Boolean)
              .map((row) => (
                <div
                  key={row!.label}
                  className="flex justify-between text-sm text-gray-600"
                >
                  <span>{row!.label}</span>
                  <span>₹{row!.val.toLocaleString("en-IN")}</span>
                </div>
              ))}
            {(booking.discount_amount ?? 0) > 0 && (
              <div
                className="flex justify-between text-sm"
                style={{ color: "#2E7D32" }}
              >
                <span>Discount</span>
                <span>
                  −₹{(booking.discount_amount ?? 0).toLocaleString("en-IN")}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Taxes & Fees</span>
              <span>₹{(booking.tax_amount ?? 0).toLocaleString("en-IN")}</span>
            </div>
            <div className="border-t border-gray-100 pt-2 mt-1 flex justify-between font-bold text-gray-900">
              <span>Total Amount</span>
              <span>
                ₹{(booking.total_amount ?? 0).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </Card>

        {/* ── Property Contact ── */}
        {(prop?.phone || prop?.whatsapp_number || prop?.vendor?.name) && (
          <Card title="Property Contact">
            <div className="space-y-2.5">
              {prop?.phone && (
                <a
                  href={`tel:${prop.phone}`}
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-orange-500 transition-colors group"
                >
                  <Phone
                    size={15}
                    className="shrink-0 text-gray-400 group-hover:text-orange-400"
                  />
                  <span>
                    Front Desk: <strong>{prop.phone}</strong>
                  </span>
                  <ExternalLink size={12} className="ml-auto text-gray-300" />
                </a>
              )}
              {prop?.whatsapp_number && (
                <a
                  href={`https://wa.me/${prop.whatsapp_number.replace(/\D/g, "")}?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-green-600 transition-colors group"
                >
                  <MessageCircle
                    size={15}
                    className="shrink-0 text-gray-400 group-hover:text-green-500"
                  />
                  <span>
                    WhatsApp: <strong>{prop.whatsapp_number}</strong>
                  </span>
                  <ExternalLink size={12} className="ml-auto text-gray-300" />
                </a>
              )}
              {prop?.vendor?.name && (
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <User size={15} className="shrink-0 text-gray-400" />
                  <span>
                    Hosted by: <strong>{prop.vendor.name}</strong>
                  </span>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* ── Action Buttons ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              icon: Download,
              label: "Download Invoice",
              action: () => showToast("Invoice download coming soon"),
            },
            {
              icon: Phone,
              label: "Call Property",
              action: () =>
                prop?.phone
                  ? window.open(`tel:${prop.phone}`)
                  : showToast("No phone available"),
            },
            {
              icon: MessageCircle,
              label: "Message Property",
              action: () =>
                prop?.whatsapp_number
                  ? window.open(
                      `https://wa.me/${prop.whatsapp_number.replace(/\D/g, "")}?text=${waMsg}`,
                      "_blank",
                    )
                  : showToast("No WhatsApp available"),
            },
            {
              icon: Headphones,
              label: "Get Support",
              action: () => router.push("/support"),
            },
          ].map(({ icon: Icon, label, action }) => (
            <button
              key={label}
              onClick={action}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm text-xs font-semibold text-gray-600 hover:shadow-md hover:text-gray-900 transition-all"
            >
              <Icon size={20} className="text-gray-400" />
              {label}
            </button>
          ))}
        </div>

        {/* ── Important Information ── */}
        <Card title="Important Information">
          <div className="space-y-1">
            {[
              {
                icon: FileX,
                label: "Cancellation Policy",
                action: () => setShowCancelPolicy(true),
              },
              {
                icon: ReceiptText,
                label: "Refund Policy",
                action: () => setShowRefundPolicy(true),
              },
              {
                icon: Home,
                label: "House Rules",
                action: () => setShowHouseRules(true),
              },
            ].map(({ icon: Icon, label, action }) => (
              <button
                key={label}
                onClick={action}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
              >
                <Icon size={16} className="text-gray-400 shrink-0" />
                <span>{label}</span>
                <ChevronRight size={14} className="ml-auto text-gray-300" />
              </button>
            ))}
          </div>
        </Card>

        {/* ── Timeline ── */}
        <Card title="Booking Timeline">
          <div className="space-y-0">
            {[
              {
                show: true,
                dot: "default",
                title: "Booking Created",
                sub: booking.created_at
                  ? fmtDateTime(booking.created_at)
                  : "N/A",
              },
              {
                show: booking.payment_status === "success",
                dot: "success",
                title: "Payment Received",
                sub: `₹${(booking.total_amount ?? 0).toLocaleString("en-IN")}${booking.payment_method ? ` via ${booking.payment_method}` : ""}${booking.paid_at ? ` · ${fmtDateTime(booking.paid_at)}` : ""}`,
              },
              {
                show: booking.status === "confirmed",
                dot: "success",
                title: "Booking Confirmed",
                sub: "",
              },
              {
                show:
                  isCheckInToday() ||
                  (booking.check_in &&
                    new Date(booking.check_in) < new Date() &&
                    new Date() < new Date(booking.check_out)),
                dot: isCheckInToday() ? "success" : "completed",
                title: isCheckInToday() ? "Check-In Today" : "Checked In",
                sub: `${fmtDate(booking.check_in)}${prop?.check_in_time ? ` at ${formatTime(prop.check_in_time)}` : ""}`,
              },
              {
                show: isCheckOutToday(),
                dot: "warning",
                title: "Check-Out Today",
                sub: `${fmtDate(booking.check_out)}${prop?.check_out_time ? ` by ${formatTime(prop.check_out_time)}` : ""}`,
              },
              {
                show:
                  !!booking.check_out &&
                  new Date(booking.check_out) < new Date(),
                dot: "completed",
                title: "Checked Out",
                sub: fmtDate(booking.check_out),
              },
            ]
              .filter((t) => t.show)
              .map((item, idx, arr) => (
                <div key={item.title} className="flex gap-3 relative">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-3 h-3 rounded-full mt-1 shrink-0 z-10"
                      style={{
                        background:
                          item.dot === "success"
                            ? "#2E7D32"
                            : item.dot === "warning"
                              ? "#F9A825"
                              : item.dot === "completed"
                                ? "#1565C0"
                                : "#9ca3af",
                      }}
                    />
                    {idx < arr.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gray-200 my-1" />
                    )}
                  </div>
                  <div className="pb-4 pt-0.5">
                    <p className="text-sm font-semibold text-gray-900">
                      {item.title}
                    </p>
                    {item.sub && (
                      <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </Card>

        {/* ── Cancel Booking ── */}
        {canCancel && (
          <div className="flex justify-center pt-2 pb-1">
            <button
              onClick={() => {
                setCancelReason("");
                setShowCancelConfirm(true);
              }}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              <XCircle size={13} />
              <span className="underline underline-offset-2">
                Cancel this booking
              </span>
            </button>
          </div>
        )}
      </div>

      <Footer />

      {/* ── QR Modal ── */}
      <Modal
        open={showQR}
        onClose={() => setShowQR(false)}
        title="Check-in QR Code"
      >
        <div className="flex flex-col items-center gap-4">
          <p className="text-xs text-gray-400 text-center">
            Present this QR code at the property reception
          </p>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${booking.booking_id}`}
            alt="Booking QR Code"
            className="rounded-xl border border-gray-100 shadow"
            width={280}
            height={280}
          />
          <div className="w-full space-y-2">
            {[
              { l: "Guest Name", v: booking.guest_name },
              {
                l: "Check-in",
                v: `${fmtDate(booking.check_in)}${prop?.check_in_time ? ` · ${formatTime(prop.check_in_time)}` : ""}`,
              },
              {
                l: "Check-out",
                v: `${fmtDate(booking.check_out)}${prop?.check_out_time ? ` · ${formatTime(prop.check_out_time)}` : ""}`,
              },
              {
                l: "Total",
                v: `₹${(booking.total_amount ?? 0).toLocaleString("en-IN")}`,
              },
            ].map(({ l, v }) =>
              v ? (
                <div key={l} className="flex justify-between text-sm">
                  <span className="text-gray-400">{l}</span>
                  <span className="font-semibold text-gray-900">{v}</span>
                </div>
              ) : null,
            )}
          </div>
          <div className="w-full space-y-2 pt-2 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500">
              Check-in Instructions
            </p>
            {[
              "Show this QR code at the reception desk",
              "Keep your ID proof ready for verification",
              "Screenshot this code for offline access",
            ].map((t) => (
              <div
                key={t}
                className="flex items-start gap-2 text-xs text-gray-500"
              >
                <CheckCircle2
                  size={14}
                  className="shrink-0 mt-0.5"
                  style={{ color: "#2E7D32" }}
                />
                {t}
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* ── Policy Modals ── */}
      <Modal
        open={showCancelPolicy}
        onClose={() => setShowCancelPolicy(false)}
        title="Cancellation Policy"
      >
        <div
          className="text-sm text-gray-700 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{
            __html:
              prop?.cancellation_policy ??
              "<p>Standard cancellation policy applies.</p>",
          }}
        />
      </Modal>

      <Modal
        open={showRefundPolicy}
        onClose={() => setShowRefundPolicy(false)}
        title="Refund Policy"
      >
        <div
          className="text-sm text-gray-700 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{
            __html:
              prop?.refund_policy ?? "<p>Standard refund policy applies.</p>",
          }}
        />
      </Modal>

      <Modal
        open={showHouseRules}
        onClose={() => setShowHouseRules(false)}
        title="House Rules"
      >
        {prop?.rules && prop.rules.length > 0 ? (
          <div className="space-y-4">
            {[
              { type: "check_in", label: "Check-in Rules" },
              { type: "check_out", label: "Check-out Rules" },
              { type: "house", label: "House Rules" },
              { type: "safety", label: "Safety Guidelines" },
              { type: "guest", label: "Guest Responsibilities" },
            ].map(({ type, label }) => {
              const rules = prop
                .rules!.filter((r) => r.rule_type === type)
                .sort((a, b) => a.display_order - b.display_order);
              if (!rules.length) return null;
              return (
                <div key={type}>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    {label}
                  </p>
                  {rules.map((r) => (
                    <div
                      key={r.id}
                      className="text-sm text-gray-700 mb-1 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: r.rule_text }}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="text-sm text-gray-700 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: prop?.house_rules ?? "<p>Standard house rules apply.</p>",
            }}
          />
        )}
      </Modal>

      {/* ── Add / Edit Guest Modal ── */}
      <Modal
        open={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        title={editingGuest ? "Edit Guest" : "Add Guest"}
      >
        <div className="space-y-3">
          {guestFormError && (
            <p className="text-xs text-red-500 bg-red-50 rounded-xl px-3 py-2">
              {guestFormError}
            </p>
          )}
          {[
            {
              label: "Full Name *",
              type: "text",
              key: "name",
              placeholder: "Enter guest name",
            },
            {
              label: "PIN Code *",
              type: "number",
              key: "pincode",
              placeholder: "Enter PIN code",
            },
            {
              label: "Email (Optional)",
              type: "email",
              key: "email",
              placeholder: "Enter email",
            },
            {
              label: "Phone (Optional)",
              type: "tel",
              key: "phone",
              placeholder: "Enter phone number",
            },
          ].map(({ label, type, key, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                {label}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                value={(guestForm as any)[key] ?? ""}
                onChange={(e) =>
                  setGuestForm({ ...guestForm, [key]: e.target.value })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400 transition-colors"
              />
            </div>
          ))}
          {/* Date of Birth – Calendar Picker */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Date of Birth *
            </label>
            <Popover open={dobPickerOpen} onOpenChange={setDobPickerOpen}>
              <PopoverTrigger asChild>
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setDobPickerOpen(true)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-left transition-colors hover:border-orange-400 bg-white cursor-pointer"
                >
                  <CalendarIcon size={14} className="text-gray-400 shrink-0" />
                  {guestForm.date_of_birth ? (
                    format(parseISO(guestForm.date_of_birth), "dd MMM yyyy")
                  ) : (
                    <span className="text-gray-400">Pick a date</span>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    guestForm.date_of_birth
                      ? parseISO(guestForm.date_of_birth)
                      : undefined
                  }
                  onSelect={(date) => {
                    setGuestForm({
                      ...guestForm,
                      date_of_birth: date ? format(date, "yyyy-MM-dd") : "",
                    });
                    setDobPickerOpen(false);
                  }}
                  disabled={(date) => date > new Date()}
                  captionLayout="dropdown"
                  fromYear={1920}
                  toYear={new Date().getFullYear()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Gender *
            </label>
            <select
              value={guestForm.gender ?? ""}
              onChange={(e) =>
                setGuestForm({ ...guestForm, gender: e.target.value as any })
              }
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400 transition-colors bg-white"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={guestForm.is_primary ?? false}
              onChange={(e) =>
                setGuestForm({ ...guestForm, is_primary: e.target.checked })
              }
              className="rounded"
            />
            <span className="text-xs text-gray-600">Mark as Primary Guest</span>
          </label>
          <button
            onClick={handleSaveGuest}
            className="w-full py-3 rounded-xl text-sm font-bold text-white mt-2"
            style={{ background: "linear-gradient(135deg, #FECB19, #F95622)" }}
          >
            {editingGuest ? "Update Guest" : "Add Guest"}
          </button>
        </div>
      </Modal>

      {/* ── Cancel Confirm Modal ── */}
      <Modal
        open={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        title="Cancel Booking?"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            This action cannot be undone. Please tell us why you want to cancel.
          </p>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Reason for cancellation *
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Change of plans, found a better option…"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400 transition-colors resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCancelConfirm(false)}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Keep Booking
            </button>
            <button
              disabled={!cancelReason.trim()}
              onClick={() => {
                setShowCancelConfirm(false);
                showToast("Cancellation coming soon");
              }}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
