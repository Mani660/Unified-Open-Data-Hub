import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { domainId, email } = await request.json();

    if (!domainId || !email) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const emailClean = email.trim().toLowerCase();
    const domainClean = domainId.trim().toLowerCase();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days access

    await prisma.dashboardAccess.upsert({
      where: {
        email_domainId: {
          email: emailClean,
          domainId: domainClean,
        },
      },
      update: {
        expiresAt,
      },
      create: {
        email: emailClean,
        domainId: domainClean,
        expiresAt,
      },
    });

    return NextResponse.json({ success: true, expiresAt });
  } catch (error: any) {
    console.error("Payment record error:", error);
    return NextResponse.json({ error: error.message || "Failed to record payment" }, { status: 500 });
  }
}
