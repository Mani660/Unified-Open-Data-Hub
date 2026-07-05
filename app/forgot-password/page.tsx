"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Database, Eye, EyeOff, KeyRound, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Step = "email" | "otp" | "newpassword" | "done";

// Generate a 6-digit OTP and store it in localStorage with expiry
function generateOTP(email: string): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  localStorage.setItem("dv_otp", JSON.stringify({ email, otp, expiry }));
  return otp;
}

function verifyOTP(email: string, inputOtp: string): boolean {
  try {
    const raw = localStorage.getItem("dv_otp");
    if (!raw) return false;
    const { email: storedEmail, otp, expiry } = JSON.parse(raw);
    if (storedEmail !== email) return false;
    if (Date.now() > expiry) return false;
    return otp === inputOtp;
  } catch { return false; }
}

function updatePassword(email: string, newPassword: string): boolean {
  try {
    const users = JSON.parse(localStorage.getItem("dv_users") || "[]");
    const idx = users.findIndex((u: { email: string }) => u.email === email.toLowerCase());
    if (idx === -1) return false;
    // Re-hash password same way as users.ts
    users[idx].passwordHash = btoa(encodeURIComponent(newPassword + "_dv_salt_2026"));
    localStorage.setItem("dv_users", JSON.stringify(users));
    localStorage.removeItem("dv_otp");
    return true;
  } catch { return false; }
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep]           = useState<Step>("email");
  const [email, setEmail]         = useState("");
  const [otp, setOtp]             = useState(["","","","","",""]);
  const [newPwd, setNewPwd]       = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [sentOtp, setSentOtp]     = useState(""); // shown in UI since no real email server
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => { document.documentElement.classList.add("dark"); }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Please enter your email address."); return; }

    // Check if user exists
    const users = JSON.parse(localStorage.getItem("dv_users") || "[]");
    const exists = users.find((u: { email: string }) => u.email === email.toLowerCase());
    if (!exists && email.toLowerCase() !== "admin@dataverse.ai") {
      setError("No account found with this email address.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const generatedOtp = generateOTP(email.toLowerCase());
      setSentOtp(generatedOtp); // In production, this would be emailed
      setResendTimer(60);
      setLoading(false);
      setStep("otp");
    }, 1000);
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    // Auto-focus next
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  }

  function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) { setError("Please enter the complete 6-digit OTP."); return; }
    setLoading(true);
    setTimeout(() => {
      if (verifyOTP(email.toLowerCase(), enteredOtp)) {
        setLoading(false);
        setStep("newpassword");
      } else {
        setLoading(false);
        setError("Invalid or expired OTP. Please try again.");
      }
    }, 600);
  }

  function handleResend() {
    const generatedOtp = generateOTP(email.toLowerCase());
    setSentOtp(generatedOtp);
    setResendTimer(60);
    setOtp(["","","","","",""]);
    setError("");
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!newPwd) { setError("Please enter a new password."); return; }
    if (newPwd.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (newPwd !== confirmPwd) { setError("Passwords do not match."); return; }
    setLoading(true);
    setTimeout(() => {
      const ok = updatePassword(email.toLowerCase(), newPwd);
      if (ok) {
        setLoading(false);
        setStep("done");
        setTimeout(() => router.push("/login"), 2500);
      } else {
        setLoading(false);
        setError("Failed to update password. Please try again.");
      }
    }, 700);
  }

  const strength = (() => {
    if (!newPwd) return 0;
    let s = 0;
    if (newPwd.length >= 8) s++;
    if (/[A-Z]/.test(newPwd)) s++;
    if (/[0-9]/.test(newPwd)) s++;
    if (/[^A-Za-z0-9]/.test(newPwd)) s++;
    return s;
  })();
  const strengthColors = ["","bg-rose-500","bg-amber-500","bg-cyan-500","bg-emerald-500"];
  const strengthLabels = ["","Weak","Fair","Good","Strong"];

  return (
    <main className="dark relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 text-foreground">
      <div className="data-grid pointer-events-none absolute inset-0 animate-grid-flow opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.2),transparent_28%)]" />

      <Card className="glass relative z-10 w-full max-w-md overflow-hidden p-0">

        {/* ── STEP: EMAIL ── */}
        {step === "email" && (
          <>
            <div className="border-b border-border/70 p-6">
              <div className="flex items-center gap-3">
                <Link href="/login" className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground hover:text-foreground transition">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                  <h1 className="text-xl font-black">Forgot password?</h1>
                  <p className="text-sm text-muted-foreground">Enter your email to receive an OTP</p>
                </div>
              </div>
            </div>
            <form onSubmit={handleEmailSubmit} className="space-y-4 p-6" noValidate>
              <label className="block">
                <span className="text-sm font-semibold">Email address</span>
                <span className="mt-1.5 flex min-h-11 items-center gap-3 rounded-xl border border-border/70 bg-background/70 px-4 focus-within:border-foreground/40 transition-colors">
                  <Mail className="h-4 w-4 shrink-0 text-cyan-400" />
                  <input className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    placeholder="Enter your registered email" type="email" value={email}
                    onChange={e => { setEmail(e.target.value); setError(""); }} autoComplete="email" />
                </span>
                {error && <p className="mt-1.5 text-sm text-rose-400">{error}</p>}
              </label>
              <div className="rounded-xl border border-border/70 bg-background/40 p-4">
                <div className="flex items-start gap-3">
                  <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
                  <p className="text-sm text-muted-foreground">
                    A <strong className="text-foreground">6-digit OTP</strong> will be sent to your email. Valid for <strong className="text-cyan-400">10 minutes</strong>.
                  </p>
                </div>
              </div>
              <Button className="w-full rounded-xl" size="lg" type="submit" disabled={loading}>
                {loading
                  ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" /> Sending OTP…</>
                  : <><Mail className="h-4 w-4" /> Send OTP</>
                }
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Remember it? <Link href="/login" className="font-bold text-cyan-500 hover:text-cyan-400">Sign in</Link>
              </p>
            </form>
          </>
        )}

        {/* ── STEP: OTP ── */}
        {step === "otp" && (
          <>
            <div className="border-b border-border/70 p-6">
              <div className="flex items-center gap-3">
                <button onClick={() => setStep("email")}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground hover:text-foreground transition">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                  <h1 className="text-xl font-black">Enter OTP</h1>
                  <p className="text-sm text-muted-foreground">Sent to <strong className="text-foreground">{email}</strong></p>
                </div>
              </div>
            </div>
            <form onSubmit={handleOtpSubmit} className="space-y-5 p-6" noValidate>

              {/* OTP display box — shows OTP since no real email server */}
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-1">Your OTP</p>
                <p className="text-2xl font-black tracking-[0.3em] text-foreground">{sentOtp}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  (In production this would be sent to your email. Valid for 10 minutes.)
                </p>
              </div>

              {/* 6-digit OTP input */}
              <div>
                <p className="mb-3 text-sm font-semibold">Enter the 6-digit code</p>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className={cn(
                        "h-12 w-12 rounded-xl border bg-background/70 text-center text-lg font-black outline-none transition-all",
                        digit ? "border-cyan-500 text-cyan-400" : "border-border/70",
                        "focus:border-foreground/60"
                      )}
                    />
                  ))}
                </div>
                {error && <p className="mt-2 text-center text-sm text-rose-400">{error}</p>}
              </div>

              <Button className="w-full rounded-xl" size="lg" type="submit" disabled={loading}>
                {loading
                  ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" /> Verifying…</>
                  : <><ShieldCheck className="h-4 w-4" /> Verify OTP</>
                }
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Didn't receive it?{" "}
                {resendTimer > 0
                  ? <span className="text-muted-foreground">Resend in {resendTimer}s</span>
                  : <button type="button" onClick={handleResend} className="font-bold text-cyan-500 hover:text-cyan-400">Resend OTP</button>
                }
              </p>
            </form>
          </>
        )}

        {/* ── STEP: NEW PASSWORD ── */}
        {step === "newpassword" && (
          <>
            <div className="border-b border-border/70 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/14 text-emerald-400">
                <KeyRound className="h-6 w-6" />
              </div>
              <h1 className="mt-3 text-xl font-black">Set new password</h1>
              <p className="text-sm text-muted-foreground">Choose a strong password for your account</p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4 p-6" noValidate>
              <label className="block">
                <span className="text-sm font-semibold">New Password</span>
                <span className="mt-1.5 flex min-h-11 items-center gap-3 rounded-xl border border-border/70 bg-background/70 px-4 focus-within:border-foreground/40 transition-colors">
                  <KeyRound className="h-4 w-4 shrink-0 text-cyan-400" />
                  <input className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    placeholder="Min. 8 characters" type={showPwd ? "text" : "password"}
                    value={newPwd} onChange={e => { setNewPwd(e.target.value); setError(""); }} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    className="shrink-0 text-muted-foreground hover:text-foreground transition">
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
                {newPwd && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex flex-1 gap-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all", i <= strength ? strengthColors[strength] : "bg-border")} />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{strengthLabels[strength]}</span>
                  </div>
                )}
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Confirm Password</span>
                <span className={cn("mt-1.5 flex min-h-11 items-center gap-3 rounded-xl border bg-background/70 px-4 focus-within:border-foreground/40 transition-colors",
                  confirmPwd && newPwd !== confirmPwd ? "border-rose-500/70" : "border-border/70"
                )}>
                  <KeyRound className="h-4 w-4 shrink-0 text-cyan-400" />
                  <input className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    placeholder="Repeat new password" type={showConfirm ? "text" : "password"}
                    value={confirmPwd} onChange={e => { setConfirmPwd(e.target.value); setError(""); }} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowConfirm(v => !v)}
                    className="shrink-0 text-muted-foreground hover:text-foreground transition">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
                {confirmPwd && newPwd !== confirmPwd && (
                  <p className="mt-1 text-xs text-rose-400">Passwords do not match</p>
                )}
              </label>
              {error && <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">{error}</div>}
              <Button className="w-full rounded-xl" size="lg" type="submit" disabled={loading}>
                {loading
                  ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" /> Updating…</>
                  : "Update Password"
                }
              </Button>
            </form>
          </>
        )}

        {/* ── STEP: DONE ── */}
        {step === "done" && (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-black">Password Updated!</h2>
            <p className="mt-2 text-muted-foreground">Your password has been reset successfully. Redirecting to login…</p>
          </div>
        )}

      </Card>
    </main>
  );
}
