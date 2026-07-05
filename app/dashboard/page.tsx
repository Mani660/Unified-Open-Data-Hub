"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import {
  ArrowRight, Bell, Bot, Database, Download,
  LogOut, Moon, Search, Sparkles, Sun, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getSession, clearSession } from "@/lib/session";
import { DOMAINS, DATASETS } from "@/lib/data";

export default function UserDashboard() {
  const router = useRouter();
  const { data: nextAuthSession, status } = useSession();
  const [session, setSessionState] = useState<ReturnType<typeof getSession>>(null);
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(true);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    // Support both NextAuth (Google) and localStorage (demo) sessions
    if (status === "loading") return;

    if (nextAuthSession?.user) {
      // Google / NextAuth sign-in
      const role = (nextAuthSession.user as any).role ?? "user";
      if (role === "admin") { router.replace("/admin/dashboard"); return; }
      setSessionState({
        role: "user",
        email: nextAuthSession.user.email ?? "",
        name: nextAuthSession.user.name ?? "User"
      });
      return;
    }

    // Fall back to localStorage demo session
    const s = getSession();
    if (!s) { router.replace("/login"); return; }
    if (s.role === "admin") { router.replace("/admin/dashboard"); return; }
    setSessionState(s);
  }, [router, nextAuthSession, status]);

  async function logout() {
    if (nextAuthSession) {
      await nextAuthSignOut({ callbackUrl: "/login" });
    } else {
      clearSession().then(() => router.push("/login"));
    }
  }

  function handleAI(e: React.FormEvent) {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setTimeout(() => {
      const q = aiQuery.toLowerCase();
      const matched = DATASETS.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.domain.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q))
      );
      setAiResponse(
        matched.length > 0
          ? `I found ${matched.length} dataset${matched.length > 1 ? "s" : ""} related to "${aiQuery}": ${matched.slice(0, 3).map(d => d.title).join(", ")}${matched.length > 3 ? ` and ${matched.length - 3} more` : ""}.`
          : `No datasets found for "${aiQuery}". Try searching for Population, Crime, Literacy Rate, Healthcare, Agriculture, Economy, Employment, Environment and Climate, Transportation, or Smart Cities.`
      );
      setAiLoading(false);
    }, 900);
  }

  const filtered = DOMAINS.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.description.toLowerCase().includes(search.toLowerCase())
  );

  if (!session) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-cyan-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white">
              <Database className="h-4 w-4" />
            </span>
            <div className="hidden sm:block">
              <p className="text-sm font-black">DataVerse AI</p>
              <p className="text-xs text-muted-foreground">Open Data Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setDark(d => !d)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground hover:text-foreground transition">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground hover:text-foreground transition">
              <Bell className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400/14 text-cyan-400">
                <User className="h-3.5 w-3.5" />
              </div>
              <span className="hidden text-sm font-semibold sm:block">{session.name}</span>
            </div>
            <Button variant="secondary" size="sm" onClick={logout} className="rounded-full">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-black">
            Welcome back, <span className="gradient-text">{session.name.split(" ")[0]}</span> 👋
          </h1>
          <p className="mt-1 text-muted-foreground">Explore India's open datasets. Search, preview, and download verified data.</p>
        </div>




        {/* AI Assistant */}
        <Card className="mb-8 overflow-hidden p-0">
          <div className="border-b border-border/70 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold">DataVerse AI Assistant</p>
                <p className="text-xs text-emerald-500">● Online · Instant dataset discovery</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            {aiResponse && (
              <div className="mb-4 rounded-xl bg-muted/60 p-4 text-sm leading-6">{aiResponse}</div>
            )}
            <form onSubmit={handleAI} className="flex gap-2">
              <input
                className="flex-1 rounded-xl border border-border/70 bg-background/70 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/40 transition-colors"
                placeholder='Try: "I need Telangana crime data" or "population statistics Maharashtra"'
                value={aiQuery}
                onChange={e => setAiQuery(e.target.value)}
              />
              <Button type="submit" disabled={aiLoading} className="rounded-xl">
                {aiLoading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" /> : <><Sparkles className="h-4 w-4" /> Ask AI</>}
              </Button>
            </form>
          </div>
        </Card>

        {/* Domain Search */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">Select a Domain</h2>
            <p className="text-sm text-muted-foreground">Choose a domain to explore its datasets and dashboards</p>
          </div>
          <div className="flex min-h-11 items-center gap-3 rounded-xl border border-border/70 bg-background/70 px-4 w-64">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Search domains…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Domain Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((domain, i) => (
            <motion.div key={domain.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}>
              <Card className="group h-full cursor-pointer p-5 transition-all hover:-translate-y-1 hover:shadow-glow">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", domain.bg, domain.color)}>
                  <domain.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-black">{domain.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-2">{domain.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {domain.tags.map(t => (
                    <span key={t} className="rounded-full border border-border/60 px-2 py-0.5 text-xs text-muted-foreground">{t}</span>
                  ))}
                </div>
                <div className="mt-4">
                  <Button className="mt-2 w-full rounded-xl" variant="secondary" asChild>
                    <Link href={domain.id === "environment" ? "/domain/environment-climate/projects" : `/domain/${domain.id}/projects`}>
                      View Projects <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
