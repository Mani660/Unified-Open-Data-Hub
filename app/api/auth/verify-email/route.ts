import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=invalid_token", req.url));
  }

  try {
    const record = await prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!record) {
      return NextResponse.redirect(new URL("/login?error=invalid_token", req.url));
    }

    if (record.expiresAt < new Date()) {
      await prisma.emailVerificationToken.delete({ where: { token } });
      return NextResponse.redirect(new URL("/login?error=token_expired", req.url));
    }

    // Mark email as verified
    await prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: true }
    });

    // Delete token
    await prisma.emailVerificationToken.delete({ where: { token } });

    // Send welcome email
    await sendWelcomeEmail(record.user.email, record.user.fullName);

    return NextResponse.redirect(new URL("/login?verified=true", req.url));

  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.redirect(new URL("/login?error=server_error", req.url));
  }
}
