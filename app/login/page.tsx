"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Database,
  Eye,
  FileText,
  KeyRound,
  LockKeyhole,
  Mail,
  MapPinned,
  ShieldCheck,
  TableProperties,
  Upload,
  UserRound,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const role: string = "user";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [oauthMessage, setOauthMessage] = useState("");

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  async function handleGoogleLogin() {
    try {
      setOauthMessage("Redirecting to Google...");
      await signIn("google", { callbackUrl: "/home" });
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setOauthMessage("Failed to initiate Google sign-in. Please try again.");
    }
  }

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validCredentials = email.trim().toLowerCase() === "student@opendata.in" && password === "User@123";

    if (!validCredentials) {
      setLoginMessage("Incorrect email or password. Please enter the correct demo details.");
      return;
    }

    // Set session cookie so middleware allows access
    document.cookie = "dv_auth=1; path=/; max-age=604800; SameSite=Lax";

    // Store session in localStorage
    const session = {
      role,
      email: email.trim().toLowerCase(),
      name: name.trim() || "Student"
    };
    localStorage.setItem("dv_session", JSON.stringify(session));

    setLoginMessage("Login successful. Opening the main page...");

    // Redirect to home
    setTimeout(() => {
      window.location.href = "/home";
    }, 500);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111c] text-white">
      <ForestScene />

      <nav className="container relative z-20 flex items-center justify-between py-5">
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-3" aria-label="Unified Open Data Hub home">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-950">
              <Database className="h-5 w-5" />
            </span>
            <span className="text-sm font-black">Unified Open Data Hub</span>
          </a>

          {/* 3 Partner Logos */}
          <div className="hidden md:flex items-center gap-3 pl-3 border-l border-white/20">
            <img src="/logo-ou.png" alt="Osmania University" className="h-7 w-auto object-contain" />
            <img src="/logo-otbi.png" alt="Osmania Technology Business Incubator" className="h-7 w-auto object-contain" />
            <img src="/logo-tchetty.png" alt="Tchetty" className="h-7 w-auto object-contain" />
          </div>
        </div>

        <Button variant="secondary" size="sm" asChild>
          <a href="/login">Login</a>
        </Button>
      </nav>

      <section className="container relative z-10 grid min-h-[calc(100vh-88px)] place-items-center px-4 pb-16">
        <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="rounded-lg border border-white/20 bg-white/16 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">
                India-Focused
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-normal">
                {role === "admin" ? "Admin Login" : "User Login"}
              </h1>
            </div>
          </div>



          <form className="space-y-4" onSubmit={handleLogin}>


            <label className="block">
              <span className="text-sm font-bold text-white/88">Your Name</span>
              <span className="mt-2 flex min-h-12 items-center gap-3 rounded-md border border-white/15 bg-slate-950/35 px-4 text-white">
                <UserRound className="h-5 w-5 text-white/50" />
                <input
                  className="w-full bg-transparent text-sm font-medium outline-none text-white placeholder:text-white/40"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your name"
                  type="text"
                  autoComplete="off"
                />
              </span>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-white/88">Email</span>
              <span className="mt-2 flex min-h-12 items-center gap-3 rounded-md border border-white/15 bg-slate-950/35 px-4 text-white">
                <Mail className="h-5 w-5 text-white/50" />
                <input
                  className="w-full bg-transparent text-sm font-medium outline-none text-white placeholder:text-white/40"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="student@opendata.in"
                  type="email"
                  autoComplete="off"
                />
              </span>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-white/88">Password</span>
              <span className="mt-2 flex min-h-12 items-center gap-3 rounded-md border border-white/15 bg-slate-950/35 px-4 text-white">
                <KeyRound className="h-5 w-5 text-white/50" />
                <input
                  className="w-full bg-transparent text-sm font-medium outline-none text-white placeholder:text-white/40"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  type="password"
                  autoComplete="new-password"
                />
                <Eye className="h-5 w-5 text-white/50 hover:text-white cursor-pointer" />
              </span>
            </label>



            <Button className="h-12 w-full rounded-md bg-slate-950 text-white hover:shadow-[0_18px_50px_rgba(34,211,238,0.2)]" size="lg" type="submit">
              <LockKeyhole className="h-4 w-4" />
              {role === "admin" ? "Login as Admin" : "Login as User"}
            </Button>

            {loginMessage ? (
              <p
                className={`rounded-md border px-3 py-2 text-sm leading-6 ${
                  loginMessage.startsWith("Login successful")
                    ? "border-emerald-200/25 bg-emerald-200/10 text-emerald-50"
                    : "border-rose-200/25 bg-rose-200/10 text-rose-50"
                }`}
              >
                {loginMessage}
              </p>
            ) : null}

            {role === "user" ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-white/18" />
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/54">
                    or
                  </span>
                  <span className="h-px flex-1 bg-white/18" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-md border border-white/20 bg-white text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(255,255,255,0.18)]"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                {oauthMessage ? (
                  <p className="rounded-md border border-cyan-200/20 bg-cyan-200/10 px-3 py-2 text-sm leading-6 text-cyan-100">
                    {oauthMessage}
                  </p>
                ) : null}
              </>
            ) : null}


          </form>

          <div className="mt-6 rounded-md border border-cyan-200/20 bg-cyan-200/10 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-200" />
              <p className="text-sm leading-6 text-white/76">
                {role === "admin"
                  ? "Admins can add datasets, update metadata, and manage catalog quality."
                  : "Users can search, preview, save, and download verified open datasets."}
              </p>
            </div>
          </div>
        </div>

          <div className="rounded-lg border border-white/20 bg-white/14 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.38)] backdrop-blur-2xl">
            {role === "admin" ? <AdminDatasetForm /> : <UserPreviewPanel />}
          </div>
        </div>
      </section>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

function UserPreviewPanel() {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">User Workspace</p>
      <h2 className="mt-2 text-3xl font-black">Search and download datasets.</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/72">
        After login, users can search by keyword, filter by domain, format, year, and state, preview sample rows,
        and download datasets for project work.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          ["Pollution", "CPCB air quality data", "CSV"],
          ["Health", "NFHS district indicators", "XLSX"],
          ["Literacy Rate", "Gender gap indicators", "JSON"],
          ["Population", "Census demographics", "CSV"]
        ].map(([domain, description, format]) => (
          <div key={domain} className="rounded-md border border-white/15 bg-slate-950/35 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-black">{domain}</h3>
              <span className="rounded-full bg-cyan-200/14 px-3 py-1 text-xs font-black text-cyan-200">
                {format}
              </span>
            </div>
            <p className="mt-2 text-sm text-white/68">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}



function ForestScene() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,12,22,0.1),rgba(4,12,22,0.65)),radial-gradient(circle_at_50%_18%,rgba(180,226,255,0.48),transparent_30%),linear-gradient(120deg,#07111c,#12314b_52%,#07111c)]" />
      <div className="absolute inset-x-0 bottom-0 h-[42vh] bg-[linear-gradient(180deg,transparent,rgba(5,14,23,0.42)_24%,rgba(4,11,17,0.95))]" />

      <svg
        className="absolute inset-0 h-full w-full opacity-95"
        viewBox="0 0 1200 760"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="treeFade" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#173a56" stopOpacity="0.68" />
            <stop offset="1" stopColor="#06101a" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path d="M0 590 C180 548 310 612 460 574 C640 528 770 548 920 586 C1040 616 1120 590 1200 560 L1200 760 L0 760 Z" fill="#07121b" opacity="0.72" />
        {[
          [70, 360, 28, -74],
          [170, 340, 30, 64],
          [278, 380, 24, -70],
          [890, 350, 30, -64],
          [1004, 382, 24, 70],
          [1110, 345, 30, -76]
        ].map(([x, y, width, lean]) => (
          <g key={`${x}-${y}`} opacity="0.86">
            <path
              d={`M${x} 760 C${x + lean * 0.2} 610 ${x + lean * 0.42} 470 ${x + lean} ${y}`}
              fill="none"
              stroke="url(#treeFade)"
              strokeWidth={width}
              strokeLinecap="round"
            />
            <path
              d={`M${x + lean * 0.54} ${y + 170} C${x + lean * 0.14} ${y + 112} ${x - 60} ${y + 70} ${x - 160} ${y + 18}`}
              fill="none"
              stroke="#102a40"
              strokeWidth="12"
              strokeLinecap="round"
              opacity="0.76"
            />
            <path
              d={`M${x + lean * 0.54} ${y + 148} C${x + lean * 0.95} ${y + 92} ${x + 88} ${y + 58} ${x + 180} ${y + 6}`}
              fill="none"
              stroke="#102a40"
              strokeWidth="10"
              strokeLinecap="round"
              opacity="0.72"
            />
          </g>
        ))}
        <g transform="translate(155 642) scale(1.22)" opacity="0.78">
          <path d="M0 58 C26 18 78 14 120 30 C146 40 168 48 196 42 C186 64 168 76 142 76 L56 76 C28 76 10 70 0 58Z" fill="#050b11" />
          <path d="M154 38 C172 10 198 0 224 4 C212 16 207 30 206 48 C186 46 170 42 154 38Z" fill="#050b11" />
          <path d="M64 74 L54 128 M92 74 L92 132 M130 74 L140 130 M158 70 L178 124" stroke="#050b11" strokeWidth="12" strokeLinecap="round" />
          <path d="M204 10 C214 -10 234 -18 254 -20 M206 12 C228 2 246 4 264 16" stroke="#050b11" strokeWidth="7" strokeLinecap="round" fill="none" />
        </g>
      </svg>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.08),transparent_24%)]" />
    </div>
  );
}

function AdminDatasetForm() {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">Admin Workspace</p>
      <h2 className="mt-2 text-3xl font-black">Add New Dataset</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/72">
        Admins can upload, catalog, and verify public datasets.
      </p>
      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Dataset Name</span>
          <span className="mt-1.5 flex min-h-11 items-center gap-3 rounded-xl border border-white/15 bg-slate-950/35 px-4 text-white">
            <input className="w-full bg-transparent text-sm outline-none text-white" placeholder="e.g. National Air Quality Index" disabled />
          </span>
        </label>
        <label className="block">
          <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Source Agency</span>
          <span className="mt-1.5 flex min-h-11 items-center gap-3 rounded-xl border border-white/15 bg-slate-950/35 px-4 text-white">
            <input className="w-full bg-transparent text-sm outline-none text-white" placeholder="e.g. CPCB" disabled />
          </span>
        </label>
        <Button className="w-full rounded-xl bg-slate-950 text-white hover:bg-slate-900 border border-white/20" disabled>
          <Upload className="h-4 w-4" /> Add Dataset
        </Button>
      </div>
    </div>
  );
}
