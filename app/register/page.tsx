"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, Database, Eye, EyeOff, KeyRound, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { setSession } from "@/lib/session";
import { registerUser } from "@/lib/users";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirm: "", college: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => { document.documentElement.classList.add("dark"); }, []);

  const strength = (() => {
    const p = form.password; if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const strengthColors = ["","bg-rose-500","bg-amber-500","bg-cyan-500","bg-emerald-500"];
  const strengthLabels = ["","Weak","Fair","Good","Strong"];

  function upd(k: keyof typeof form) { return (e: React.ChangeEvent<HTMLInputElement>) => { setForm(f => ({...f,[k]:e.target.value})); setError(""); }; }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.confirm) { setError("All fields are required."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!terms) { setError("Please accept the Terms & Conditions."); return; }
    setLoading(true);
    setTimeout(() => {
      const result = registerUser(form.fullName, form.email, form.password, form.college);
      if (!result.success) {
        setLoading(false);
        setError(result.error || "Registration failed.");
        return;
      }
      setSession({ role: "user", email: form.email.toLowerCase(), name: form.fullName });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    }, 800);
  }

  if (success) return (
    <main className="dark flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <Card className="glass w-full max-w-md p-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-black">Account Created!</h2>
        <p className="mt-2 text-muted-foreground">Redirecting to your dashboard…</p>
      </Card>
    </main>
  );

  return (
    <main className="dark relative min-h-screen overflow-hidden bg-background px-4 py-6 text-foreground">
      <div className="data-grid pointer-events-none absolute inset-0 animate-grid-flow opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.2),transparent_28%)]" />

      <nav className="container relative z-10 flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white">
            <Database className="h-4 w-4" />
          </span>
          <span className="font-black text-sm">DataVerse AI</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Have an account?</span>
          <Button variant="secondary" size="sm" asChild><Link href="/login">Sign In</Link></Button>
        </div>
      </nav>

      <div className="container relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center py-8">
        <Card className="glass w-full max-w-md overflow-hidden p-0">
          <div className="border-b border-border/70 p-6">
            <h1 className="text-2xl font-black">Create your account</h1>
            <p className="mt-1 text-sm text-muted-foreground">Join DataVerse AI — free forever</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 p-6" noValidate>
            <label className="block">
              <span className="text-sm font-semibold">Full Name <span className="text-rose-400">*</span></span>
              <span className="mt-1.5 flex min-h-11 items-center gap-3 rounded-xl border border-border/70 bg-background/70 px-4 focus-within:border-foreground/40 transition-colors">
                <UserRound className="h-4 w-4 shrink-0 text-cyan-400" />
                <input className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="Arjun Sharma" type="text" value={form.fullName} onChange={upd("fullName")} autoComplete="name" />
              </span>
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Email Address <span className="text-rose-400">*</span></span>
              <span className="mt-1.5 flex min-h-11 items-center gap-3 rounded-xl border border-border/70 bg-background/70 px-4 focus-within:border-foreground/40 transition-colors">
                <UserRound className="h-4 w-4 shrink-0 text-cyan-400" />
                <input className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="arjun@example.com" type="email" value={form.email} onChange={upd("email")} autoComplete="email" />
              </span>
            </label>
            <label className="block">
              <span className="text-sm font-semibold">College / Organization</span>
              <span className="mt-1.5 flex min-h-11 items-center gap-3 rounded-xl border border-border/70 bg-background/70 px-4 focus-within:border-foreground/40 transition-colors">
                <Building2 className="h-4 w-4 shrink-0 text-cyan-400" />
                <input className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="IIT Delhi / ISRO / Independent" type="text" value={form.college} onChange={upd("college")} />
              </span>
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Password <span className="text-rose-400">*</span></span>
              <span className="mt-1.5 flex min-h-11 items-center gap-3 rounded-xl border border-border/70 bg-background/70 px-4 focus-within:border-foreground/40 transition-colors">
                <KeyRound className="h-4 w-4 shrink-0 text-cyan-400" />
                <input className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="Min. 8 characters" type={showPwd ? "text" : "password"} value={form.password} onChange={upd("password")} autoComplete="new-password" />
                <button type="button" onClick={() => setShowPwd(v=>!v)} className="shrink-0 text-muted-foreground hover:text-foreground transition">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
              {form.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex flex-1 gap-1">{[1,2,3,4].map(i=><div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all", i<=strength ? strengthColors[strength] : "bg-border")} />)}</div>
                  <span className="text-xs font-semibold text-muted-foreground">{strengthLabels[strength]}</span>
                </div>
              )}
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Confirm Password <span className="text-rose-400">*</span></span>
              <span className={cn("mt-1.5 flex min-h-11 items-center gap-3 rounded-xl border bg-background/70 px-4 focus-within:border-foreground/40 transition-colors",
                form.confirm && form.password !== form.confirm ? "border-rose-500/70" : "border-border/70"
              )}>
                <KeyRound className="h-4 w-4 shrink-0 text-cyan-400" />
                <input className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="Repeat password" type={showConfirm ? "text" : "password"} value={form.confirm} onChange={upd("confirm")} autoComplete="new-password" />
                <button type="button" onClick={() => setShowConfirm(v=>!v)} className="shrink-0 text-muted-foreground hover:text-foreground transition">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/70 bg-background/40 p-3">
              <input type="checkbox" className="mt-0.5 h-4 w-4 accent-cyan-500" checked={terms} onChange={e=>setTerms(e.target.checked)} />
              <span className="text-sm text-muted-foreground">
                I agree to the <Link href="#" className="font-semibold text-cyan-500 hover:text-cyan-400">Terms of Service</Link> and <Link href="#" className="font-semibold text-cyan-500 hover:text-cyan-400">Privacy Policy</Link>
              </span>
            </label>
            {error && <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">{error}</div>}
            <Button className="w-full rounded-xl" size="lg" type="submit" disabled={loading || !terms}>
              {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" /> Creating…</> : <>Create Account <ArrowRight className="h-4 w-4" /></>}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account? <Link href="/login" className="font-bold text-cyan-500 hover:text-cyan-400">Sign in</Link>
            </p>
          </form>
        </Card>
      </div>
    </main>
  );
}
