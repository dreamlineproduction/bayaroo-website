"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  {
    label: "Destinations",
    href: "/explore",
    children: [
      { label: "Browse All", href: "/explore" },
      { label: "Mountains", href: "/explore?type=mountain" },
      { label: "Beaches", href: "/explore?type=beach" },
      { label: "Forests", href: "/explore?type=forest" },
      { label: "Valleys", href: "/explore?type=valley" },
      { label: "Hills & Beaches", href: "/explore?type=hill-beach" },
      { label: "City Breaks", href: "/explore?type=city" },
      { label: "Villages", href: "/explore?type=village" },
      { label: "Heritage & Historical", href: "/explore?type=heritage" },
      { label: "Cultural & Rural", href: "/explore?type=rural" },
    ],
  },
  {
    label: "Packages",
    href: "/packages",
    children: [
      { label: "Weekend Getaways", href: "/packages?type=weekend" },
      { label: "Holiday Packages", href: "/packages" },
      { label: "Honeymoon Specials", href: "/packages?type=honeymoon" },
      { label: "Family Trips", href: "/packages?type=family" },
      { label: "Adventure Tours", href: "/packages?type=adventure" },
      { label: "Spiritual Journeys", href: "/packages?type=spiritual" },
      { label: "Historical Tours", href: "/packages?type=historical" },
    ],
  },
  {
    label: "Experiences",
    href: "/experiences",
    children: [
      { label: "Homestays & Farm Stays", href: "/explore?type=homestay" },
      { label: "Adventure & Treks", href: "/experiences?type=adventure" },
      { label: "Wildlife Safaris", href: "/experiences?type=wildlife" },
      { label: "Wellness Retreats", href: "/experiences?type=wellness" },
    ],
  },
  { label: "AI Trip Planner", href: "/explore#ai-planner" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar({ forceDark = false }: { forceDark?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDark = scrolled || forceDark;

  const textCls = isDark
    ? "text-gray-700 hover:text-gray-900"
    : "text-white/80 hover:text-white";
  const logoSrc = isDark ? "/logo-dark.svg" : "/logo-white.svg";

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-400"
      style={
        isDark
          ? {
              background: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(24px)",
              borderBottom: "1px solid rgba(0,0,0,0.07)",
              boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
            }
          : { background: "transparent" }
      }
    >
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src={isDark ? "/logo-color.svg" : "/logo.svg"}
              alt="Bayaroo"
              width={120}
              height={26}
              priority
              className="h-7 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1 text-sm font-semibold px-3 py-2 rounded-lg transition-colors ${textCls}`}
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${openDropdown === link.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {openDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-0 mt-1 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold px-3 py-2 rounded-lg transition-colors ${textCls}`}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/download"
              className="text-sm font-bold px-5 py-2.5 rounded-full transition-all"
              style={
                isDark
                  ? { border: "2px solid #0A0A0A", color: "#0A0A0A" }
                  : { border: "2px solid rgba(255,255,255,0.3)", color: "#fff" }
              }
            >
              Download App
            </Link>
            <Link
              href="/explore"
              className="btn-primary text-sm"
              style={{ padding: "0.625rem 1.5rem" }}
            >
              Login/Signup
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X size={22} color={isDark ? "#0A0A0A" : "#fff"} />
            ) : (
              <Menu size={22} color={isDark ? "#0A0A0A" : "#fff"} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <div className="container py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold text-gray-700 px-3 py-3 rounded-xl hover:bg-amber-50 hover:text-amber-700 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                <Link
                  href="/download"
                  onClick={() => setMenuOpen(false)}
                  className="btn-dark text-sm justify-center"
                >
                  Download App
                </Link>
                <Link
                  href="/explore"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary text-sm justify-center"
                >
                  Explore Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
