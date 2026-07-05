"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getSession } from "@/lib/session";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CloudSun, Database, ExternalLink, Leaf, Wind, Droplets, Trash2, Volume2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROJECTS, DOMAIN_META, PROJECT_LEVELS } from "@/lib/projects";
import { DOMAINS } from "@/lib/data";

// Add external dashboard links per domain here
const DOMAIN_DASHBOARD_LINKS: Record<string, string> = {
  population: "https://population-open.lovable.app",
  crime: "https://indian-crimedashboard.lovable.app",
  economy: "https://financegdp.lovable.app",
  healthcare: "https://clear-viz.lovable.app",
  transportation: "https://transportinfrastructure.lovable.app",
  environment: "https://environmentdash.lovable.app",
  climate: "https://climatedashboard.lovable.app",
  pollution: "https://pollutiondashbase.lovable.app",
  "pollution-all": "https://pollutiondashbase.lovable.app",
  "wind-pollution": "https://airpollutiondash.lovable.app",
  "water-pollution": "https://riverdashboard.lovable.app",
  "land-pollution": "https://landpollution.lovable.app",
  "sound-pollution": "https://noisepollution.lovable.app",
  agriculture: "https://agriculturedashboard.lovable.app",
  energy: "https://energy-power.lovable.app",
  education: "https://educationdashboard.lovable.app",
};

const DOMAIN_ALIASES: Record<string, string> = {
  finance: "economy",
  medical: "healthcare",
  transport: "transportation",
};

const DOMAIN_DISPLAY_META: Record<string, { name: string; color: string; bg: string }> = {
  finance: { name: "Finance Data", color: "text-yellow-400", bg: "bg-yellow-400/14" },
  medical: { name: "Medical Data", color: "text-pink-400", bg: "bg-pink-400/14" },
  transport: { name: "Transport & Infrastructure", color: "text-blue-400", bg: "bg-blue-400/14" },
  climate: { name: "Climate Data", color: "text-sky-400", bg: "bg-sky-400/14" },
  energy: { name: "Energy & Power", color: "text-orange-400", bg: "bg-orange-400/14" },
  pollution: { name: "Pollution Data", color: "text-purple-400", bg: "bg-purple-400/14" },
  "pollution-all": { name: "All Pollution Data", color: "text-purple-400", bg: "bg-purple-400/14" },
  "wind-pollution": { name: "Wind Pollution Data", color: "text-teal-400", bg: "bg-teal-400/14" },
  "water-pollution": { name: "Water Pollution Data", color: "text-blue-400", bg: "bg-blue-400/14" },
  "land-pollution": { name: "Land Pollution Data", color: "text-emerald-400", bg: "bg-emerald-400/14" },
  "sound-pollution": { name: "Sound Pollution Data", color: "text-rose-400", bg: "bg-rose-400/14" },
};

const ENVIRONMENT_CLIMATE_OPTIONS = [
  {
    id: "environment",
    name: "Environment",
    description: "Air, water, forest cover, pollution, biodiversity, waste, and environmental monitoring projects.",
    icon: Leaf,
    color: "text-green-400",
    bg: "bg-green-400/14",
  },
  {
    id: "climate",
    name: "Climate",
    description: "Rainfall, temperature, heatwaves, droughts, floods, extreme weather, and climate-risk projects.",
    icon: CloudSun,
    color: "text-sky-400",
    bg: "bg-sky-400/14",
  },
];

const POLLUTION_OPTIONS = [
  {
    id: "pollution-all",
    name: "Pollution",
    description: "Comprehensive list of all projects across air, water, land, and sound pollution sectors.",
    icon: Activity,
    color: "text-purple-400",
    bg: "bg-purple-400/14",
  },
  {
    id: "wind-pollution",
    name: "Wind Pollution",
    description: "Air Quality Index (AQI), PM2.5, PM10, industrial emissions, and vehicle exhaust monitoring.",
    icon: Wind,
    color: "text-teal-400",
    bg: "bg-teal-400/14",
  },
  {
    id: "water-pollution",
    name: "Water Pollution",
    description: "River water quality, groundwater contamination, biological oxygen demand (BOD), and coastal waters.",
    icon: Droplets,
    color: "text-blue-400",
    bg: "bg-blue-400/14",
  },
  {
    id: "land-pollution",
    name: "Land Pollution",
    description: "Municipal solid waste, landfill sites, plastic waste generation, and soil contamination.",
    icon: Trash2,
    color: "text-emerald-400",
    bg: "bg-emerald-400/14",
  },
  {
    id: "sound-pollution",
    name: "Sound Pollution",
    description: "Decibel levels, noise monitoring near hospitals/schools, and traffic noise hotspots.",
    icon: Volume2,
    color: "text-rose-400",
    bg: "bg-rose-400/14",
  },
];

export default function ProjectsPage() {
  const params = useParams();
  const id = params.id as string;
  const domainId = DOMAIN_ALIASES[id] ?? id;

  const meta = DOMAIN_META[domainId]
    ? { ...DOMAIN_META[domainId], ...(DOMAIN_DISPLAY_META[id] ?? {}) }
    : DOMAIN_DISPLAY_META[id]
      ? { id: domainId, ...DOMAIN_DISPLAY_META[id] }
      : undefined;
  const projects = PROJECTS[domainId] ?? [];
  const domain = DOMAINS.find(d => d.id === domainId);
  const projectsByLevel = PROJECT_LEVELS.map(level => ({
    level,
    projects: projects.filter(project => project.level === level),
  }));

  const dashboardLink = DOMAIN_DASHBOARD_LINKS[domainId] ?? "/dashboard";
  const isExternal = dashboardLink.startsWith("http");
  const [loading, setLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  const { data: nextAuthSession } = useSession();
  const userEmail = nextAuthSession?.user?.email || getSession()?.email || "";

  useEffect(() => {
    if (!userEmail) return;
    fetch(`/api/payment/check?domainId=${domainId}&email=${encodeURIComponent(userEmail)}`)
      .then(res => res.json())
      .then(data => {
        if (data.hasAccess) {
          setHasAccess(true);
        }
      })
      .catch(err => console.error("Access check failed:", err));
  }, [domainId, userEmail]);

  async function openDashboard() {
    if (hasAccess) {
      window.location.href = dashboardLink;
      return;
    }

    if (loading) return;
    setLoading(true);
    try {
      if (!(window as any).Razorpay) {
        alert("Payment SDK is loading. Please try again in a few seconds.");
        setLoading(false);
        return;
      }

      // Create Razorpay order (₹10 / 10 INR)
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 10 }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create payment order");
      }
      const { orderId } = data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: 1000,
        currency: "INR",
        name: "Unified Open Data Hub",
        description: `Unlock ${meta?.name || "Dashboard"} Access`,
        order_id: orderId,
        handler: (response: any) => {
          // Record payment success
          fetch("/api/payment/record", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ domainId, email: userEmail }),
          })
            .then(() => {
              window.location.href = dashboardLink;
            })
            .catch((err) => {
              console.error("Failed to record access:", err);
              // Still redirect user anyway so their payment is not blocked
              window.location.href = dashboardLink;
            });
        },
        prefill: {
          name: nextAuthSession?.user?.name || getSession()?.name || "Customer",
          email: userEmail || "customer@opendata.in",
        },
        theme: {
          color: "#06b6d4",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Payment processing failed");
    } finally {
      setLoading(false);
    }
  }

  if (id === "environment-climate") {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
          <div className="container flex h-16 items-center justify-between">
            <Button variant="secondary" size="sm" className="rounded-full" asChild>
              <Link href="/home"><ArrowLeft className="h-4 w-4" /> Home</Link>
            </Button>
            <span className="text-sm font-bold">Environment and Climate</span>
          </div>
        </header>

        <main className="container py-10">
          <div className="mb-10 rounded-2xl border border-border/70 bg-card/70 p-6">
            <p className="text-xs font-black uppercase tracking-widest text-green-400">Choose Area</p>
            <h1 className="mt-2 text-3xl font-black">Environment and Climate</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Select one area to view its project list. The dashboard button appears at the end of each project page.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {ENVIRONMENT_CLIMATE_OPTIONS.map(({ id, name, description, icon: Icon, color, bg }) => (
              <motion.div key={id} whileHover={{ y: -4 }}>
                <Link
                  href={`/domain/${id}/projects`}
                  className="group block h-full rounded-xl border border-border/70 bg-card/70 p-6 transition-all hover:border-foreground/20 hover:shadow-glow"
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${bg} ${color}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h2 className="mt-5 text-2xl font-black">{name}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                  <div className={`mt-5 flex items-center gap-1 text-sm font-bold ${color}`}>
                    View Projects <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (id === "pollution") {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
          <div className="container flex h-16 items-center justify-between">
            <Button variant="secondary" size="sm" className="rounded-full" asChild>
              <Link href="/home"><ArrowLeft className="h-4 w-4" /> Home</Link>
            </Button>
            <span className="text-sm font-bold">Pollution Data</span>
          </div>
        </header>

        <main className="container py-10">
          <div className="mb-10 rounded-2xl border border-border/70 bg-card/70 p-6">
            <p className="text-xs font-black uppercase tracking-widest text-purple-400">Choose Area</p>
            <h1 className="mt-2 text-3xl font-black">Pollution Data</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Select one area to view its project list. The dashboard button appears at the end of each project page.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {POLLUTION_OPTIONS.map(({ id, name, description, icon: Icon, color, bg }) => (
              <motion.div key={id} whileHover={{ y: -4 }}>
                <Link
                  href={`/domain/${id}/projects`}
                  className="group block h-full rounded-xl border border-border/70 bg-card/70 p-6 transition-all hover:border-foreground/20 hover:shadow-glow"
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${bg} ${color}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h2 className="mt-5 text-2xl font-black">{name}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                  <div className={`mt-5 flex items-center gap-1 text-sm font-bold ${color}`}>
                    View Projects <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!meta) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
        <p className="text-xl font-bold">Domain not found</p>
        <Button asChild><Link href="/home">Back to Home</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" className="rounded-full" asChild>
              <Link href="/home"><ArrowLeft className="h-4 w-4" /> Home</Link>
            </Button>
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${meta.bg} ${meta.color}`}>
              {domain ? <domain.icon className="h-4 w-4" /> : <Database className="h-4 w-4" />}
            </div>
            <span className="hidden font-bold sm:block">{meta.name}</span>
          </div>
          <Button onClick={openDashboard} disabled={loading}>
            <ExternalLink className="h-4 w-4" /> {loading ? "Processing..." : hasAccess ? "Open Dashboard" : "Pay and use Dashboard"}
          </Button>
        </div>
      </header>

      <main className="container py-10">
        {/* Hero */}
        <div className={`mb-10 rounded-2xl border border-border/70 p-6 ${meta.bg}`}>
          <div className="flex items-center gap-4">
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-background/30 ${meta.color}`}>
              {domain ? <domain.icon className="h-8 w-8" /> : <Database className="h-8 w-8" />}
            </div>
            <div>
              <p className={`text-xs font-black uppercase tracking-widest ${meta.color}`}>Explore Domain</p>
              <h1 className="mt-1 text-3xl font-black">{meta.name} — Projects</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {projects.length} projects available · Click any project to view step-by-step details
              </p>
            </div>
          </div>
        </div>

        {/* Project boxes */}
        <div className="space-y-10">
          {projectsByLevel.map(({ level, projects: levelProjects }) => (
            <section key={level}>
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className={`text-xs font-black uppercase tracking-widest ${meta.color}`}>Project Level</p>
                  <h2 className="text-2xl font-black">{level}</h2>
                </div>
                <span className="rounded-full border border-border/70 px-3 py-1 text-xs font-black text-muted-foreground">
                  {levelProjects.length} projects
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {levelProjects.map(({ slug, title, steps, dataUsed }, i) => (
                  <motion.div
                    key={slug}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4 }}
                  >
                    <Link
                      href={`/domain/${id}/projects/${slug}`}
                      className="group flex h-full flex-col rounded-xl border border-border/70 bg-card/70 p-5 transition-all hover:border-foreground/20 hover:shadow-glow"
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${meta.bg} ${meta.color}`}>
                        <Database className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 font-black leading-snug">{title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {steps.length} steps to complete
                      </p>
                      <p className="mt-3 rounded-lg border border-border/60 bg-background/45 p-3 text-xs leading-5 text-muted-foreground">
                        <span className="font-black text-foreground">Data used:</span> {dataUsed}
                      </p>
                      <div className={`mt-auto flex items-center gap-1 pt-4 text-sm font-bold ${meta.color}`}>
                        View Details
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Dashboard button at the end */}
        <div className="mt-12 flex justify-center">
          <Button size="lg" onClick={openDashboard} disabled={loading}>
            <ExternalLink className="h-4 w-4" />
            {loading ? "Processing..." : hasAccess ? "Open Dashboard" : "Pay and use Dashboard"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
