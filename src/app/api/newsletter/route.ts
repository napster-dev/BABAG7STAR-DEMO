import { NextResponse } from "next/server";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const { email, source } = await req.json();
    if (!email || !/^\S+@\S+\.\S+$/.test(String(email))) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }
    try {
      await db.insert(newsletterSubscribers).values({ email: String(email).toLowerCase().slice(0, 255), source: String(source || "footer").slice(0, 64) });
    } catch (e: unknown) {
      // unique violation → already subscribed, still succeed with code
      const msg = e instanceof Error ? e.message : "";
      if (!/duplicate|unique/i.test(msg)) throw e;
    }
    return NextResponse.json({ ok: true, message: "Welcome to the Star Club! Use code B7STAR10 for 10% off. ★" });
  } catch (e) {
    console.error("newsletter failed", e);
    return NextResponse.json({ error: "Could not subscribe. Try again." }, { status: 500 });
  }
}
