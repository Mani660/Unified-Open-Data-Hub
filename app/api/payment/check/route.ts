import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get("domainId");
    const email = searchParams.get("email");

    if (!domainId || !email) {
      return NextResponse.json({ hasAccess: false, error: "Missing parameters" }, { status: 400 });
    }

    const access = await prisma.dashboardAccess.findUnique({
      where: {
        email_domainId: {
          email: email.trim().toLowerCase(),
          domainId: domainId.trim().toLowerCase(),
        },
      },
    });

    if (access && access.expiresAt > new Date()) {
      return NextResponse.json({ hasAccess: true });
    }

    return NextResponse.json({ hasAccess: false });
  } catch (error: any) {
    console.error("Payment check error:", error);
    return NextResponse.json({ hasAccess: false, error: error.message }, { status: 500 });
  }
}
