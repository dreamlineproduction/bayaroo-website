"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Phone, Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const REDIRECT_BASE =
  typeof window !== "undefined"
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001");

type Step = "phone" | "otp";

export default function LoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<
    "google" | "facebook" | null
  >(null);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const fullPhone = `+91${phone}`;

  // Redirect if already logged in
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("auth_token")) {
      router.replace("/");
    }
  }, [router]);

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  // ── Social login ───────────────────────────────────────────────────────────

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setError("");
    setSocialLoading(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${REDIRECT_BASE}/auth/callback`,
          queryParams:
            provider === "google"
              ? { access_type: "offline", prompt: "consent" }
              : {},
        },
      });
      if (error) {
        setError(error.message);
        setSocialLoading(null);
      }
      // On success, browser redirects — no need to change state
    } catch {
      setError("Failed to initiate sign in. Please try again.");
      setSocialLoading(null);
    }
  };

  // ── Step 1: Send OTP ───────────────────────────────────────────────────────

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone, type: "login" }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Failed to send OTP. Please try again.");
        return;
      }

      // Dev mode: show OTP in UI
      if (data.otp) {
        setDevOtp(data.otp);
      }

      setStep("otp");
      setResendTimer(60);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ─────────────────────────────────────────────────────

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login-with-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone, otp: code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Invalid OTP. Please try again.");
        return;
      }

      // Persist token
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.replace("/");
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // ── OTP input helpers ──────────────────────────────────────────────────────

  const handleOtpChange = (i: number, val: string) => {
    // Handle paste of full 6-digit code
    if (val.length > 1) {
      const digits = val.replace(/\D/g, "").slice(0, 6);
      if (digits.length === 6) {
        setOtp(digits.split(""));
        inputRefs.current[5]?.focus();
        return;
      }
      val = val.replace(/\D/g, "").slice(-1);
    }

    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
    if (e.key === "Enter") handleVerify();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (digits.length === 6) {
      setOtp(digits.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone, type: "login" }),
      });
      const data = await res.json();
      if (data.otp) setDevOtp(data.otp);
      setResendTimer(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch {
      setError("Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#f0efea" }}
    >
      {/* Minimal header */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-color.svg"
            alt="Bayaroo"
            width={110}
            height={24}
            className="h-7 w-auto"
          />
        </Link>
        <Link
          href="/"
          className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
        >
          Back to home
        </Link>
      </header>

      {/* Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-3xl shadow-sm border border-black/5 w-full max-w-md p-8 sm:p-10">
          {step === "phone" ? (
            <PhoneStep
              phone={phone}
              setPhone={setPhone}
              loading={loading}
              socialLoading={socialLoading}
              error={error}
              setError={setError}
              onSubmit={handleSendOtp}
              onSocialLogin={handleSocialLogin}
            />
          ) : (
            <OtpStep
              phone={phone}
              otp={otp}
              devOtp={devOtp}
              loading={loading}
              error={error}
              resendTimer={resendTimer}
              inputRefs={inputRefs}
              onChange={handleOtpChange}
              onKeyDown={handleOtpKeyDown}
              onPaste={handleOtpPaste}
              onVerify={handleVerify}
              onResend={handleResend}
              onBack={() => {
                setStep("phone");
                setOtp(["", "", "", "", "", ""]);
                setError("");
                setDevOtp(null);
              }}
            />
          )}
        </div>
      </main>

      {/* Footer note */}
      <footer className="text-center pb-8 px-4">
        <p className="text-xs text-gray-400">
          By continuing, you agree to Bayaroo&apos;s{" "}
          <Link href="/legal" className="underline hover:text-gray-600">
            Terms of Service
          </Link>{" "}
          &amp;{" "}
          <Link href="/legal" className="underline hover:text-gray-600">
            Privacy Policy
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function PhoneStep({
  phone,
  setPhone,
  loading,
  socialLoading,
  error,
  setError,
  onSubmit,
  onSocialLogin,
}: {
  phone: string;
  setPhone: (v: string) => void;
  loading: boolean;
  socialLoading: "google" | "facebook" | null;
  error: string;
  setError: (v: string) => void;
  onSubmit: () => void;
  onSocialLogin: (p: "google" | "facebook") => void;
}) {
  return (
    <>
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: "#FFF8E1" }}
      >
        <Phone size={24} style={{ color: "#F95622" }} strokeWidth={1.8} />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
      <p className="text-sm text-gray-500 mb-8">
        Enter your mobile number to sign in or create an account.
      </p>

      {/* Phone input */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Mobile Number
        </label>
        <div
          className="flex items-center rounded-xl border-2 overflow-hidden transition-colors focus-within:border-amber-400"
          style={{ borderColor: error ? "#ef4444" : "#e5e7eb" }}
        >
          {/* Country code */}
          <div
            className="flex items-center gap-1.5 px-3 py-3.5 border-r text-sm font-semibold text-gray-700 bg-gray-50 shrink-0"
            style={{ borderColor: "#e5e7eb" }}
          >
            <span className="text-base leading-none">🇮🇳</span>
            <span>+91</span>
          </div>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={phone}
            placeholder="XXXXX XXXXX"
            autoFocus
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 10);
              setPhone(val);
              if (error) setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            className="flex-1 px-4 py-3.5 text-sm font-medium text-gray-900 placeholder:text-gray-300 outline-none bg-white"
          />
        </div>
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      </div>

      {/* CTA */}
      <button
        onClick={onSubmit}
        disabled={loading || phone.length !== 10}
        className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, #FECB19, #F95622)" }}
      >
        {loading ? "Sending OTP…" : "Continue"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">
          or continue with
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Social buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => onSocialLogin("google")}
          disabled={loading || socialLoading !== null}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
          style={{ borderColor: "#e5e7eb" }}
        >
          {socialLoading === "google" ? (
            <div
              className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "#4285F4", borderTopColor: "transparent" }}
            />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          Continue with Google
        </button>

        <button
          onClick={() => onSocialLogin("facebook")}
          disabled={loading || socialLoading !== null}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
          style={{ borderColor: "#e5e7eb" }}
        >
          {socialLoading === "facebook" ? (
            <div
              className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "#1877F2", borderTopColor: "transparent" }}
            />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          )}
          Continue with Facebook
        </button>
      </div>

      {/* Info note */}
      <p className="mt-5 text-xs text-center text-gray-400">
        New to Bayaroo? An account will be created automatically.
      </p>
    </>
  );
}

function OtpStep({
  phone,
  otp,
  devOtp,
  loading,
  error,
  resendTimer,
  inputRefs,
  onChange,
  onKeyDown,
  onPaste,
  onVerify,
  onResend,
  onBack,
}: {
  phone: string;
  otp: string[];
  devOtp: string | null;
  loading: boolean;
  error: string;
  resendTimer: number;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onChange: (i: number, v: string) => void;
  onKeyDown: (i: number, e: React.KeyboardEvent) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  onVerify: () => void;
  onResend: () => void;
  onBack: () => void;
}) {
  return (
    <>
      {/* Back + icon row */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={16} className="text-gray-600" />
        </button>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "#FFF8E1" }}
        >
          <Shield size={18} style={{ color: "#F95622" }} strokeWidth={1.8} />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Verify OTP</h1>
      <p className="text-sm text-gray-500 mb-8">
        We sent a 6-digit code to{" "}
        <span className="font-semibold text-gray-700">+91 {phone}</span>
      </p>

      {/* Dev OTP hint */}
      {devOtp && (
        <div
          className="mb-5 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold text-center"
          style={{ background: "#FFF3E0", color: "#E65100" }}
        >
          Dev mode — OTP: {devOtp}
        </div>
      )}

      {/* OTP boxes */}
      <div className="flex gap-2.5 justify-center mb-6" onPaste={onPaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={digit}
            onChange={(e) => onChange(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            className="w-11 h-13 sm:w-12 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all"
            style={{
              borderColor: digit ? "#F95622" : error ? "#ef4444" : "#e5e7eb",
              background: digit ? "#FFF8E1" : "#fff",
              height: "3.25rem",
            }}
          />
        ))}
      </div>

      {error && (
        <p className="mb-4 text-xs text-center text-red-500">{error}</p>
      )}

      {/* Verify button */}
      <button
        onClick={onVerify}
        disabled={loading || otp.join("").length !== 6}
        className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, #FECB19, #F95622)" }}
      >
        {loading ? "Verifying…" : "Verify & Sign In"}
      </button>

      {/* Resend */}
      <p className="mt-5 text-xs text-center text-gray-500">
        Didn&apos;t receive the code?{" "}
        {resendTimer > 0 ? (
          <span className="font-semibold text-gray-400">
            Resend in {resendTimer}s
          </span>
        ) : (
          <button
            onClick={onResend}
            disabled={loading}
            className="font-semibold underline text-gray-700 hover:text-gray-900 disabled:opacity-50"
          >
            Resend OTP
          </button>
        )}
      </p>
    </>
  );
}
