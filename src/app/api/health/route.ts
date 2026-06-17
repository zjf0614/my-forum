import { NextResponse } from "next/server";

export async function GET() {
  const results: Record<string, unknown> = {};

  // 1. Check env vars
  results.DATABASE_URL_exists = !!process.env.DATABASE_URL;
  results.DATABASE_URL_prefix = process.env.DATABASE_URL?.substring(0, 30);
  results.NEXTAUTH_SECRET_exists = !!process.env.NEXTAUTH_SECRET;
  results.NEXTAUTH_URL = process.env.NEXTAUTH_URL;

  // 2. Test Prisma connection
  try {
    const { prisma } = await import("@/lib/prisma");
    const dbStart = Date.now();
    const count = await prisma.user.count();
    results.db_connected = true;
    results.db_latency_ms = Date.now() - dbStart;
    results.user_count = count;
  } catch (e: any) {
    results.db_connected = false;
    results.db_error = e.message?.slice(0, 200);
    results.db_errorCode = e.code;
    results.db_clientVersion = e.clientVersion;
  }

  return NextResponse.json(results);
}
