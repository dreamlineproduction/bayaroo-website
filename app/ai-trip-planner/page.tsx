"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  CalendarDays,
  Users,
  Wallet,
  User,
  Phone,
  Mail,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Check,
  ArrowRight,
  Star,
  MessageCircle,
  X,
  Send,
  Bot,
  Plus,
  Minus,
} from "lucide-react";
import { type DateRange } from "react-day-picker";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfDay,
  getDay,
  getDaysInMonth,
  addDays,
  addMonths,
  subMonths,
  isBefore,
  isAfter,
  isSameDay,
  getDate,
} from "date-fns";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const STORAGE_BASE = API_BASE.replace(/\/api$/, "");

const CC_APP_ID = process.env.NEXT_PUBLIC_COMETCHAT_APP_ID ?? "";
const CC_REGION = process.env.NEXT_PUBLIC_COMETCHAT_REGION ?? "us";
const CC_AUTH_KEY = process.env.NEXT_PUBLIC_COMETCHAT_AUTH_KEY ?? "";
const CC_BOT_UID = process.env.NEXT_PUBLIC_COMETCHAT_BOT_UID ?? "";
const CC_ENABLED = !!(CC_APP_ID && CC_AUTH_KEY && CC_BOT_UID);

// ─── Types ───────────────────────────────────────────────────────────────────

type TripPlan = {
  state: string;
  experiences: string[];
  dateRange: DateRange | undefined;
  tripType: "solo" | "couple" | "family" | "friends" | "";
  adults: number;
  children: number;
  infants: number;
  pets: number;
  budgetRange: [number, number];
  name: string;
  phone: string;
  email: string;
  agreeToContact: boolean;
};

type ChatMsg = { role: "user" | "ai"; text: string; id: string };

type ApiProperty = {
  id: number;
  name: string;
  location: string;
  city: string;
  state: string;
  image: string;
  min_price: number;
  rating: string;
  reviews_count: number;
  bedrooms: number;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const EXPERIENCE_FILTERS = [
  { id: "mountain", icon: "⛰️", label: "Mountains" },
  { id: "beach", icon: "🏖️", label: "Beaches" },
  { id: "forest", icon: "🌲", label: "Forests" },
  { id: "valley", icon: "🏞️", label: "Valleys" },
  { id: "wildlife", icon: "🦁", label: "Wildlife" },
  { id: "heritage", icon: "🏛️", label: "Heritage" },
  { id: "wellness", icon: "🧘", label: "Wellness" },
  { id: "adventure", icon: "🧗", label: "Adventure" },
  { id: "village", icon: "🏡", label: "Village Life" },
  { id: "rural", icon: "🌾", label: "Rural" },
];

const TRIP_TYPES = [
  { id: "solo", icon: "🧍", label: "Solo", desc: "Just me" },
  { id: "couple", icon: "💑", label: "Couple", desc: "Romantic escape" },
  { id: "family", icon: "👨‍👩‍👧‍👦", label: "Family", desc: "With the kids" },
  { id: "friends", icon: "👫", label: "Friends", desc: "Group adventure" },
] as const;

const BUDGET_PRESETS = [
  { label: "Budget", range: [500, 2000] as [number, number], emoji: "💚" },
  { label: "Mid-range", range: [2000, 6000] as [number, number], emoji: "💙" },
  { label: "Premium", range: [6000, 12000] as [number, number], emoji: "💜" },
  { label: "Luxury", range: [12000, 25000] as [number, number], emoji: "🌟" },
];

const STEPS = [
  { id: "destination", title: "Where to?", icon: MapPin },
  { id: "dates", title: "When?", icon: CalendarDays },
  { id: "group", title: "Who's coming?", icon: Users },
  { id: "budget", title: "Your Budget", icon: Wallet },
  { id: "details", title: "Your Details", icon: User },
];

const SUGGESTED_QUESTIONS = [
  "Best time to visit Himachal?",
  "Romantic stays under ₹5,000/night?",
  "Family-friendly stays in Coorg?",
  "Adventure stays near Mumbai?",
];

function resolveImg(src: string | null | undefined): string {
  if (!src) return "/images/place.jpg";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${STORAGE_BASE}/${src.replace(/^\//, "")}`;
}

const defaultPlan: TripPlan = {
  state: "",
  experiences: [],
  dateRange: undefined,
  tripType: "",
  adults: 2,
  children: 0,
  infants: 0,
  pets: 0,
  budgetRange: [2000, 8000],
  name: "",
  phone: "",
  email: "",
  agreeToContact: false,
};

// ─── Dark Calendar ───────────────────────────────────────────────────────────

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function DarkCalendar({
  selected,
  onSelect,
}: {
  selected: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
}) {
  const today = startOfDay(new Date());
  const [month, setMonth] = useState(startOfMonth(today));
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(month);
  const totalDays = getDaysInMonth(month);
  const startPad = getDay(monthStart);

  const days: (Date | null)[] = [
    ...Array(startPad).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => addDays(monthStart, i)),
  ];
  while (days.length % 7 !== 0) days.push(null);

  const handleClick = (day: Date) => {
    if (isBefore(day, today)) return;
    if (!selected?.from || (selected.from && selected.to)) {
      onSelect({ from: day, to: undefined });
    } else {
      if (isSameDay(day, selected.from)) {
        onSelect(undefined);
      } else if (isBefore(day, selected.from)) {
        onSelect({ from: day, to: selected.from });
      } else {
        onSelect({ from: selected.from, to: day });
      }
    }
  };

  const effectiveTo =
    selected?.to ??
    (hoverDate && selected?.from && !selected.to ? hoverDate : null);

  const getRangePos = (day: Date) => {
    const from = selected?.from;
    const to = effectiveTo;
    if (!from) return null;
    const [lo, hi] =
      to && isBefore(from, to) ? [from, to] : to ? [to, from] : [from, null];
    if (isSameDay(day, lo)) return "start";
    if (hi && isSameDay(day, hi)) return "end";
    if (hi && isAfter(day, lo) && isBefore(day, hi)) return "mid";
    return null;
  };

  return (
    <div className="w-full select-none" style={{ padding: "1.25rem 1rem" }}>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => setMonth((m) => subMonths(m, 1))}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.5)",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
          }
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-bold text-white tracking-wide">
          {format(month, "MMMM yyyy")}
        </span>
        <button
          onClick={() => setMonth((m) => addMonths(m, 1))}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.5)",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
          }
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-3">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-black uppercase tracking-widest py-1"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          if (!day) return <div key={`e${i}`} className="aspect-square" />;

          const disabled = isBefore(day, today);
          const isToday = isSameDay(day, today);
          const pos = getRangePos(day);
          const isSelected = pos === "start" || pos === "end";
          const isMid = pos === "mid";

          return (
            <div
              key={format(day, "yyyy-MM-dd")}
              className="relative flex items-center justify-center"
              style={{
                background: isMid ? "rgba(249,86,34,0.12)" : "transparent",
                borderRadius:
                  pos === "start"
                    ? "10px 0 0 10px"
                    : pos === "end"
                      ? "0 10px 10px 0"
                      : "0",
                padding: "2px 0",
              }}
              onMouseEnter={() => !disabled && setHoverDate(day)}
              onMouseLeave={() => setHoverDate(null)}
            >
              <button
                onClick={() => !disabled && handleClick(day)}
                disabled={disabled}
                className="aspect-square w-full flex items-center justify-center text-sm rounded-xl transition-all"
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg, #FECB19 0%, #F95622 100%)"
                    : isToday && !isSelected
                      ? "rgba(249,86,34,0.15)"
                      : "transparent",
                  color: isSelected
                    ? "#0A0A0A"
                    : disabled
                      ? "rgba(255,255,255,0.12)"
                      : isToday
                        ? "#F95622"
                        : isMid
                          ? "#FECB19"
                          : "rgba(255,255,255,0.75)",
                  fontWeight: isSelected ? 800 : isToday ? 700 : 400,
                  cursor: disabled ? "not-allowed" : "pointer",
                  boxShadow: isSelected
                    ? "0 2px 10px rgba(249,86,34,0.35)"
                    : "none",
                  transform: isSelected ? "scale(0.95)" : "none",
                }}
              >
                {getDate(day)}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Reusable Counter ────────────────────────────────────────────────────────

function Counter({
  label,
  sub,
  value,
  onChange,
  min = 0,
  max = 20,
}: {
  label: string;
  sub: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div
      className="flex items-center justify-between py-3.5"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-30 hover:bg-white/10"
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.8)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Minus size={13} />
        </button>
        <span className="text-white font-bold w-5 text-center tabular-nums">
          {value}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-30 hover:bg-white/10"
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.8)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 1 ──────────────────────────────────────────────────────────────────

function Step1Destination({
  plan,
  setPlan,
  states,
}: {
  plan: TripPlan;
  setPlan: React.Dispatch<React.SetStateAction<TripPlan>>;
  states: { id: number; name: string }[];
}) {
  const toggleExp = (id: string) =>
    setPlan((p) => ({
      ...p,
      experiences: p.experiences.includes(id)
        ? p.experiences.filter((e) => e !== id)
        : [...p.experiences, id],
    }));

  return (
    <div>
      <span
        className="inline-block text-xs font-black uppercase tracking-widest mb-2 px-2.5 py-1 rounded-full"
        style={{ background: "rgba(249,86,34,0.08)", color: "#F95622" }}
      >
        Step 1 of 5
      </span>
      <h2 className="text-2xl font-black text-white mb-1">
        Where do you want to go? 🗺️
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Pick a state and the kind of experience you&apos;re after
      </p>

      <div className="mb-5">
        <label className="block text-xs font-semibold text-gray-400 mb-2">
          Destination State{" "}
          <span className="text-gray-600 font-normal">(optional)</span>
        </label>
        <Select
          value={plan.state || "__all__"}
          onValueChange={(v) =>
            setPlan((p) => ({ ...p, state: v === "__all__" ? "" : (v ?? "") }))
          }
        >
          <SelectTrigger
            className="w-full rounded-xl h-11 text-sm font-semibold"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: plan.state ? "#ffffff" : "rgba(255,255,255,0.3)",
            }}
          >
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: "#FECB19", flexShrink: 0 }} />
              <SelectValue placeholder="Any State" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="__all__">Any State</SelectItem>
            {states.map((s) => (
              <SelectItem key={s.id} value={s.name}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-3">
          What kind of experience? <span style={{ color: "#F95622" }}>*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {EXPERIENCE_FILTERS.map((exp) => {
            const selected = plan.experiences.includes(exp.id);
            return (
              <button
                key={exp.id}
                onClick={() => toggleExp(exp.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: selected
                    ? "linear-gradient(135deg, #FECB19, #F95622)"
                    : "rgba(255,255,255,0.06)",
                  color: selected ? "#0A0A0A" : "rgba(255,255,255,0.65)",
                  border: selected ? "none" : "1px solid rgba(255,255,255,0.1)",
                  transform: selected ? "scale(1.03)" : "none",
                  boxShadow: selected
                    ? "0 2px 8px rgba(249,86,34,0.2)"
                    : "none",
                }}
              >
                {exp.icon} {exp.label}
              </button>
            );
          })}
        </div>
        {plan.experiences.length === 0 && (
          <p className="text-[11px] mt-2 text-gray-600">
            Select at least one to continue
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Step 2 ──────────────────────────────────────────────────────────────────

function Step2Dates({
  plan,
  setPlan,
}: {
  plan: TripPlan;
  setPlan: React.Dispatch<React.SetStateAction<TripPlan>>;
}) {
  const nights =
    plan.dateRange?.from && plan.dateRange?.to
      ? Math.round(
          (plan.dateRange.to.getTime() - plan.dateRange.from.getTime()) /
            86_400_000,
        )
      : 0;

  return (
    <div>
      <span
        className="inline-block text-xs font-black uppercase tracking-widest mb-2 px-2.5 py-1 rounded-full"
        style={{ background: "rgba(249,86,34,0.08)", color: "#F95622" }}
      >
        Step 2 of 5
      </span>
      <h2 className="text-2xl font-black text-white mb-1">
        When are you travelling? 📅
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Select your check-in and check-out dates
      </p>

      {nights > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{
            background: "rgba(254,203,25,0.1)",
            border: "1px solid rgba(254,203,25,0.4)",
            color: "#FECB19",
          }}
        >
          <Check size={14} style={{ color: "#F95622" }} />
          {format(plan.dateRange!.from!, "dd MMM")} →{" "}
          {format(plan.dateRange!.to!, "dd MMM yyyy")}
          &nbsp;·&nbsp;
          {nights} night{nights !== 1 ? "s" : ""}
        </motion.div>
      )}

      <div
        className="w-full rounded-2xl overflow-hidden"
        style={{
          background: "#111111",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        }}
      >
        <DarkCalendar
          selected={plan.dateRange}
          onSelect={(range) => setPlan((p) => ({ ...p, dateRange: range }))}
        />
      </div>
    </div>
  );
}

// ─── Step 3 ──────────────────────────────────────────────────────────────────

function Step3Group({
  plan,
  setPlan,
}: {
  plan: TripPlan;
  setPlan: React.Dispatch<React.SetStateAction<TripPlan>>;
}) {
  return (
    <div>
      <span
        className="inline-block text-xs font-black uppercase tracking-widest mb-2 px-2.5 py-1 rounded-full"
        style={{ background: "rgba(249,86,34,0.08)", color: "#F95622" }}
      >
        Step 3 of 5
      </span>
      <h2 className="text-2xl font-black text-white mb-1">
        Who&apos;s joining? 👥
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Tell us about your travel group
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {TRIP_TYPES.map((t) => {
          const selected = plan.tripType === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setPlan((p) => ({ ...p, tripType: t.id }))}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all"
              style={{
                background: selected
                  ? "linear-gradient(135deg, rgba(254,203,25,0.15), rgba(249,86,34,0.1))"
                  : "rgba(255,255,255,0.05)",
                border: selected
                  ? "2px solid #FECB19"
                  : "1px solid rgba(255,255,255,0.08)",
                transform: selected ? "scale(1.02)" : "none",
                boxShadow: selected
                  ? "0 2px 12px rgba(254,203,25,0.2)"
                  : "none",
              }}
            >
              <span className="text-3xl">{t.icon}</span>
              <span className="text-sm font-bold text-white">{t.label}</span>
              <span className="text-xs text-gray-500">{t.desc}</span>
            </button>
          );
        })}
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="px-4 [&>div:last-child]:border-0">
          <Counter
            label="Adults"
            sub="Ages 13 or above"
            value={plan.adults}
            onChange={(v) => setPlan((p) => ({ ...p, adults: v }))}
            min={1}
          />
          <Counter
            label="Children"
            sub="Ages 2–12"
            value={plan.children}
            onChange={(v) => setPlan((p) => ({ ...p, children: v }))}
          />
          <Counter
            label="Infants"
            sub="Under 2 years"
            value={plan.infants}
            onChange={(v) => setPlan((p) => ({ ...p, infants: v }))}
          />
          <Counter
            label="Pets"
            sub="Bringing a furry friend?"
            value={plan.pets}
            onChange={(v) => setPlan((p) => ({ ...p, pets: v }))}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Step 4 ──────────────────────────────────────────────────────────────────

function Step4Budget({
  plan,
  setPlan,
}: {
  plan: TripPlan;
  setPlan: React.Dispatch<React.SetStateAction<TripPlan>>;
}) {
  const [min, max] = plan.budgetRange;
  const activePreset = BUDGET_PRESETS.find(
    (p) => p.range[0] === min && p.range[1] === max,
  );

  return (
    <div>
      <span
        className="inline-block text-xs font-black uppercase tracking-widest mb-2 px-2.5 py-1 rounded-full"
        style={{ background: "rgba(249,86,34,0.08)", color: "#F95622" }}
      >
        Step 4 of 5
      </span>
      <h2 className="text-2xl font-black text-white mb-1">
        What&apos;s your budget? 💰
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Per night, per room — we&apos;ll find stays that match
      </p>

      <div className="flex gap-2 flex-wrap mb-6">
        {BUDGET_PRESETS.map((p) => {
          const active = activePreset?.label === p.label;
          return (
            <button
              key={p.label}
              onClick={() =>
                setPlan((prev) => ({ ...prev, budgetRange: p.range }))
              }
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background: active
                  ? "linear-gradient(135deg, #FECB19, #F95622)"
                  : "rgba(255,255,255,0.08)",
                color: active ? "#0A0A0A" : "rgba(255,255,255,0.6)",
                border: active ? "none" : "1px solid rgba(255,255,255,0.1)",
                boxShadow: active ? "0 2px 8px rgba(249,86,34,0.25)" : "none",
              }}
            >
              {p.emoji} {p.label}
            </button>
          );
        })}
      </div>

      <div
        className="text-center mb-5 py-4 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <p className="text-3xl font-black text-white">
          ₹{min.toLocaleString("en-IN")}{" "}
          <span className="text-white/20">—</span> ₹
          {max.toLocaleString("en-IN")}
        </p>
        <p className="text-xs mt-1 text-gray-500">per night</p>
      </div>

      <div className="px-2">
        <Slider
          value={[min, max]}
          min={500}
          max={25000}
          step={500}
          onValueChange={(vals: number | readonly number[]) => {
            const arr = Array.isArray(vals)
              ? (vals as number[])
              : [vals as number];
            if (arr.length === 2) {
              setPlan((p) => ({ ...p, budgetRange: [arr[0], arr[1]] }));
            }
          }}
          className="**:data-[slot=slider-track]:bg-white/15 **:data-[slot=slider-range]:bg-linear-to-r **:data-[slot=slider-range]:from-yellow-400 **:data-[slot=slider-range]:to-orange-500 **:data-[slot=slider-thumb]:border-orange-400 **:data-[slot=slider-thumb]:bg-white **:data-[slot=slider-thumb]:shadow-md"
        />
        <div className="flex justify-between mt-2 text-[11px] text-gray-500">
          <span>₹500</span>
          <span>₹25,000+</span>
        </div>
      </div>
    </div>
  );
}

// ─── Step 5 ──────────────────────────────────────────────────────────────────

function Step5Details({
  plan,
  setPlan,
  submitting,
  submitError,
  onSubmit,
}: {
  plan: TripPlan;
  setPlan: React.Dispatch<React.SetStateAction<TripPlan>>;
  submitting: boolean;
  submitError: string;
  onSubmit: () => void;
}) {
  const nights =
    plan.dateRange?.from && plan.dateRange?.to
      ? Math.round(
          (plan.dateRange.to.getTime() - plan.dateRange.from.getTime()) /
            86_400_000,
        )
      : 0;

  const groupParts = [
    `${plan.adults} adult${plan.adults !== 1 ? "s" : ""}`,
    plan.children
      ? `${plan.children} child${plan.children !== 1 ? "ren" : ""}`
      : "",
    plan.infants
      ? `${plan.infants} infant${plan.infants !== 1 ? "s" : ""}`
      : "",
    plan.pets ? `${plan.pets} pet${plan.pets !== 1 ? "s" : ""}` : "",
  ]
    .filter(Boolean)
    .join(", ");

  const summaryItems = [
    plan.state && { label: "Destination", value: plan.state },
    plan.experiences.length > 0 && {
      label: "Experience",
      value: plan.experiences
        .map((e) => EXPERIENCE_FILTERS.find((f) => f.id === e)?.label)
        .filter(Boolean)
        .join(", "),
    },
    plan.dateRange?.from && {
      label: "Dates",
      value: `${format(plan.dateRange.from, "dd MMM")} → ${plan.dateRange.to ? format(plan.dateRange.to, "dd MMM yyyy") : "?"} ${nights > 0 ? `(${nights}N)` : ""}`,
    },
    plan.tripType && {
      label: "Group",
      value: `${plan.tripType.charAt(0).toUpperCase() + plan.tripType.slice(1)} · ${groupParts}`,
    },
    {
      label: "Budget",
      value: `₹${plan.budgetRange[0].toLocaleString("en-IN")} – ₹${plan.budgetRange[1].toLocaleString("en-IN")}/night`,
    },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div>
      <span
        className="inline-block text-xs font-black uppercase tracking-widest mb-2 px-2.5 py-1 rounded-full"
        style={{ background: "rgba(249,86,34,0.08)", color: "#F95622" }}
      >
        Step 5 of 5
      </span>
      <h2 className="text-2xl font-black text-white mb-1">Almost there! ✨</h2>
      <p className="text-sm text-gray-500 mb-5">
        Our travel expert will call you to finalise your perfect trip
      </p>

      {/* Trip summary */}
      <div
        className="rounded-2xl p-4 mb-5"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <p
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Your Trip Summary
        </p>
        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
          {summaryItems.map((item) => (
            <div key={item.label}>
              <p className="text-[10px] uppercase tracking-wider text-gray-500">
                {item.label}
              </p>
              <p className="text-xs font-semibold text-white mt-0.5">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact fields */}
      <div className="space-y-3 mb-5">
        {[
          {
            icon: User,
            field: "name" as const,
            label: "Full Name *",
            placeholder: "Your full name",
            type: "text",
          },
          {
            icon: Phone,
            field: "phone" as const,
            label: "Phone Number *",
            placeholder: "+91 98765 43210",
            type: "tel",
          },
          {
            icon: Mail,
            field: "email" as const,
            label: "Email Address (Optional)",
            placeholder: "you@example.com",
            type: "email",
          },
        ].map(({ icon: Icon, field, label, placeholder, type }) => (
          <div key={field}>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">
              {label}
            </label>
            <div
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Icon size={14} style={{ color: "#FECB19", flexShrink: 0 }} />
              <input
                type={type}
                value={plan[field]}
                onChange={(e) =>
                  setPlan((p) => ({ ...p, [field]: e.target.value }))
                }
                placeholder={placeholder}
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Agree checkbox */}
      <label className="flex items-start gap-3 cursor-pointer mb-5">
        <div
          onClick={() =>
            setPlan((p) => ({ ...p, agreeToContact: !p.agreeToContact }))
          }
          className="w-5 h-5 rounded-md flex items-center justify-center mt-0.5 shrink-0 transition-all cursor-pointer"
          style={{
            background: plan.agreeToContact
              ? "linear-gradient(135deg, #FECB19, #F95622)"
              : "rgba(255,255,255,0.08)",
            border: plan.agreeToContact
              ? "none"
              : "1px solid rgba(255,255,255,0.15)",
          }}
        >
          {plan.agreeToContact && (
            <Check size={11} style={{ color: "#0A0A0A" }} />
          )}
        </div>
        <span className="text-xs leading-relaxed text-gray-400">
          I agree to be contacted by a Bayaroo travel expert to finalise my
          trip. No spam, ever.
        </span>
      </label>

      {submitError && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-xl mb-4">
          {submitError}
        </p>
      )}

      <button
        onClick={onSubmit}
        disabled={
          submitting ||
          !plan.name.trim() ||
          !plan.phone.trim() ||
          !plan.agreeToContact
        }
        className="w-full py-3.5 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 disabled:opacity-40"
        style={{
          background: "linear-gradient(135deg, #FECB19, #F95622)",
          color: "#0A0A0A",
          boxShadow: "0 6px 24px rgba(249,86,34,0.25)",
        }}
      >
        {submitting ? (
          <>
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Sparkles size={16} /> Find My Perfect Stay
          </>
        )}
      </button>
    </div>
  );
}

// ─── Success Page ─────────────────────────────────────────────────────────────

function SmallPropertyCard({ property }: { property: ApiProperty }) {
  const rating = parseFloat(property.rating ?? "0");
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        border: "1px solid #efefef",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
      onClick={() => window.open(`/listing/${property.id}`, "_blank")}
    >
      <div className="relative h-40 overflow-hidden">
        <Image
          src={resolveImg(property.image)}
          alt={property.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="320px"
          unoptimized
        />
      </div>
      <div className="p-3.5">
        <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">
          {property.name}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
          <MapPin size={10} />
          {property.city}, {property.state}
        </p>
        <div className="flex items-center justify-between mt-2.5">
          <div>
            <span className="text-sm font-black text-gray-900">
              ₹{property.min_price.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-gray-400">/night</span>
          </div>
          {rating > 0 && (
            <div className="flex items-center gap-1 text-xs font-semibold text-gray-600">
              <Star size={11} fill="#FECB19" stroke="none" />
              {rating.toFixed(1)}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SuccessPage({
  plan,
  matchingProps,
}: {
  plan: TripPlan;
  matchingProps: ApiProperty[];
}) {
  const nights =
    plan.dateRange?.from && plan.dateRange?.to
      ? Math.round(
          (plan.dateRange.to.getTime() - plan.dateRange.from.getTime()) /
            86_400_000,
        )
      : 0;

  const groupParts = [
    `${plan.adults} adult${plan.adults !== 1 ? "s" : ""}`,
    plan.children
      ? `${plan.children} child${plan.children !== 1 ? "ren" : ""}`
      : "",
    plan.infants
      ? `${plan.infants} infant${plan.infants !== 1 ? "s" : ""}`
      : "",
    plan.pets ? `${plan.pets} pet${plan.pets !== 1 ? "s" : ""}` : "",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <Navbar forceDark />
      <div style={{ background: "#F8F7F4" }} className="min-h-screen">
        <div
          className="py-28 px-4 text-center"
          style={{
            background:
              "linear-gradient(160deg, #0A0A0A 0%, #1a0a00 60%, #0A0A0A 100%)",
          }}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl md:text-4xl font-black text-white">
              Your Trip Plan is Submitted!
            </h1>
            <p
              className="mt-2 text-sm"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Our travel expert will call you at{" "}
              <strong style={{ color: "#FECB19" }}>{plan.phone}</strong> within
              24 hours to finalise your trip.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="max-w-lg mx-auto mt-8 rounded-2xl p-5 text-left"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Trip Summary
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {plan.state && (
                <div>
                  <span
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    Destination
                  </span>
                  <p className="font-bold text-white">{plan.state}</p>
                </div>
              )}
              {plan.dateRange?.from && (
                <div>
                  <span
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    Dates
                  </span>
                  <p className="font-bold text-white">
                    {format(plan.dateRange.from, "dd MMM")} –{" "}
                    {plan.dateRange.to
                      ? format(plan.dateRange.to, "dd MMM yyyy")
                      : "TBD"}
                    {nights > 0 && ` (${nights}N)`}
                  </p>
                </div>
              )}
              {plan.tripType && (
                <div>
                  <span
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    Group
                  </span>
                  <p className="font-bold text-white capitalize">
                    {plan.tripType} · {groupParts}
                  </p>
                </div>
              )}
              <div>
                <span
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  Budget
                </span>
                <p className="font-bold text-white">
                  ₹{plan.budgetRange[0].toLocaleString("en-IN")} – ₹
                  {plan.budgetRange[1].toLocaleString("en-IN")}/night
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 flex items-center justify-center gap-3"
          >
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              Back to Home
            </Link>
            <Link
              href="/explore"
              className="px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5"
              style={{
                background: "linear-gradient(135deg, #FECB19, #F95622)",
                color: "#0A0A0A",
              }}
            >
              Explore All Stays <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        {matchingProps.length > 0 && (
          <div className="container max-w-5xl mx-auto px-4 py-14">
            <div className="mb-7">
              <h2 className="text-2xl font-black text-gray-900">
                Curated Stays For You ✨
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Based on your preferences — your agent will refine these further
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchingProps.map((prop, i) => (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <SmallPropertyCard property={prop} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AITripPlannerPage() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [plan, setPlan] = useState<TripPlan>(defaultPlan);
  const [states, setStates] = useState<{ id: number; name: string }[]>([]);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [matchingProps, setMatchingProps] = useState<ApiProperty[]>([]);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [ccReady, setCcReady] = useState(false);
  const ccRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const convIdRef = useRef<string>(
    `web_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  );

  useEffect(() => {
    fetch(`${API_BASE}/states`)
      .then((r) => r.json())
      .then((d) => setStates(d.states ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!CC_ENABLED) return;
    import("@cometchat/chat-sdk-javascript")
      .then((mod) => {
        const CometChat = mod.CometChat;
        ccRef.current = CometChat;
        const appSetting = new CometChat.AppSettingsBuilder()
          .subscribePresenceForAllUsers()
          .setRegion(CC_REGION)
          .autoEstablishSocketConnection(true)
          .build();
        CometChat.init(CC_APP_ID, appSetting).then(() => {
          const stored =
            typeof localStorage !== "undefined"
              ? localStorage.getItem("bayaroo_cc_uid")
              : null;
          const uid =
            stored ??
            `guest_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
          if (!stored && typeof localStorage !== "undefined")
            localStorage.setItem("bayaroo_cc_uid", uid);

          const tryLogin = () =>
            CometChat.login(uid, CC_AUTH_KEY).then(() => {
              setCcReady(true);
              CometChat.addMessageListener(
                "trip_planner",
                new CometChat.MessageListener({
                  onTextMessageReceived: (msg: any) => {
                    // Accept message from the bot (any sender that isn't the current user)
                    const botUid = CC_BOT_UID.toLowerCase();
                    const senderUid = (msg.sender?.uid ?? "").toLowerCase();
                    if (
                      !botUid ||
                      senderUid === botUid ||
                      senderUid.includes("bot")
                    ) {
                      if (chatTimeoutRef.current) {
                        clearTimeout(chatTimeoutRef.current);
                        chatTimeoutRef.current = null;
                      }
                      const text = msg.text ?? msg.data?.text ?? "";
                      if (text) {
                        setChatMessages((prev) => [
                          ...prev,
                          { role: "ai", text, id: String(msg.id) },
                        ]);
                        setChatLoading(false);
                      }
                    }
                  },
                }),
              );
            });

          tryLogin().catch(() => {
            const user = new CometChat.User(uid);
            user.setName("Bayaroo Trip Planner Guest");
            CometChat.createUser(user, CC_AUTH_KEY)
              .then(tryLogin)
              .catch(console.error);
          });
        });
      })
      .catch(console.error);
    return () => {
      ccRef.current?.removeMessageListener?.("trip_planner");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const buildContextPrefix = () => {
    const parts: string[] = [];
    if (plan.state) parts.push(`Going to: ${plan.state}`);
    if (plan.experiences.length)
      parts.push(`Experiences: ${plan.experiences.join(", ")}`);
    if (plan.dateRange?.from)
      parts.push(
        `Dates: ${format(plan.dateRange.from, "dd MMM")}${plan.dateRange.to ? ` - ${format(plan.dateRange.to, "dd MMM yyyy")}` : ""}`,
      );
    if (plan.tripType)
      parts.push(
        `Group: ${plan.tripType}, ${plan.adults}A${plan.children ? `, ${plan.children}C` : ""}${plan.infants ? `, ${plan.infants}I` : ""}${plan.pets ? `, ${plan.pets}P` : ""}`,
      );
    parts.push(
      `Budget: ₹${plan.budgetRange[0].toLocaleString("en-IN")} - ₹${plan.budgetRange[1].toLocaleString("en-IN")}/night`,
    );
    return parts.join(" | ");
  };

  const sendChatMessage = async (text: string) => {
    if (!text.trim() || chatLoading) return;
    const userMsg: ChatMsg = { role: "user", text, id: `u_${Date.now()}` };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    if (ccReady && ccRef.current) {
      try {
        const CometChat = ccRef.current;
        const contextPrefix = buildContextPrefix();
        const fullText = contextPrefix
          ? `[Trip Context: ${contextPrefix}] ${text}`
          : text;
        const message = new CometChat.TextMessage(
          CC_BOT_UID,
          fullText,
          CometChat.RECEIVER_TYPE.USER,
        );
        await CometChat.sendMessage(message);
        // Timeout fallback: if bot doesn't respond in 20s, show error
        chatTimeoutRef.current = setTimeout(() => {
          setChatLoading((prev) => {
            if (prev) {
              setChatMessages((msgs) => [
                ...msgs,
                {
                  role: "ai",
                  text: "I couldn't get a response right now. Our travel team will help you when you submit your trip!",
                  id: `ai_timeout_${Date.now()}`,
                },
              ]);
            }
            return false;
          });
          chatTimeoutRef.current = null;
        }, 20000);
        return;
      } catch (err) {
        console.error("CometChat send error:", err);
      }
    }

    try {
      const res = await fetch(`${API_BASE}/ai/package/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversation_id: convIdRef.current,
          context: { package_data: buildBackendContext() },
        }),
      });
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            data.message ??
            "I'm here to help plan your trip! What would you like to know?",
          id: `ai_${Date.now()}`,
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "I'm having trouble right now. Our team will help you finalise via call!",
          id: `ai_${Date.now()}`,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const buildBackendContext = () => ({
    destination: plan.state || undefined,
    experienceTypes: plan.experiences,
    startDate: plan.dateRange?.from
      ? format(plan.dateRange.from, "yyyy-MM-dd")
      : undefined,
    endDate: plan.dateRange?.to
      ? format(plan.dateRange.to, "yyyy-MM-dd")
      : undefined,
    tripType: plan.tripType || undefined,
    adults: plan.adults,
    children: plan.children,
    infants: plan.infants,
    pets: plan.pets,
    budgetMin: plan.budgetRange[0],
    budgetMax: plan.budgetRange[1],
  });

  const canProceed = () => {
    switch (step) {
      case 0:
        return plan.experiences.length > 0;
      case 1:
        return !!(plan.dateRange?.from && plan.dateRange?.to);
      case 2:
        return !!plan.tripType;
      case 3:
        return plan.budgetRange[0] < plan.budgetRange[1];
      case 4:
        return !!(plan.name.trim() && plan.phone.trim() && plan.agreeToContact);
      default:
        return false;
    }
  };

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 4));
  };
  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const payload = {
        conversation_id: convIdRef.current,
        contact_name: plan.name,
        contact_phone: plan.phone,
        contact_email: plan.email || undefined,
        experience_types: plan.experiences,
        package_data: {
          destination: plan.state || undefined,
          experienceTypes: plan.experiences,
          tripType: plan.tripType,
          startDate: plan.dateRange?.from
            ? format(plan.dateRange.from, "yyyy-MM-dd")
            : undefined,
          endDate: plan.dateRange?.to
            ? format(plan.dateRange.to, "yyyy-MM-dd")
            : undefined,
          adults: plan.adults,
          children: plan.children,
          infants: plan.infants,
          pets: plan.pets,
          budgetMin: plan.budgetRange[0],
          budgetMax: plan.budgetRange[1],
          budgetCategory:
            BUDGET_PRESETS.find(
              (p) =>
                p.range[0] === plan.budgetRange[0] &&
                p.range[1] === plan.budgetRange[1],
            )?.label ?? "Custom",
        },
        conversation_history: chatMessages.map((m) => ({
          role: m.role,
          text: m.text,
        })),
      };

      const res = await fetch(`${API_BASE}/package-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Submission failed");
      }

      const params = new URLSearchParams();
      if (plan.state) params.set("state", plan.state);
      plan.experiences.forEach((e) => params.append("experience_types[]", e));
      params.set("per_page", "6");
      fetch(`${API_BASE}/properties?${params}`)
        .then((r) => r.json())
        .then((d) => setMatchingProps(d.data ?? []))
        .catch(() => {});

      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return <SuccessPage plan={plan} matchingProps={matchingProps} />;
  }

  return (
    <>
      <Navbar forceDark />

      <main
        className="min-h-screen flex flex-col relative"
        style={{ background: "#0A0A0A" }}
      >
        {/* Subtle top glow */}
        <div className="absolute inset-x-0 top-0 h-80 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-175 h-80 rounded-full opacity-25"
            style={{
              background:
                "radial-gradient(ellipse, #FECB19 0%, transparent 65%)",
              filter: "blur(70px)",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center pt-28 pb-24 px-4 flex-1">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles size={15} style={{ color: "#F95622" }} />
              <span
                className="text-xs font-black uppercase tracking-[0.2em]"
                style={{ color: "#F95622" }}
              >
                AI Trip Planner
              </span>
              <Sparkles size={15} style={{ color: "#F95622" }} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Plan Your Perfect
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #FECB19, #F95622)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Travel Experience
              </span>
            </h1>
            <p className="text-gray-500 text-sm mt-3 max-w-sm mx-auto leading-relaxed">
              Answer a few quick questions and our expert agent will craft your
              dream trip
            </p>
          </motion.div>

          {/* Step indicator */}
          <div className="flex items-center gap-1.5 mb-6">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    if (i < step) {
                      setDirection(-1);
                      setStep(i);
                    }
                  }}
                  className="flex items-center justify-center w-9 h-9 rounded-full text-xs font-black transition-all"
                  style={{
                    background:
                      i < step
                        ? "linear-gradient(135deg, #FECB19, #F95622)"
                        : i === step
                          ? "rgba(254,203,25,0.15)"
                          : "rgba(255,255,255,0.08)",
                    color:
                      i < step
                        ? "#0A0A0A"
                        : i === step
                          ? "#FECB19"
                          : "rgba(255,255,255,0.25)",
                    border: i === step ? "2px solid #FECB19" : "none",
                    cursor: i < step ? "pointer" : "default",
                    boxShadow:
                      i === step
                        ? "0 0 0 4px rgba(254,203,25,0.12)"
                        : i < step
                          ? "0 2px 8px rgba(249,86,34,0.3)"
                          : "none",
                  }}
                >
                  {i < step ? <Check size={14} /> : i + 1}
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className="w-5 h-0.5 rounded-full transition-all"
                    style={{
                      background:
                        i < step
                          ? "linear-gradient(90deg, #FECB19, #F95622)"
                          : "rgba(255,255,255,0.1)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step label */}
          <p className="text-xs font-semibold text-gray-500 mb-5 -mt-2 tracking-wide">
            {STEPS[step].title}
          </p>

          {/* Wizard card */}
          <div className="w-full max-w-xl">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 40 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="rounded-3xl p-6 md:p-8"
                style={{
                  background: "#141414",
                  boxShadow:
                    "0 1px 0 rgba(255,255,255,0.05) inset, 0 8px 48px rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {step === 0 && (
                  <Step1Destination
                    plan={plan}
                    setPlan={setPlan}
                    states={states}
                  />
                )}
                {step === 1 && <Step2Dates plan={plan} setPlan={setPlan} />}
                {step === 2 && <Step3Group plan={plan} setPlan={setPlan} />}
                {step === 3 && <Step4Budget plan={plan} setPlan={setPlan} />}
                {step === 4 && (
                  <Step5Details
                    plan={plan}
                    setPlan={setPlan}
                    submitting={submitting}
                    submitError={submitError}
                    onSubmit={handleSubmit}
                  />
                )}

                {/* Navigation */}
                {step < 4 && (
                  <div
                    className="flex items-center justify-between mt-7 pt-5"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <button
                      onClick={goBack}
                      disabled={step === 0}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-0 text-gray-500 hover:text-white hover:bg-white/5"
                    >
                      <ChevronLeft size={16} /> Back
                    </button>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => setChatOpen(true)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
                        style={{
                          background: "rgba(249,86,34,0.06)",
                          color: "#F95622",
                          border: "1px solid rgba(249,86,34,0.15)",
                        }}
                      >
                        <Bot size={13} /> Ask AI
                      </button>
                      <button
                        onClick={goNext}
                        disabled={!canProceed()}
                        className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-black transition-all disabled:opacity-35"
                        style={{
                          background:
                            "linear-gradient(135deg, #FECB19, #F95622)",
                          color: "#0A0A0A",
                          boxShadow: canProceed()
                            ? "0 4px 16px rgba(249,86,34,0.3)"
                            : "none",
                        }}
                      >
                        Continue <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* ── Floating AI Chat ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              transition={{ duration: 0.22 }}
              className="w-80 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
              style={{
                height: "460px",
                background: "#111111",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div
                className="flex items-center justify-between px-4 py-3 shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: "linear-gradient(135deg, #FECB19, #F95622)",
                    }}
                  >
                    ✨
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">Bayaroo AI</p>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                      <p className="text-[10px] text-green-400">
                        Online · Trip Expert
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-white/30 hover:text-white/70 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {chatMessages.length === 0 && (
                  <div className="text-center mt-6">
                    <div className="text-4xl mb-2">✨</div>
                    <p
                      className="text-xs leading-relaxed mb-4"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      Hi! I&apos;m Bayaroo AI. Ask me anything about your trip
                      or destinations!
                    </p>
                    <div className="space-y-2">
                      {SUGGESTED_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => sendChatMessage(q)}
                          className="block w-full text-left text-xs px-3 py-2 rounded-xl transition-colors"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            color: "rgba(255,255,255,0.55)",
                            border: "1px solid rgba(255,255,255,0.07)",
                          }}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className="max-w-[85%] px-3 py-2 text-xs leading-relaxed"
                      style={{
                        background:
                          msg.role === "user"
                            ? "linear-gradient(135deg, #FECB19, #F95622)"
                            : "rgba(255,255,255,0.08)",
                        color:
                          msg.role === "user"
                            ? "#0A0A0A"
                            : "rgba(255,255,255,0.85)",
                        fontWeight: msg.role === "user" ? 600 : 400,
                        borderRadius:
                          msg.role === "user"
                            ? "1rem 1rem 0.25rem 1rem"
                            : "1rem 1rem 1rem 0.25rem",
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div
                      className="px-4 py-2.5"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        borderRadius: "1rem 1rem 1rem 0.25rem",
                      }}
                    >
                      <div className="flex gap-1.5 items-center">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: "rgba(255,255,255,0.4)" }}
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              duration: 0.55,
                              repeat: Infinity,
                              delay: i * 0.15,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div
                className="shrink-0 p-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && sendChatMessage(chatInput)
                    }
                    placeholder="Ask about destinations, stays…"
                    className="flex-1 bg-transparent text-xs outline-none"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                  />
                  <button
                    onClick={() => sendChatMessage(chatInput)}
                    disabled={!chatInput.trim() || chatLoading}
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-opacity disabled:opacity-30"
                    style={{
                      background: "linear-gradient(135deg, #FECB19, #F95622)",
                    }}
                  >
                    <Send size={11} style={{ color: "#0A0A0A" }} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setChatOpen((o) => !o)}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-black shadow-lg"
          style={{
            background: chatOpen
              ? "#1a1a1a"
              : "linear-gradient(135deg, #FECB19, #F95622)",
            color: chatOpen ? "#fff" : "#0A0A0A",
            boxShadow: chatOpen
              ? "0 4px 16px rgba(0,0,0,0.15)"
              : "0 6px 24px rgba(249,86,34,0.35)",
            border: chatOpen ? "1px solid rgba(255,255,255,0.1)" : "none",
          }}
        >
          {chatOpen ? <X size={16} /> : <MessageCircle size={16} />}
          {chatOpen ? "Close" : "Ask Bayaroo AI"}
        </motion.button>
      </div>

      <Footer />
    </>
  );
}
