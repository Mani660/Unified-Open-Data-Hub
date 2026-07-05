"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle, ArrowRight, BarChart3, CheckCircle2, Database,
  Download, ExternalLink, FileCheck, Globe, LayoutDashboard, Link2,
  LogOut, Moon, Plus, Settings, ShieldCheck, Sun, Trash2,
  TrendingUp, Users, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getSession, clearSession } from "@/lib/session";
import { DOMAINS, DATASETS } from "@/lib/data";

type Tab = "dashboard" | "domains" | "datasets" | "users" | "analytics" | "links";

export interface AdminLink {
  id: string;
  title: string;
  url: string;
  domain: string; // domain id or "all"
  description: string;
  addedAt: string;
}

function getAdminLinks(): AdminLink[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("dv_admin_links") || "[]"); } catch { return []; }
}
function saveAdminLinks(links: AdminLink[]) {
  localStorage.setItem("dv_admin_links", JSON.stringify(links));
}

const MOCK_USERS = [
  { id: "1", name: "Arjun Sharma",   email: "arjun@example.com",  role: "user",  status: "active",  joined: "Jan 2026" },
  { id: "2", name: "Priya Nair",     email: "priya@example.com",  role: "user",  status: "active",  joined: "Feb 2026" },
  { id: "3", name: "Rahul Gupta",    email: "rahul@example.com",  role: "user",  status: "blocked", joined: "Mar 2026" },
  { id: "4", name: "Sneha Reddy",    email: "sneha@example.com",  role: "user",  status: "active",  joined: "Apr 2026" },
  { id: "5", name: "Vikram Singh",   email: "vikram@example.com", role: "admin", status: "active",  joined: "Jan 2026" }
];

export default function AdminDashboard() {
  const router = useRouter();
  const [session, setSessionState] = useState<ReturnType<typeof getSession>>(null);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [dark, setDark] = useState(true);
  const [users, setUsers] = useState(MOCK_USERS);
  const [domains, setDomains] = useState(DOMAINS);
  const [adminLinks, setAdminLinks] = useState<AdminLink[]>([]);
  const [linkForm, setLinkForm] = useState({ title: "", url: "", domain: "all", description: "" });
  const [linkError, setLinkError] = useState("");
  const [linkSuccess, setLinkSuccess] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const s = getSession();
    if (!s) { router.replace("/login"); return; }
    if (s.role !== "admin") { router.replace("/dashboard"); return; }
    setSessionState(s);
    setAdminLinks(getAdminLinks());
  }, [router]);

  function logout() { clearSession().then(() => router.push("/login")); }

  function toggleUserBlock(id: string) {
    setUsers(u => u.map(user =>
      user.id === id ? { ...user, status: user.status === "blocked" ? "active" : "blocked" } : user
    ));
  }

  function handleAddLink(e: React.FormEvent) {
    e.preventDefault();
    setLinkError(""); setLinkSuccess("");
    if (!linkForm.title.trim()) { setLinkError("Title is required."); return; }
    if (!linkForm.url.trim())   { setLinkError("URL is required."); return; }
    try { new URL(linkForm.url); } catch { setLinkError("Please enter a valid URL (include https://)."); return; }
    const newLink: AdminLink = {
      id: crypto.randomUUID(),
      title: linkForm.title.trim(),
      url: linkForm.url.trim(),
      domain: linkForm.domain,
      description: linkForm.description.trim(),
      addedAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    };
    const updated = [newLink, ...adminLinks];
    saveAdminLinks(updated);
    setAdminLinks(updated);
    setLinkForm({ title: "", url: "", domain: "all", description: "" });
    setLinkSuccess("Link added successfully! It will appear on the user dashboard.");
    setTimeout(() => setLinkSuccess(""), 3000);
  }

  function deleteLink(id: string) {
    const updated = adminLinks.filter(l => l.id !== id);
    saveAdminLinks(updated);
    setAdminLinks(updated);
  }

  if (!session) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-rose-500" />
    </div>
  );

  const navItems: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "dashboard", label: "Dashboard",       icon: LayoutDashboard },
    { id: "domains",   label: "Manage Domains",  icon: Database        },
    { id: "datasets",  label: "Manage Datasets", icon: FileCheck       },
    { id: "users",     label: "Manage Users",    icon: Users           },
    { id: "analytics", label: "Analytics",       icon: BarChart3       },
    { id: "links",     label: "Manage Links",    icon: Link2           }
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border/70 bg-background/80 backdrop-blur-xl lg:flex">
        <div className="flex items-center gap-3 border-b border-border/70 p-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 text-white">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-black">DataVerse AI</p>
            <p className="text-xs text-rose-400 font-semibold">Admin Portal</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                tab === id ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}>
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </nav>
        <div className="border-t border-border/70 p-3 space-y-1">
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
            <Settings className="h-4 w-4" /> Settings
          </button>
          <button onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-400 hover:bg-rose-400/10 transition-all">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/70 bg-background/90 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-3 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 text-white">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span className="font-black text-sm">Admin Portal</span>
          </div>
          <div className="hidden lg:block">
            <h1 className="font-black capitalize">{tab.replace("-", " ")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setDark(d => !d)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground hover:text-foreground transition">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <div className="flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-400/14 text-rose-400">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <span className="hidden text-sm font-semibold sm:block">{session.name}</span>
            </div>
            <Button variant="secondary" size="sm" onClick={logout} className="rounded-full lg:hidden">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Mobile nav */}
        <div className="flex gap-1 overflow-x-auto border-b border-border/70 bg-background/80 px-4 py-2 lg:hidden">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={cn("flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                tab === id ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"
              )}>
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </div>

        <main className="flex-1 overflow-auto p-6">

          {/* ── DASHBOARD TAB ── */}
          {tab === "dashboard" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black">Welcome back, {session.name} 👋</h2>
                <p className="text-muted-foreground">Here's what's happening on DataVerse AI today.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Total Domains",   value: DOMAINS.length.toString(),                                  icon: Database,    color: "text-cyan-400",    bg: "bg-cyan-400/14"    },
                  { label: "Total Datasets",  value: DATASETS.length.toString(),                                 icon: FileCheck,   color: "text-emerald-400", bg: "bg-emerald-400/14" },
                  { label: "Total Downloads", value: DATASETS.reduce((a,d)=>a+d.downloads,0).toLocaleString(),  icon: Download,    color: "text-amber-400",   bg: "bg-amber-400/14"   },
                  { label: "Total Users",     value: users.length.toString(),                                    icon: Users,       color: "text-rose-400",    bg: "bg-rose-400/14"    }
                ].map(({ label, value, icon: Icon, color, bg }, i) => (
                  <motion.div key={label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.08 }}>
                    <Card className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{label}</p>
                          <p className="mt-1 text-3xl font-black">{value}</p>
                        </div>
                        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", bg, color)}>
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Recent datasets */}
              <Card className="overflow-hidden p-0">
                <div className="border-b border-border/70 p-4 flex items-center justify-between">
                  <h3 className="font-black">Recent Datasets</h3>
                  <Button variant="secondary" size="sm" className="rounded-full" onClick={() => setTab("datasets")}>
                    View All <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
                <div className="divide-y divide-border/60">
                  {DATASETS.slice(0, 5).map(d => (
                    <div key={d.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-semibold text-sm">{d.title}</p>
                        <p className="text-xs text-muted-foreground">{d.state} · {d.year} · {d.format}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{d.downloads.toLocaleString()} downloads</span>
                        <span className="rounded-full bg-emerald-500/12 px-2 py-0.5 text-xs font-bold text-emerald-400">Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ── DOMAINS TAB ── */}
          {tab === "domains" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">Manage Domains</h2>
                <Button className="rounded-xl">+ Add Domain</Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {domains.map(domain => (
                  <Card key={domain.id} className="p-5">
                    <div className="flex items-start justify-between">
                      <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", domain.bg, domain.color)}>
                        <domain.icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-emerald-500/12 px-2 py-0.5 text-xs font-bold text-emerald-400">Active</span>
                    </div>
                    <h3 className="mt-3 font-black">{domain.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{domain.description}</p>
                    <div className="mt-4 flex gap-2">
                      <Button variant="secondary" size="sm" className="flex-1 rounded-xl">Edit</Button>
                      <Button variant="secondary" size="sm" className="rounded-xl text-rose-400 hover:text-rose-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ── DATASETS TAB ── */}
          {tab === "datasets" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">Manage Datasets</h2>
                <Button className="rounded-xl">+ Add Dataset</Button>
              </div>
              <Card className="overflow-hidden p-0">
                <div className="divide-y divide-border/60">
                  {DATASETS.map(d => (
                    <div key={d.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-bold text-sm">{d.title}</p>
                        <p className="text-xs text-muted-foreground">{d.domain} · {d.state} · {d.year} · {d.format} · {d.size}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{d.downloads.toLocaleString()} ↓</span>
                        <span className="rounded-full bg-emerald-500/12 px-2 py-0.5 text-xs font-bold text-emerald-400">Active</span>
                        <Button variant="secondary" size="sm" className="rounded-xl">Edit</Button>
                        <Button variant="secondary" size="sm" className="rounded-xl text-rose-400">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ── USERS TAB ── */}
          {tab === "users" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black">Manage Users</h2>
              <Card className="overflow-hidden p-0">
                <div className="divide-y divide-border/60">
                  {users.map(user => (
                    <div key={user.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-bold text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email} · Joined {user.joined}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold",
                          user.role === "admin" ? "bg-rose-500/12 text-rose-400" : "bg-cyan-500/12 text-cyan-400"
                        )}>{user.role}</span>
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold",
                          user.status === "active" ? "bg-emerald-500/12 text-emerald-400" : "bg-amber-500/12 text-amber-400"
                        )}>{user.status}</span>
                        <Button variant="secondary" size="sm" className="rounded-xl"
                          onClick={() => toggleUserBlock(user.id)}>
                          {user.status === "blocked" ? <><CheckCircle2 className="h-4 w-4" /> Unblock</> : <><XCircle className="h-4 w-4" /> Block</>}
                        </Button>
                        <Button variant="secondary" size="sm" className="rounded-xl text-rose-400">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ── ANALYTICS TAB ── */}
          {tab === "analytics" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black">Analytics</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Total Users",     value: users.length.toString(),                                   icon: Users,      color: "text-cyan-400",    bg: "bg-cyan-400/14"    },
                  { label: "Total Datasets",  value: DATASETS.length.toString(),                                icon: Database,   color: "text-emerald-400", bg: "bg-emerald-400/14" },
                  { label: "Total Downloads", value: DATASETS.reduce((a,d)=>a+d.downloads,0).toLocaleString(), icon: Download,   color: "text-amber-400",   bg: "bg-amber-400/14"   },
                  { label: "Active Domains",  value: DOMAINS.length.toString(),                                 icon: TrendingUp, color: "text-rose-400",    bg: "bg-rose-400/14"    }
                ].map(({ label, value, icon: Icon, color, bg }) => (
                  <Card key={label} className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="mt-1 text-2xl font-black">{value}</p>
                      </div>
                      <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", bg, color)}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Downloads by domain */}
              <Card className="p-6">
                <h3 className="mb-4 font-black">Downloads by Domain</h3>
                <div className="space-y-3">
                  {DOMAINS.map(d => {
                    const total = DATASETS.filter(ds => ds.domain === d.id).reduce((a, ds) => a + ds.downloads, 0);
                    const max = 50000;
                    const pct = Math.min((total / max) * 100, 100);
                    return (
                      <div key={d.id} className="flex items-center gap-3">
                        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", d.bg, d.color)}>
                          <d.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-semibold">{d.name.replace(" Data","")}</span>
                            <span className="text-muted-foreground">{total.toLocaleString()}</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted">
                            <div className={cn("h-2 rounded-full transition-all", d.bg.replace("/14",""))} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Popular datasets */}
              <Card className="overflow-hidden p-0">
                <div className="border-b border-border/70 p-4">
                  <h3 className="font-black">Most Downloaded Datasets</h3>
                </div>
                <div className="divide-y divide-border/60">
                  {[...DATASETS].sort((a,b) => b.downloads - a.downloads).slice(0,5).map((d,i) => (
                    <div key={d.id} className="flex items-center gap-4 p-4">
                      <span className="text-2xl font-black text-muted-foreground/40">#{i+1}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{d.title}</p>
                        <p className="text-xs text-muted-foreground">{d.domain} · {d.state}</p>
                      </div>
                      <span className="font-bold text-sm">{d.downloads.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
