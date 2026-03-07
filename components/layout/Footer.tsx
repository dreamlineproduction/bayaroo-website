"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const footerLinks = {
  Explore: [
    { label: "Browse Destinations", href: "/explore" },
    { label: "Tour Packages", href: "/packages" },
    { label: "AI Trip Planner", href: "/explore#ai-planner" },
    { label: "Homestays", href: "/explore?type=homestay" },
    { label: "Resorts & Villas", href: "/explore?type=resort" },
  ],
  Partners: [
    { label: "List Your Property", href: "/list-property" },
    { label: "For Travel Agents", href: "/travel-agents" },
    { label: "Become a Field Agent", href: "/become-agent" },
    {
      label: "Agent Portal",
      href: "https://agent.bayaroo.space",
      external: true,
    },
  ],
  Company: [
    { label: "About Bayaroo", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Press Kit", href: "/press" },
    { label: "Contact Us", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cancellation Policy", href: "/cancellation" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const socials = [
  {
    icon: Instagram,
    href: "https://instagram.com/bayaroo",
    label: "Instagram",
  },
  { icon: Facebook, href: "https://facebook.com/bayaroo", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com/bayaroo", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com/@bayaroo", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0A0A0A",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        paddingBottom: "4rem",
        paddingTop: "4rem",
      }}
    >
      {/* Main footer */}
      <div className="container py-16 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-5">
              <Image
                src="/logo.svg"
                alt="Bayaroo"
                width={130}
                height={28}
                className="h-7 w-auto"
              />
            </Link>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              India&apos;s Rural &amp; Off-Beat Travel Super App. Discover
              authentic homestays, hidden resorts, and unique experiences across
              India.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3 mb-8">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "#FECB19";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "#FECB19";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(255,255,255,0.1)";
                  }}
                >
                  <s.icon size={15} color="#fff" />
                </a>
              ))}
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-2">
              {[
                { icon: Mail, text: "hello@bayaroo.com" },
                { icon: Phone, text: "+91 98765 43210" },
                { icon: MapPin, text: "Kolkata, West Bengal, India" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon size={13} style={{ color: "#FECB19" }} />
                  <span
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4
                className="text-xs font-bold tracking-widest uppercase mb-4"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      target={
                        "external" in l && l.external ? "_blank" : undefined
                      }
                      rel={
                        "external" in l && l.external
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="text-sm transition-colors"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* App store badges */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "3rem",
        }}
      >
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            © 2026 Bayaroo Space Private Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-semibold"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Available on
            </span>
            <a
              href="/download"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-colors"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              📱 Google Play
            </a>
            <a
              href="/download"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-colors"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              🍎 App Store
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
