"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { type DateRange } from "react-day-picker";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const today = new Date();

  const label = value?.from
    ? value.to
      ? `${format(value.from, "MMM d")} → ${format(value.to, "MMM d")}`
      : format(value.from, "MMM d")
    : "Dates";

  const openPanel = () => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setPos({
      top: r.bottom + window.scrollY + 8,
      left: r.left + window.scrollX,
    });
    setOpen(true);
  };

  const closeOnOutside = useCallback((e: MouseEvent) => {
    // Use composedPath() — the path is captured at event time, so even if
    // react-day-picker removes the clicked DOM node during re-render the path
    // still contains the original elements.
    const path = e.composedPath();
    const insidePanel = panelRef.current && path.includes(panelRef.current);
    const insideTrigger =
      triggerRef.current && path.includes(triggerRef.current);
    if (!insidePanel && !insideTrigger) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) document.addEventListener("mousedown", closeOnOutside);
    else document.removeEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, [open, closeOnOutside]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap"
        style={{
          background: open
            ? "rgba(255,255,255,0.25)"
            : "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: value?.from ? "#fff" : "rgba(255,255,255,0.55)",
        }}
      >
        <CalendarIcon size={14} style={{ color: "#FECB19", flexShrink: 0 }} />
        <span>{label}</span>
        {value?.from && (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(undefined);
            }}
            className="opacity-60 hover:opacity-100 flex items-center"
          >
            <X size={12} />
          </span>
        )}
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              zIndex: 99999,
            }}
          >
            <div
              className="rounded-2xl shadow-2xl overflow-hidden"
              style={{
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <Calendar
                mode="range"
                selected={value}
                onSelect={(range) => {
                  onChange(range);
                  if (range?.from && range?.to) setOpen(false);
                }}
                disabled={{ before: today }}
                numberOfMonths={2}
                defaultMonth={value?.from ?? today}
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
