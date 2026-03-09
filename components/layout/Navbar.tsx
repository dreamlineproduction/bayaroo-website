"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  User,
  Settings,
  Heart,
  CalendarCheck,
  CreditCard,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface StoredUser {
  id: string | number;
  name?: string;
  email?: string;
  avatar_url?: string;
}

const userMenuItems = [
  { label: "My Profile", href: "/profile", icon: User },
  { label: "Profile Settings", href: "/profile/settings", icon: Settings },
  { label: "My Favorites", href: "/profile/favorites", icon: Heart },
  { label: "My Bookings", href: "/bookings", icon: CalendarCheck },
  { label: "Payment & Refunds", href: "/payments", icon: CreditCard },
];

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
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<StoredUser | null>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Read auth state from localStorage
  useEffect(() => {
    const readAuth = () => {
      try {
        const token = localStorage.getItem("auth_token");
        const raw = localStorage.getItem("user");
        if (token && raw) {
          setLoggedInUser(JSON.parse(raw));
        } else {
          setLoggedInUser(null);
        }
      } catch {
        setLoggedInUser(null);
      }
    };
    readAuth();
    // Re-read on storage change (e.g. login in another tab)
    window.addEventListener("storage", readAuth);
    return () => window.removeEventListener("storage", readAuth);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setLoggedInUser(null);
    setUserDropdownOpen(false);
    router.push("/");
  };

  const avatarInitials = loggedInUser?.name
    ? loggedInUser.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "?";

  const isDark = scrolled || forceDark;

  const textCls = isDark
    ? "text-gray-700 hover:text-gray-900"
    : "text-white/80 hover:text-white";
  const logoSrc = isDark ? "/logo-dark.svg" : "/logo-white.svg";

  return (
    <>
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

            {/* CTA / User */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/download"
                className="text-sm font-bold px-5 py-2.5 rounded-full transition-all"
                style={
                  isDark
                    ? { border: "2px solid #0A0A0A", color: "#0A0A0A" }
                    : {
                        border: "2px solid rgba(255,255,255,0.3)",
                        color: "#fff",
                      }
                }
              >
                Download App
              </Link>

              {loggedInUser ? (
                /* ── User avatar dropdown ── */
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen((o) => !o)}
                    className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 transition-colors hover:bg-black/5"
                    aria-label="User menu"
                  >
                    {/* Avatar */}
                    <div
                      className="w-8 h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-xs font-bold text-white"
                      style={{
                        background: "linear-gradient(135deg, #FECB19, #F95622)",
                      }}
                    >
                      {loggedInUser.avatar_url ? (
                        <Image
                          src={loggedInUser.avatar_url}
                          alt={loggedInUser.name ?? "User"}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        avatarInitials
                      )}
                    </div>
                    <span
                      className={`text-sm font-semibold max-w-[100px] truncate ${isDark ? "text-gray-800" : "text-white"}`}
                    >
                      {loggedInUser.name?.split(" ")[0] ?? "Account"}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${userDropdownOpen ? "rotate-180" : ""} ${isDark ? "text-gray-600" : "text-white/70"}`}
                    />
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden"
                      >
                        {/* User info header */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {loggedInUser.name ?? "Bayaroo User"}
                          </p>
                          {loggedInUser.email && (
                            <p className="text-xs text-gray-400 truncate mt-0.5">
                              {loggedInUser.email}
                            </p>
                          )}
                        </div>

                        {/* Menu items */}
                        <div className="py-1">
                          {userMenuItems.map(({ label, href, icon: Icon }) => (
                            <Link
                              key={href}
                              href={href}
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                            >
                              <Icon
                                size={15}
                                className="shrink-0 text-gray-400"
                              />
                              {label}
                            </Link>
                          ))}
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-100 pt-1">
                          <button
                            onClick={() => setLogoutDialogOpen(true)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={15} className="shrink-0" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="btn-primary text-sm"
                  style={{ padding: "0.625rem 1.5rem" }}
                >
                  Login / Sign up
                </Link>
              )}
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

                  {loggedInUser ? (
                    <>
                      {/* Mobile user info */}
                      <div className="flex items-center gap-3 px-3 py-3 bg-amber-50 rounded-xl">
                        <div
                          className="w-9 h-9 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-xs font-bold text-white"
                          style={{
                            background:
                              "linear-gradient(135deg, #FECB19, #F95622)",
                          }}
                        >
                          {loggedInUser.avatar_url ? (
                            <Image
                              src={loggedInUser.avatar_url}
                              alt={loggedInUser.name ?? "User"}
                              width={36}
                              height={36}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            avatarInitials
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {loggedInUser.name ?? "Bayaroo User"}
                          </p>
                          {loggedInUser.email && (
                            <p className="text-xs text-gray-400 truncate">
                              {loggedInUser.email}
                            </p>
                          )}
                        </div>
                      </div>

                      {userMenuItems.map(({ label, href, icon: Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                        >
                          <Icon size={16} className="shrink-0 text-gray-400" />
                          {label}
                        </Link>
                      ))}

                      <button
                        onClick={() => setLogoutDialogOpen(true)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} className="shrink-0" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="btn-primary text-sm justify-center"
                    >
                      Login / Sign up
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Shared logout confirmation dialog — rendered outside all menus to avoid nested <button> */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of Bayaroo?</AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;ll need to sign in again to access your bookings and
              profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              Yes, sign out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
