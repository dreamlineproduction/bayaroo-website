"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const handle = async () => {
      try {
        // Exchange the code from the URL for a Supabase session (PKCE flow)
        const code = searchParams.get("code");
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (error) {
          setErrorMsg(errorDescription ?? error);
          setStatus("error");
          return;
        }

        if (!code) {
          // Handle implicit flow — session may already be set via URL hash
          const {
            data: { session },
            error: sessionError,
          } = await supabase.auth.getSession();

          if (sessionError || !session) {
            setErrorMsg("Could not complete sign in. Please try again.");
            setStatus("error");
            return;
          }

          await syncAndRedirect(session);
          return;
        }

        // PKCE: exchange code for session
        const { data, error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError || !data.session) {
          setErrorMsg(exchangeError?.message ?? "Authentication failed.");
          setStatus("error");
          return;
        }

        await syncAndRedirect(data.session);
      } catch (err) {
        console.error("Auth callback error:", err);
        setErrorMsg("An unexpected error occurred. Please try again.");
        setStatus("error");
      }
    };

    const syncAndRedirect = async (session: Session) => {
      const { user } = session;
      const provider = user.app_metadata?.provider ?? "google";

      try {
        const res = await fetch(`${API_BASE}/auth/oauth-sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider,
            provider_id: user.id,
            email: user.email ?? "",
            name:
              user.user_metadata?.full_name ?? user.user_metadata?.name ?? "",
            avatar_url:
              user.user_metadata?.avatar_url ??
              user.user_metadata?.picture ??
              "",
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.message ?? "Failed to sync account.");
          setStatus("error");
          return;
        }

        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect: new users without a name get profile completion prompt, others go home
        router.replace("/");
      } catch {
        setErrorMsg("Failed to connect to the server. Please try again.");
        setStatus("error");
      }
    };

    handle();
  }, [router, searchParams]);

  if (status === "error") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: "#f0efea" }}
      >
        <div className="bg-white rounded-3xl shadow-sm border border-black/5 w-full max-w-sm p-10 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "#FFF0F0" }}
          >
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Sign in failed
          </h2>
          <p className="text-sm text-gray-500 mb-6">{errorMsg}</p>
          <button
            onClick={() => router.replace("/login")}
            className="w-full py-3 rounded-xl text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #FECB19, #F95622)" }}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

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
      <div className="flex flex-col items-center gap-3">
        {/* Spinner */}
        <div
          className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: "#FECB19", borderTopColor: "transparent" }}
        />
        <p className="text-sm font-medium text-gray-500">Signing you in…</p>
      </div>
    </div>
  );
}
