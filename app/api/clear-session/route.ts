import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Called when login page loads — clears any stale auth cookie server-side
export async function GET() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("dv_auth", "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0)
  });
  return res;
}
