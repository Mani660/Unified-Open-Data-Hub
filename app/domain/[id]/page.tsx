"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Database, Download,
  Eye, Filter, LogOut, Search, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getSession, clearSession } from "@/lib/session";
import { DOMAINS, DATASETS, STATES } from "@/lib/data";

export default function DomainPage() {
  const router = useRouter();
  const params = useParams();
  const domainId = params.id as string;

  const [session, setSessionState] = useState<ReturnType<typeof getSession>>(null);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All States");
  const [formatFilter, setFormatFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [downloading, setDownloading] = useState<string | null>(null);

  const domain = DOMAINS.find(d => d.id === domainId);
  const datasets = DATASETS.filter(d => d.domain === domainId);

  useEffect(() => {
    const s = getSession();
    if (!s) { router.replace("/login"); return; }
    setSessionState(s);
  }, [router]);

  if (!domain) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      <p className="text-xl font-bold">Domain not found</p>
      <Button asChild><Link href="/dashboard">Back to Dashboard</Link></Button>
    </div>
  );

  const filtered = datasets.filter(d => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.state.toLowerCase().includes(search.toLowerCase()) ||
      d.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchState  = stateFilter === "All States" || d.state === stateFilter || d.state === "All States";
    const matchFormat = formatFilter === "All" || d.format === formatFilter;
    const matchYear   = yearFilter === "All" || d.year === yearFilter;
    return matchSearch && matchState && matchFormat && matchYear;
  });

  function handleDownload(id: string, title: string) {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      alert(`"${title}" download started!`);
    }, 1200);
  }

  function logout() { clearSession(); router.push("/login"); }

  const formatColors: Record<string, string> = {
    CSV:  "bg-emerald-500/12 text-emerald-400",
    XLSX: "bg-cyan-500/12 text-cyan-400",
    JSON: "bg-amber-500/12 text-amber-400",
    PDF:  "bg-rose-500/12 text-rose-400"
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" className="rounded-full" asChild>
              <Link href="/dashboard"><ArrowLeft className="h-4 w-4" /> Domains</Link>
            </Button>
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", domain.bg, domain.color)}>
              <domain.icon className="h-4 w-4" />
            </div>
            <span className="hidden font-bold sm:block">{domain.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400/14 text-cyan-400">
                <User className="h-3.5 w-3.5" />
              </div>
              <span className="hidden text-sm font-semibold sm:block">{session?.name}</span>
            </div>
            <Button variant="secondary" size="sm" onClick={logout} className="rounded-full">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Domain Hero */}
        <div className="mb-8 rounded-2xl border border-border/70 bg-gradient-to-r from-background/80 to-background/60 p-6 backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <div className={cn("flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl", domain.bg, domain.color)}>
              <domain.icon className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-black">{domain.name}</h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">{domain.description}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-sm font-semibold">
                  {domain.datasets.toLocaleString()} datasets
                </span>
                <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-sm font-semibold">
                  {domain.downloads} downloads
                </span>
                {domain.tags.map(t => (
                  <span key={t} className={cn("rounded-full px-3 py-1 text-sm font-semibold", domain.bg, domain.color)}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total Datasets",  value: datasets.length.toString() },
            { label: "Total Downloads", value: datasets.reduce((a, d) => a + d.downloads, 0).toLocaleString() },
            { label: "States Covered",  value: [...new Set(datasets.map(d => d.state))].length.toString() }
          ].map(({ label, value }) => (
            <Card key={label} className="p-4 text-center">
              <p className="text-2xl font-black">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </Card>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <div className="flex min-h-11 flex-1 items-center gap-3 rounded-xl border border-border/70 bg-background/70 px-4">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Search datasets, states, tags…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select value={stateFilter} onChange={e => setStateFilter(e.target.value)}
            className="rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-sm outline-none">
            {STATES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={formatFilter} onChange={e => setFormatFilter(e.target.value)}
            className="rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-sm outline-none">
            {["All","CSV","XLSX","JSON","PDF"].map(f => <option key={f}>{f}</option>)}
          </select>
          <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}
            className="rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-sm outline-none">
            {["All","2023","2022","2021","2011"].map(y => <option key={y}>{y}</option>)}
          </select>
        </div>

        {/* Dataset Table */}
        <Card className="overflow-hidden p-0">
          <div className="border-b border-border/70 p-4">
            <p className="font-bold">{filtered.length} dataset{filtered.length !== 1 ? "s" : ""} found</p>
          </div>
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Database className="mx-auto mb-3 h-10 w-10 opacity-30" />
              <p>No datasets match your filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {filtered.map(dataset => (
                <div key={dataset.id} className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold">{dataset.title}</h3>
                      <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", formatColors[dataset.format])}>
                        {dataset.format}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{dataset.description}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>📍 {dataset.state}</span>
                      <span>📅 {dataset.year}</span>
                      <span>📦 {dataset.size}</span>
                      <span>⬇️ {dataset.downloads.toLocaleString()} downloads</span>
                      <span>🏛️ {dataset.source}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="rounded-xl">
                      <Eye className="h-4 w-4" /> Preview
                    </Button>
                    <Button size="sm" className="rounded-xl"
                      onClick={() => handleDownload(dataset.id, dataset.title)}
                      disabled={downloading === dataset.id}>
                      {downloading === dataset.id
                        ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                        : <><Download className="h-4 w-4" /> Download</>
                      }
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Related Domains */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-black">Explore Other Domains</h2>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {DOMAINS.filter(d => d.id !== domainId).slice(0, 5).map(d => (
              <Link key={d.id} href={`/domain/${d.id}`}
                className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/60 p-3 transition-all hover:-translate-y-0.5 hover:border-foreground/20">
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", d.bg, d.color)}>
                  <d.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold">{d.name.replace(" Data", "")}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
