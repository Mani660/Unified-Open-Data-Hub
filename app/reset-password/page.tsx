"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => { document.documentElement.classList.add("dark"); }, []);

  const passwordStrength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();
  const strengthColor = ["", "bg-rose-500", "bg-amber-500", "bg-cyan-500", "bg-emerald-500"][passwordStrength];
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][passwordStrength];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password || !confirmPassword) { setError("Please fill in all fields."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!token) { setError("Invalid reset link."); return; }

    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); }
      else { setSuccess(true); setTimeout(() => router.push("/login?reset=success"), 2500); }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <main className="dark mesh-bg flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <Card className="glass w-full max-w-md p-10 text-center">
          <p className="text-rose-400 font-semibold">Invalid or missing reset token.</p>
          <Button className="mt-6 w-full" asChild><Link href="/forgot-password">Request New Link</Link></Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="dark mesh-bg relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 text-foreground">
      <div className="data-grid pointer-events-none absolute inset-0 animate-grid-flow opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(34,211,238,0.24),transparent_30%)]" />

      <Card className="glass relative z-10 w-full max-w-md overflow-hidden p-0">
        {success ? (
          <div className="p-10 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-black">Password updated!</h2>
            <p className="mt-3 text-muted-foreground">Your password has been reset successfully. Redirecting to login…</p>
          </div>
        ) : (
          <>
            <div className="border-b border-border/70 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/14 text-cyan-400">
                <KeyRound className="h-6 w-6" />
              </div>
              <h1 className="mt-4 text-2xl font-black">Set new password</h1>
              <p className="mt-1 text-sm text-muted-foreground">Choose a strong password for your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6" noValidate>
              <label className="block">
                <span className="text-sm font-bold">New Password</span>
                <span className="mt-2 flex min-h-12 items-center gap-3 rounded-lg border border-border/70 bg-background/70 px-4 focus-within:border-foreground/40 transition-colors">
                  <KeyRound className="h-5 w-5 shrink-0 text-cyan-400" />
                  <input className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    placeholder="Min. 8 characters" type={showPassword ? "text" : "password"}
                    value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    autoComplete="new-password" required />
                  <button type="button" onClick={() => setShowPassword((v) => !v)}
                    className="shrink-0 text-muted-foreground hover:text-foreground transition">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
                {password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex flex-1 gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all", i <= passwordStrength ? strengthColor : "bg-border")} />
                      ))}
                    </div>
                    <span className={cn("text-xs font-semibold", strengthColor.replace("bg-", "text-"))}>{strengthLabel}</span>
                  </div>
                )}
              </label>

              <label className="block">
                <span className="text-sm font-bold">Confirm Password</span>
                <span className={cn("mt-2 flex min-h-12 items-center gap-3 rounded-lg border bg-background/70 px-4 focus-within:border-foreground/40 transition-colors",
                  confirmPassword && password !== confirmPassword ? "border-rose-500/70" : "border-border/70"
                )}>
                  <KeyRound className="h-5 w-5 shrink-0 text-cyan-400" />
                  <input className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    placeholder="Repeat new password" type={showConfirm ? "text" : "password"}
                    value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                    autoComplete="new-password" required />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)}
                    className="shrink-0 text-muted-foreground hover:text-foreground transition">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-xs text-rose-400">Passwords do not match</p>
                )}
              </label>

              {error && (
                <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-400">{error}</div>
              )}

              <Button className="w-full" size="lg" type="submit" disabled={loading}>
                {loading ? (
                  <><span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" /> Updating…</>
                ) : (
                  <>Update Password <ArrowRight className="h-4 w-4" /></>
                )}
              </Button>
            </form>
          </>
        )}
      </Card>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="dark mesh-bg flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-cyan-500" />
        </main>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
