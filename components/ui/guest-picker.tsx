"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Users, Minus, Plus, ChevronDown } from "lucide-react";

export interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface GuestPickerProps {
  value: GuestCounts;
  onChange: (v: GuestCounts) => void;
}

const ROWS: {
  key: keyof GuestCounts;
  label: string;
  sub: string;
  min: number;
  petPolicy?: boolean;
}[] = [
  { key: "adults", label: "Adult", sub: "18 years or above", min: 1 },
  { key: "children", label: "Child", sub: "2 – 12 years", min: 0 },
  { key: "infants", label: "Infant", sub: "2 years or under", min: 0 },
  { key: "pets", label: "Pets", sub: "", min: 0, petPolicy: true },
];

export function GuestPicker({ value, onChange }: GuestPickerProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const total = value.adults + value.children + value.infants + value.pets;
  const label =
    total === 1 ? "1 guest" : total > 1 ? `${total} guests` : "Guests";

  const openPanel = () => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setPos({
      top: r.bottom + window.scrollY + 8,
      left: r.left + window.scrollX,
      width: Math.max(r.width, 280),
    });
    setOpen(true);
  };

  const closeOnOutside = useCallback((e: MouseEvent) => {
    const path = e.composedPath();
    const insidePanel = panelRef.current && path.includes(panelRef.current);
    const insideTrigger =
      triggerRef.current && path.includes(triggerRef.current);
    if (!insidePanel && !insideTrigger) setOpen(false);
  }, []);

  useEffect(() => {
    if (open) document.addEventListener("mousedown", closeOnOutside);
    else document.removeEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, [open, closeOnOutside]);

  const adjust = (key: keyof GuestCounts, delta: number) => {
    const row = ROWS.find((r) => r.key === key)!;
    const next = Math.max(row.min, value[key] + delta);
    onChange({ ...value, [key]: next });
  };

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
          color: total > 0 ? "#fff" : "rgba(255,255,255,0.55)",
        }}
      >
        <Users size={14} style={{ color: "#FECB19", flexShrink: 0 }} />
        <span>{label}</span>
        <ChevronDown
          size={12}
          className="transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
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
              width: pos.width,
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
              <div className="px-5 pt-4 pb-1">
                <p className="text-sm font-black text-gray-900">
                  Select number of visitors
                </p>
              </div>
              {ROWS.map((row, i) => (
                <div
                  key={row.key}
                  className="flex items-center justify-between px-5 py-3"
                  style={{
                    borderTop: i > 0 ? "1px solid #f0f0f0" : undefined,
                  }}
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {row.label}
                    </p>
                    {row.petPolicy ? (
                      <a
                        href="#"
                        className="text-xs font-medium"
                        style={{ color: "#FECB19" }}
                        onClick={(e) => e.preventDefault()}
                      >
                        Read Pet Policy
                      </a>
                    ) : (
                      <p className="text-xs text-gray-400">{row.sub}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => adjust(row.key, -1)}
                      disabled={value[row.key] <= row.min}
                      className="w-8 h-8 rounded-full flex items-center justify-center border text-sm font-bold transition-colors"
                      style={{
                        borderColor:
                          value[row.key] <= row.min ? "#e5e7eb" : "#d1d5db",
                        color:
                          value[row.key] <= row.min ? "#d1d5db" : "#374151",
                        background: "#fff",
                      }}
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-black text-gray-900">
                      {value[row.key]}
                    </span>
                    <button
                      type="button"
                      onClick={() => adjust(row.key, 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center border text-sm font-bold transition-colors"
                      style={{
                        borderColor: "#d1d5db",
                        color: "#374151",
                        background: "#fff",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
              <div className="px-5 pt-2 pb-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-sm font-black underline"
                  style={{ color: "#0A0A0A" }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
