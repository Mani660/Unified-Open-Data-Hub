"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getSession } from "@/lib/session";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Database, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PROJECTS, DOMAIN_META } from "@/lib/projects";
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

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const domainId = DOMAIN_ALIASES[id] ?? id;
  const slug = params.slug as string;

  const meta = DOMAIN_META[domainId]
    ? { ...DOMAIN_META[domainId], ...(DOMAIN_DISPLAY_META[id] ?? {}) }
    : DOMAIN_DISPLAY_META[id]
      ? { id: domainId, ...DOMAIN_DISPLAY_META[id] }
      : undefined;
  const projects = PROJECTS[domainId] ?? [];
  const project = projects.find(p => p.slug === slug);
  const domain = DOMAINS.find(d => d.id === domainId);

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

  if (!meta || !project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
        <p className="text-xl font-bold">Project not found</p>
        <Button asChild><Link href={`/domain/${id}/projects`}>Back to Projects</Link></Button>
      </div>
    );
  }

  // Find prev/next project for navigation
  const currentIndex = projects.findIndex(p => p.slug === slug);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" className="rounded-full" asChild>
              <Link href={`/domain/${id}/projects`}>
                <ArrowLeft className="h-4 w-4" /> Projects
              </Link>
            </Button>
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${meta.bg} ${meta.color}`}>
              {domain ? <domain.icon className="h-4 w-4" /> : <Database className="h-4 w-4" />}
            </div>
            <span className="hidden text-sm font-bold sm:block">{meta.name}</span>
          </div>
          <Button onClick={openDashboard} disabled={loading}>
            <ExternalLink className="h-4 w-4" /> {loading ? "Processing..." : hasAccess ? "Open Dashboard" : "Pay and use Dashboard"}
          </Button>
        </div>
      </header>

      <main className="container max-w-3xl py-10">
        {/* Project title */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className={`mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${meta.bg} ${meta.color}`}>
            {domain ? <domain.icon className="h-3.5 w-3.5" /> : <Database className="h-3.5 w-3.5" />}
            {meta.name} · {project.level}
          </div>
          <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{project.title}</h1>
          <p className="mt-3 text-muted-foreground">
            Follow these {project.steps.length} steps to complete this project using Indian open data.
          </p>
          <div className="mt-5 rounded-xl border border-border/70 bg-card/70 p-4">
            <p className={`text-xs font-black uppercase tracking-widest ${meta.color}`}>Data used</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{project.dataUsed}</p>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="mt-8 space-y-4">
          {project.steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="flex items-start gap-4 p-5">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${meta.bg} ${meta.color}`}>
                  {i + 1}
                </span>
                <div className="flex-1 pt-1">
                  <p className="font-semibold leading-7">{step}</p>
                </div>
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-muted-foreground/30" />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Prev / Next navigation */}
        <div className="mt-10 flex items-center justify-between gap-4">
          {prevProject ? (
            <Button variant="secondary" asChild>
              <Link href={`/domain/${id}/projects/${prevProject.slug}`}>
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:block truncate max-w-[160px]">{prevProject.title}</span>
              </Link>
            </Button>
          ) : <div />}

          {nextProject ? (
            <Button asChild>
              <Link href={`/domain/${id}/projects/${nextProject.slug}`}>
                <span className="hidden sm:block truncate max-w-[160px]">{nextProject.title}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : <div />}
        </div>

        {/* Dashboard button */}
        <div className="mt-10 flex justify-center">
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
